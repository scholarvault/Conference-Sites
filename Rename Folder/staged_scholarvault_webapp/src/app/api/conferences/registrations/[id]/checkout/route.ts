import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { randomBytes } from "node:crypto";
import DodoPayments from "dodopayments";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  conferenceGoldPrice,
  conferenceProductPrice,
} from "@/features/conferences/paymentPricing";
import {
  resolvePaymentCapabilities,
  type ConferencePaymentProvider,
} from "@/features/conferences/paymentCapabilities";
import {
  applyPaymentAction,
  applyTransferAction,
} from "@/features/conferences/registrationStateMachine";
import { recordConferenceFunnelEvent } from "@/features/conferences/funnelTracking";
import { requestOmniwarePaymentUrl } from "@/lib/billing/federalOmniware";

function createDodoClient() {
  const bearerToken = process.env.DODO_PAYMENTS_API_KEY?.trim();
  if (!bearerToken) return null;

  return new DodoPayments({
    bearerToken,
    environment:
      process.env.DODO_PAYMENTS_ENVIRONMENT === "live_mode"
        ? "live_mode"
        : "test_mode",
  });
}

function generateCompactOrderId(shortName: string): string {
  const cleanShort = (shortName || "CONF").replace(/[^A-Za-z0-9]/g, "").slice(0, 7).toUpperCase();
  const timeHex = Date.now().toString(36).slice(-6).toUpperCase();
  const randHex = randomBytes(2).toString("hex").toUpperCase();
  return `SV-${cleanShort}-${timeHex}-${randHex}`.slice(0, 30);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  const { data: registration, error } = await supabaseAdmin
    .from("conference_registrations")
    .select(
      "*, category:conference_registration_categories(*), edition:conference_editions(id,slug,name,short_name,payment_config)"
    )
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!registration) {
    return NextResponse.json({ error: "Registration not found" }, { status: 404 });
  }

  if (registration.payment_status === "paid" || registration.payment_status === "waived") {
    return NextResponse.json({ error: "Registration is already paid" }, { status: 409 });
  }

  if (registration.registration_status === "cancelled") {
    return NextResponse.json({ error: "Cancelled registrations cannot be paid" }, { status: 409 });
  }

  if (!registration.category?.is_active) {
    return NextResponse.json({ error: "This registration category is no longer active" }, { status: 409 });
  }

  const priceTier = String(registration.custom_answers?.pricing?.tier || "standard");
  const expectedAmount = Number(registration.amount_due);
  const expectedCurrency = String(
    registration.currency || registration.category?.currency || "INR"
  ).trim().toUpperCase();

  const capabilities = resolvePaymentCapabilities(registration.edition?.payment_config, expectedCurrency);
  const requestedProvider = String(
    body.payment_method || registration.category?.payment_config?.provider || capabilities.defaultProvider
  ) as ConferencePaymentProvider;

  const provider = capabilities.providers.includes(requestedProvider)
    ? requestedProvider
    : capabilities.defaultProvider;

  const orderId = generateCompactOrderId(registration.edition?.short_name || "CONF");
  const now = new Date().toISOString();
  const customerEmail =
    user?.primaryEmailAddress?.emailAddress || registration.attendee_snapshot?.email || "";

  // 1. Bank Transfer Flow
  if (provider === "bank_transfer") {
    const utrNumber = String(body.utr_number || "").trim().toUpperCase();
    const depositorName = String(body.depositor_name || user?.fullName || registration.attendee_snapshot?.name || "Participant").trim();
    const bankName = String(body.bank_name || "").trim();

    if (!utrNumber || !/^[A-Z0-9]{10,24}$/.test(utrNumber)) {
      return NextResponse.json(
        { error: "A valid 10 to 24 character alphanumeric UTR/Transaction Reference is required." },
        { status: 400 }
      );
    }

    // Check UTR uniqueness in this edition
    const { data: existingUtr } = await supabaseAdmin
      .from("conference_bank_transfers")
      .select("id")
      .eq("conference_edition_id", registration.conference_edition_id)
      .eq("utr_normalized", utrNumber)
      .maybeSingle();

    if (existingUtr) {
      return NextResponse.json(
        { error: "This UTR number has already been submitted for this conference." },
        { status: 409 }
      );
    }

    // Pure state transition
    const nextState = applyTransferAction(
      {
        paymentStatus: registration.payment_status,
        registrationStatus: registration.registration_status,
        transferStatus: null,
      },
      "submit"
    );

    await supabaseAdmin
      .from("conference_registrations")
      .update({
        payment_status: nextState.paymentStatus,
        registration_status: nextState.registrationStatus,
        updated_at: now,
      })
      .eq("id", registration.id);

    await supabaseAdmin.from("conference_bank_transfers").insert({
      conference_edition_id: registration.conference_edition_id,
      registration_id: registration.id,
      utr_number: utrNumber,
      utr_normalized: utrNumber,
      transfer_amount: expectedAmount,
      currency: expectedCurrency,
      bank_name: bankName || null,
      depositor_name: depositorName,
      transfer_status: "submitted",
      metadata: { order_id: orderId },
      created_at: now,
      updated_at: now,
    });

    // Note: conference_payments.status MUST be 'pending' to satisfy DB check constraint
    await supabaseAdmin.from("conference_payments").insert({
      registration_id: registration.id,
      provider: "bank_transfer",
      provider_checkout_id: orderId,
      amount: expectedAmount,
      currency: expectedCurrency,
      status: "pending",
      metadata: {
        order_id: orderId,
        utr_number: utrNumber,
        attendee_email: customerEmail,
      },
      created_at: now,
      updated_at: now,
    });

    // Enqueue confirmation outbox email
    await supabaseAdmin.from("conference_email_outbox").insert({
      conference_edition_id: registration.conference_edition_id,
      event_key: "payment_verification_pending",
      idempotency_key: `bank_transfer_submitted:${registration.id}`,
      recipient_email: customerEmail,
      recipient_user_id: userId,
      template_key: "payment_required",
      template_data: {
        conferenceName: registration.edition?.name,
        registrationNumber: registration.registration_number,
        utrNumber,
        amount: `${expectedCurrency === "INR" ? "₹" : "$"}${expectedAmount.toLocaleString()}`,
      },
    });

    return NextResponse.json({
      success: true,
      provider: "bank_transfer",
      status: "awaiting_verification",
      registration_number: registration.registration_number,
      order_id: orderId,
    });
  }

  // 2. Federal Omniware (INR)
  if (provider === "federal_omniware") {
    await supabaseAdmin
      .from("conference_payments")
      .upsert(
        {
          registration_id: registration.id,
          provider: "federal_omniware",
          provider_checkout_id: orderId,
          amount: expectedAmount,
          currency: "INR",
          status: "pending",
          metadata: {
            order_id: orderId,
            attendee_email: customerEmail,
          },
          updated_at: now,
        },
        { onConflict: "provider,provider_payment_id" }
      );

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.scholarvault.in";
    const returnUrl = `${appUrl}/api/payments/federal/return`;

    const omniwareResult = await requestOmniwarePaymentUrl({
      order_id: orderId,
      amount: expectedAmount,
      currency: "INR",
      description: `${registration.edition?.short_name || "SV"} Registration: ${registration.registration_number}`,
      name: user?.fullName || registration.attendee_snapshot?.name || "Participant",
      email: customerEmail,
      phone: (registration.attendee_snapshot?.phone || "9999999999").replace(/[^0-9]/g, "").slice(-10),
      city: registration.attendee_snapshot?.city || "Bengaluru",
      country: "IND",
      zip_code: registration.attendee_snapshot?.zip_code || "560001",
      return_url: returnUrl,
      return_url_failure: returnUrl,
      return_url_cancel: returnUrl,
      payment_options: "upi,nb,cc,dp",
      payment_page_display_text: `${registration.edition?.name || "Conference"} Registration`,
      expiry_in_minutes: 30,
    });

    if (!omniwareResult.success || !omniwareResult.url) {
      return NextResponse.json(
        { error: omniwareResult.error || "Failed to generate Federal Omniware payment session." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      provider: "federal_omniware",
      checkout_url: omniwareResult.url,
      order_id: orderId,
    });
  }

  // 3. Dodo Payments (USD)
  const dodo = createDodoClient();
  if (!dodo) {
    return NextResponse.json({ error: "Dodo Payments is not configured" }, { status: 503 });
  }

  const standardProduct = conferenceProductPrice(registration.category, "USD");
  let productId = standardProduct?.productId;

  if (priceTier === "gold_bundle") {
    const goldProduct = conferenceGoldPrice(registration.category, "USD");
    if (goldProduct?.productId) {
      productId = goldProduct.productId;
    }
  }

  if (!productId) {
    return NextResponse.json(
      { error: "Pricing product could not be resolved for this pass category" },
      { status: 409 }
    );
  }

  if (!customerEmail) {
    return NextResponse.json(
      { error: "A verified email address is required before payment" },
      { status: 409 }
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.scholarvault.in";
  try {
    const session = await dodo.checkoutSessions.create(
      {
        product_cart: [{ product_id: productId, quantity: 1 }],
        customer: {
          email: customerEmail,
          name: user?.fullName || registration.attendee_snapshot?.name || "Participant",
        },
        return_url: `${appUrl}/dashboard/registrations?payment=return&registration=${registration.id}`,
        metadata: {
          type: "scholarvault_conference",
          registrationId: registration.id,
          conferenceEditionId: registration.conference_edition_id,
          conferenceUserId: userId,
          expectedProductId: productId,
          expectedAmount: expectedAmount.toFixed(2),
          expectedCurrency,
          goldBundle: priceTier === "gold_bundle" ? "true" : "false",
        },
      },
      {
        idempotencyKey: `sv-conf:${registration.id}:${orderId}`,
      }
    );

    if (!session?.checkout_url) {
      return NextResponse.json(
        { error: "Payment provider did not return a checkout URL" },
        { status: 502 }
      );
    }

    await supabaseAdmin.from("conference_payments").insert({
      registration_id: registration.id,
      provider: "dodo",
      provider_checkout_id: session.session_id,
      amount: expectedAmount,
      currency: expectedCurrency,
      status: "pending",
      metadata: {
        product_id: productId,
        order_id: orderId,
        user_id: userId,
      },
      created_at: now,
      updated_at: now,
    });

    await recordConferenceFunnelEvent({
      conference_edition_id: registration.conference_edition_id,
      funnel_type: "registration",
      step: "payment_initiated",
      user_id: userId,
      metadata: {
        registration_id: registration.id,
        category_id: registration.category_id,
        amount: expectedAmount,
        currency: expectedCurrency,
        provider: "dodo",
      },
    });

    return NextResponse.json({
      success: true,
      provider: "dodo",
      checkout_url: session.checkout_url,
      order_id: orderId,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: `Payment gateway error: ${err?.message || "Failed to initialize Dodo checkout session"}` },
      { status: 502 }
    );
  }
}
