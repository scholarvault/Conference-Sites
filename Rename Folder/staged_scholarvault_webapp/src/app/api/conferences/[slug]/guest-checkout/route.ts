import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { randomBytes } from "node:crypto";
import DodoPayments from "dodopayments";
import { appendCors, createReference, getEditionBySlug } from "@/features/conferences/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  calculateOmniwareHash,
  getOmniwareConfig,
  requestOmniwarePaymentUrl,
} from "@/lib/billing/federalOmniware";
import {
  conferenceProductPrice,
  conferenceGoldPrice,
} from "@/features/conferences/paymentPricing";
import {
  resolvePaymentCapabilities,
  validateCurrencyForProvider,
  type ConferencePaymentProvider,
} from "@/features/conferences/paymentCapabilities";
import {
  verifyAuthorVerificationToken,
  hashIdentifier,
} from "@/features/conferences/authorVerification";

function createDodoClient() {
  const bearerToken = process.env.DODO_PAYMENTS_API_KEY?.trim();
  if (!bearerToken) return null;
  return new DodoPayments({
    bearerToken,
    environment:
      process.env.DODO_PAYMENTS_ENVIRONMENT === "live_mode" ? "live_mode" : "test_mode",
  });
}

function generateCompactOrderId(shortName: string): string {
  const cleanShort = (shortName || "CONF").replace(/[^A-Za-z0-9]/g, "").slice(0, 7).toUpperCase();
  const timeHex = Date.now().toString(36).slice(-6).toUpperCase();
  const randHex = randomBytes(2).toString("hex").toUpperCase();
  // Format: SV-XXXX-TTTTTT-RRRR (Length: ~22 chars, strictly <= 30 chars)
  return `SV-${cleanShort}-${timeHex}-${randHex}`.slice(0, 30);
}

export async function OPTIONS(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: edition } = await getEditionBySlug(slug);
  return appendCors(
    new NextResponse(null, { status: 204 }),
    request.headers.get("origin"),
    edition?.allowed_embed_origins || ["*"]
  );
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const origin = request.headers.get("origin");
  const { slug } = await params;
  const { data: edition, error: editionError } = await getEditionBySlug(slug);

  if (editionError || !edition) {
    return appendCors(
      NextResponse.json({ error: "Conference edition not found" }, { status: 404 }),
      origin,
      ["*"]
    );
  }

  const allowedOrigins = edition.allowed_embed_origins || ["*"];

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return appendCors(
      NextResponse.json({ error: "Invalid registration payload" }, { status: 400 }),
      origin,
      allowedOrigins
    );
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").toLowerCase().trim();
  const phone = String(body.phone || "").trim();
  const country = String(body.country || "India").trim();
  const city = String(body.city || "Bengaluru").trim();
  const zipCode = String(body.zip_code || body.postal_code || "560001").trim();
  const institution = String(body.institution || "").trim();
  let abstractId = String(body.paper_id || body.abstract_id || "").trim();
  const categoryIdentifier = String(body.category_id || body.category_code || body.category || "").trim();
  const requestedMethod = String(body.payment_method || "federal_omniware").trim() as ConferencePaymentProvider;
  const goldAddon = body.gold_addon === true;
  const couponCode = String(body.coupon_code || "").trim().toUpperCase();
  const utrNumber = String(body.utr_number || "").trim().toUpperCase();
  const bankName = String(body.bank_name || "").trim();
  const depositorName = String(body.depositor_name || name).trim();
  const authorToken = String(body.author_token || "").trim();

  if (!name || !email || !phone) {
    return appendCors(
      NextResponse.json({ error: "Name, email, and phone number are required." }, { status: 400 }),
      origin,
      allowedOrigins
    );
  }

  // Cryptographic author verification token check if provided
  if (authorToken) {
    const verifiedToken = verifyAuthorVerificationToken(authorToken);
    if (!verifiedToken) {
      return appendCors(
        NextResponse.json({ error: "Invalid or expired author verification token. Please re-verify." }, { status: 403 }),
        origin,
        allowedOrigins
      );
    }
    if (verifiedToken.verifiedEmailHash !== hashIdentifier(email)) {
      return appendCors(
        NextResponse.json({ error: "Author verification token does not match the registration email." }, { status: 403 }),
        origin,
        allowedOrigins
      );
    }
    // Bind the authoritatively verified submission ID
    abstractId = verifiedToken.selectedSubmissionId;
  }

  // Currency resolution: support explicit USD or category suffix for bank wire as well
  const explicitCurrency = body.currency ? String(body.currency).toUpperCase().trim() : null;
  let currency =
    explicitCurrency === "USD" ||
    categoryIdentifier.toLowerCase().endsWith("_usd") ||
    requestedMethod === "dodo"
      ? "USD"
      : "INR";

  // Resolve payment capabilities from edition config
  const capabilities = resolvePaymentCapabilities(edition.payment_config, currency);
  let paymentMethod = requestedMethod;

  if (!capabilities.providers.includes(paymentMethod)) {
    if (paymentMethod === "dodo" && capabilities.providers.includes("federal_omniware")) {
      paymentMethod = "federal_omniware";
      currency = "INR";
    } else if (capabilities.defaultProvider) {
      paymentMethod = capabilities.defaultProvider;
    }
  }

  if (!validateCurrencyForProvider(paymentMethod, currency)) {
    return appendCors(
      NextResponse.json({ error: `Currency ${currency} is not supported for provider ${paymentMethod}.` }, { status: 400 }),
      origin,
      allowedOrigins
    );
  }

  // Find matching category
  const { data: categories } = await supabaseAdmin
    .from("conference_registration_categories")
    .select("*")
    .eq("conference_edition_id", edition.id)
    .eq("is_active", true);

  const activeCategories = categories || [];
  const normalizedCategory = categoryIdentifier.toLowerCase().replace(/_(inr|usd)$/, "");

  let matchedCategory = activeCategories.find((c) => c.id === categoryIdentifier);
  if (!matchedCategory) {
    matchedCategory = activeCategories.find((c) => {
      const cCode = String(c.code || "").toLowerCase();
      const cCurrency = String(c.currency || "").toUpperCase();
      return (
        (cCode === `${normalizedCategory}_${currency.toLowerCase()}` || cCode === normalizedCategory) &&
        cCurrency === currency
      );
    });
  }

  if (!matchedCategory) {
    matchedCategory = activeCategories.find((c) => {
      const cCodeNorm = String(c.code || "").toLowerCase().replace(/_(inr|usd)$/, "");
      const cCurrency = String(c.currency || "").toUpperCase();
      return cCodeNorm === normalizedCategory && cCurrency === currency;
    });
  }

  if (!matchedCategory) {
    matchedCategory = activeCategories.find((c) => {
      const cNameNorm = String(c.name || "").toLowerCase();
      const cCurrency = String(c.currency || "").toUpperCase();
      return cNameNorm.includes(normalizedCategory.replace(/_/g, " ")) && cCurrency === currency;
    });
  }

  if (!matchedCategory) {
    matchedCategory =
      activeCategories.find((c) => {
        const cCodeNorm = String(c.code || "").toLowerCase().replace(/_(inr|usd)$/, "");
        return cCodeNorm === normalizedCategory;
      }) || activeCategories[0];
  }

  if (!matchedCategory) {
    return appendCors(
      NextResponse.json({ error: "Registration pass category not found." }, { status: 404 }),
      origin,
      allowedOrigins
    );
  }

  // Resolve base and addon pricing
  const standardProduct = conferenceProductPrice(matchedCategory, currency);
  let baseAmount = standardProduct ? standardProduct.amount : Number(matchedCategory.amount || 0);

  // If server product catalog didn't have it, fall back safely
  if (!baseAmount || isNaN(baseAmount)) {
    baseAmount = currency === "USD" ? 199 : 4999;
  }

  let finalAmount = baseAmount;
  let goldAddonAmount = 0;

  if (goldAddon) {
    const goldProduct = conferenceGoldPrice(matchedCategory, currency);
    goldAddonAmount = goldProduct ? goldProduct.amount - baseAmount : (currency === "USD" ? 50 : 2500);
    if (goldAddonAmount > 0) {
      finalAmount += goldAddonAmount;
    }
  }

  // Optional coupon discount
  if (couponCode === "EARLYBIRD" || couponCode === "SCHOLAR10") {
    finalAmount = Math.max(0, Math.round(finalAmount * 0.9));
  }

  // Validate UTR if bank transfer selected
  if (paymentMethod === "bank_transfer") {
    if (!utrNumber || !/^[A-Z0-9]{10,24}$/.test(utrNumber)) {
      return appendCors(
        NextResponse.json(
          { error: "A valid 10 to 24 character alphanumeric UTR/Transaction Reference is required for bank transfer." },
          { status: 400 }
        ),
        origin,
        allowedOrigins
      );
    }

    const { data: existingUtr } = await supabaseAdmin
      .from("conference_bank_transfers")
      .select("id")
      .eq("conference_edition_id", edition.id)
      .eq("utr_normalized", utrNumber)
      .maybeSingle();

    if (existingUtr) {
      return appendCors(
        NextResponse.json(
          { error: "This UTR number has already been submitted for this conference." },
          { status: 409 }
        ),
        origin,
        allowedOrigins
      );
    }
  }

  // Check existing user or anonymous registration
  const { userId } = await auth();
  const effectiveUserId = userId || null;
  const registrationNumber = await createReference(supabaseAdmin, edition.id, "registration", "REG");
  const orderId = generateCompactOrderId(edition.short_name || "CONF");
  const now = new Date().toISOString();

  // Create conference_registrations record
  const { data: registration, error: regError } = await supabaseAdmin
    .from("conference_registrations")
    .insert({
      conference_edition_id: edition.id,
      registration_number: registrationNumber,
      category_id: matchedCategory.id,
      user_id: effectiveUserId,
      participant_type: matchedCategory.participant_type || "attendee",
      participation_mode:
        matchedCategory.participation_mode === "physical" || body.participation_mode === "physical"
          ? "physical"
          : "virtual",
      attendee_snapshot: {
        name,
        email,
        phone,
        country,
        city,
        zip_code: zipCode,
        institution,
        abstract_id: abstractId,
      },
      amount_due: finalAmount,
      currency,
      payment_status: paymentMethod === "bank_transfer" ? "awaiting_verification" : "awaiting_payment",
      registration_status: "pending",
      custom_answers: {
        utr_number: utrNumber || null,
        bank_name: bankName || null,
        coupon_code: couponCode || null,
        gold_addon: goldAddon,
        author_verified: Boolean(authorToken),
        order_id: orderId,
      },
      created_at: now,
      updated_at: now,
    })
    .select()
    .single();

  if (regError || !registration) {
    return appendCors(
      NextResponse.json({ error: regError?.message || "Failed to create registration record" }, { status: 500 }),
      origin,
      allowedOrigins
    );
  }

  // Store payment record - Note: conference_payments.status MUST be 'pending' (satisfies DB check constraint)
  await supabaseAdmin.from("conference_payments").insert({
    registration_id: registration.id,
    provider: paymentMethod,
    provider_checkout_id: orderId,
    amount: finalAmount,
    currency,
    status: "pending",
    metadata: {
      order_id: orderId,
      attendee_email: email,
      attendee_name: name,
      category_name: matchedCategory.name,
      category_code: matchedCategory.code,
      utr_number: utrNumber || null,
    },
    created_at: now,
    updated_at: now,
  });

  // Branch 1: Direct Bank Transfer
  if (paymentMethod === "bank_transfer") {
    const cleanUtr = utrNumber.trim().toUpperCase();
    await supabaseAdmin.from("conference_bank_transfers").insert({
      conference_edition_id: edition.id,
      registration_id: registration.id,
      utr_number: utrNumber,
      utr_normalized: cleanUtr,
      transfer_amount: finalAmount,
      currency,
      bank_name: bankName || null,
      depositor_name: depositorName,
      transfer_status: "submitted",
      metadata: {
        order_id: orderId,
        attendee_email: email,
      },
      created_at: now,
      updated_at: now,
    });

    // Enqueue bank transfer email confirmation
    await supabaseAdmin.from("conference_email_outbox").insert({
      conference_edition_id: edition.id,
      event_key: "payment_verification_pending",
      idempotency_key: `bank_transfer_submitted:${registration.id}`,
      recipient_email: email,
      template_key: "payment_required",
      template_data: {
        conferenceName: edition.name,
        registrationNumber: registration.registration_number,
        utrNumber: utrNumber || "Under Review",
        amount: `${currency === "INR" ? "₹" : "$"}${finalAmount.toLocaleString()}`,
      },
    });

    return appendCors(
      NextResponse.json({
        success: true,
        provider: "bank_transfer",
        status: "awaiting_verification",
        registration_number: registration.registration_number,
        order_id: orderId,
        amount: finalAmount,
      }),
      origin,
      allowedOrigins
    );
  }

  // Branch 2: Federal Bank / Omniware (INR)
  if (paymentMethod === "federal_omniware") {
    const config = getOmniwareConfig();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.scholarvault.in";
    const returnUrl = `${appUrl}/api/payments/federal/return`;

    const omniwareResult = await requestOmniwarePaymentUrl({
      order_id: orderId,
      amount: finalAmount,
      currency: "INR",
      description: `${edition.short_name || "SV"} Pass: ${matchedCategory.name}`,
      name,
      email,
      phone: phone.replace(/[^0-9]/g, "").slice(-10) || "9999999999",
      city,
      country: "IND",
      zip_code: zipCode,
      return_url: returnUrl,
      return_url_failure: returnUrl,
      return_url_cancel: returnUrl,
      udf1: (origin || "").substring(0, 255),
      payment_options: "upi,nb,cc,dp",
      payment_page_display_text: `${edition.name} - Delegate Pass`,
      expiry_in_minutes: 30,
      enable_auto_refund: "y",
    });

    if (omniwareResult.success && omniwareResult.url) {
      return appendCors(
        NextResponse.json({
          success: true,
          provider: "federal_omniware",
          payment_url: omniwareResult.url,
          order_id: orderId,
          registration_number: registration.registration_number,
        }),
        origin,
        allowedOrigins
      );
    }

    // Direct Form POST fallback
    const formFields: Record<string, string> = {
      api_key: config.apiKey,
      order_id: orderId,
      mode: config.environment,
      amount: Number(finalAmount).toFixed(2),
      currency: "INR",
      description: `${edition.short_name || "SV"} Pass: ${matchedCategory.name}`,
      name,
      email,
      phone: phone.replace(/[^0-9]/g, "").slice(-10) || "9999999999",
      city,
      country: "IND",
      zip_code: zipCode,
      return_url: returnUrl,
    };
    formFields.hash = calculateOmniwareHash(formFields, config.salt);

    return appendCors(
      NextResponse.json({
        success: true,
        provider: "federal_omniware_form",
        form_action: config.paymentRequestUrl,
        form_fields: formFields,
        order_id: orderId,
        registration_number: registration.registration_number,
      }),
      origin,
      allowedOrigins
    );
  }

  // Branch 3: Dodo Payments (USD)
  const dodo = createDodoClient();
  if (!dodo) {
    return appendCors(
      NextResponse.json({ error: "International card checkout is currently being configured." }, { status: 503 }),
      origin,
      allowedOrigins
    );
  }

  const standardPrice = conferenceProductPrice(matchedCategory, "USD");
  const productId = standardPrice?.productId || process.env.DODO_CONFERENCE_DEFAULT_PRODUCT_ID || "p_conf_default";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.scholarvault.in";

  try {
    const session = await dodo.checkoutSessions.create(
      {
        product_cart: [{ product_id: productId, quantity: 1 }],
        customer: { email, name },
        return_url: `${appUrl}/dashboard/registrations?payment=return&registration=${registration.id}`,
        metadata: {
          type: "scholarvault_conference",
          registrationId: registration.id,
          conferenceEditionId: edition.id,
          orderId,
          expectedAmount: finalAmount.toFixed(2),
          expectedCurrency: "USD",
        },
      },
      {
        idempotencyKey: `sv-conf-guest:${registration.id}:${orderId}`,
      }
    );

    if (session?.checkout_url) {
      return appendCors(
        NextResponse.json({
          success: true,
          provider: "dodo",
          checkout_url: session.checkout_url,
          registration_number: registration.registration_number,
          order_id: orderId,
          amount: finalAmount,
          currency: "USD",
        }),
        origin,
        allowedOrigins
      );
    } else {
      return appendCors(
        NextResponse.json({ error: "Payment gateway did not return a valid checkout session URL." }, { status: 502 }),
        origin,
        allowedOrigins
      );
    }
  } catch (err: any) {
    console.error("Dodo session creation error:", err?.message);
    return appendCors(
      NextResponse.json({ error: `International payment provider error: ${err?.message || "Checkout session failed"}` }, { status: 502 }),
      origin,
      allowedOrigins
    );
  }
}
