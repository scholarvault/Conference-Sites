import { NextRequest, NextResponse } from "next/server";
import { appendCors, getEditionBySlug } from "@/features/conferences/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { resolveBankInstructions } from "@/features/conferences/paymentCapabilities";
import { applyTransferAction } from "@/features/conferences/registrationStateMachine";

export async function OPTIONS(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: edition } = await getEditionBySlug(slug);
  return appendCors(
    new NextResponse(null, { status: 204 }),
    request.headers.get("origin"),
    edition?.allowed_embed_origins || ["*"]
  );
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const origin = request.headers.get("origin");
  const { slug } = await params;
  const { data: edition, error } = await getEditionBySlug(slug);

  if (error || !edition) {
    return appendCors(
      NextResponse.json({ error: "Conference edition not found" }, { status: 404 }),
      origin,
      ["*"]
    );
  }

  const bankRef = edition.payment_config?.bank_account_ref || "federal-primary";
  const instructions = resolveBankInstructions(bankRef, "v1", false);

  return appendCors(
    NextResponse.json({
      success: true,
      bank: instructions,
    }),
    origin,
    edition.allowed_embed_origins || ["*"]
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
  const contentType = request.headers.get("content-type") || "";

  let registrationRef = "";
  let utrNumber = "";
  let depositorName = "";
  let bankName = "";
  let transferDate = new Date().toISOString().split("T")[0];
  let receiptFile: File | null = null;
  let customAnswers: Record<string, unknown> = {};

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData().catch(() => null);
    if (!formData) {
      return appendCors(
        NextResponse.json({ error: "Invalid form data" }, { status: 400 }),
        origin,
        allowedOrigins
      );
    }
    registrationRef = String(formData.get("registration_id") || formData.get("registration_number") || "").trim();
    utrNumber = String(formData.get("utr_number") || "").trim().toUpperCase();
    depositorName = String(formData.get("depositor_name") || "").trim();
    bankName = String(formData.get("bank_name") || "").trim();
    transferDate = String(formData.get("transfer_date") || transferDate).trim();
    const file = formData.get("receipt");
    if (file instanceof File && file.size > 0) {
      receiptFile = file;
    }
  } else {
    const body = await request.json().catch(() => null);
    if (!body) {
      return appendCors(
        NextResponse.json({ error: "Invalid request payload" }, { status: 400 }),
        origin,
        allowedOrigins
      );
    }
    registrationRef = String(body.registration_id || body.registration_number || "").trim();
    utrNumber = String(body.utr_number || "").trim().toUpperCase();
    depositorName = String(body.depositor_name || "").trim();
    bankName = String(body.bank_name || "").trim();
    transferDate = String(body.transfer_date || transferDate).trim();
    customAnswers = body.metadata || {};
  }

  if (!registrationRef) {
    return appendCors(
      NextResponse.json({ error: "Registration reference or ID is required" }, { status: 400 }),
      origin,
      allowedOrigins
    );
  }

  if (!utrNumber || !/^[A-Z0-9]{10,24}$/.test(utrNumber)) {
    return appendCors(
      NextResponse.json(
        { error: "A valid 10 to 24 character alphanumeric UTR/Transaction Reference is required." },
        { status: 400 }
      ),
      origin,
      allowedOrigins
    );
  }

  // Look up registration record
  const { data: registration, error: regError } = await supabaseAdmin
    .from("conference_registrations")
    .select("*, category:conference_registration_categories(name)")
    .eq("conference_edition_id", edition.id)
    .or(`id.eq.${registrationRef},registration_number.eq.${registrationRef}`)
    .maybeSingle();

  if (regError || !registration) {
    return appendCors(
      NextResponse.json({ error: "Registration record not found for this conference." }, { status: 404 }),
      origin,
      allowedOrigins
    );
  }

  // Check UTR uniqueness across this conference edition
  const { data: existingTransfer } = await supabaseAdmin
    .from("conference_bank_transfers")
    .select("id,registration_id")
    .eq("conference_edition_id", edition.id)
    .eq("utr_normalized", utrNumber)
    .maybeSingle();

  if (existingTransfer && existingTransfer.registration_id !== registration.id) {
    return appendCors(
      NextResponse.json(
        { error: "This UTR number has already been claimed for another registration." },
        { status: 409 }
      ),
      origin,
      allowedOrigins
    );
  }

  let receiptPath: string | null = null;
  let receiptFileName: string | null = null;
  let receiptContentType: string | null = null;
  let receiptSize: number | null = null;

  // Handle Receipt Upload to private bucket
  if (receiptFile) {
    const allowedMimes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedMimes.includes(receiptFile.type)) {
      return appendCors(
        NextResponse.json(
          { error: "Receipt must be a PDF, JPEG, or PNG file." },
          { status: 400 }
        ),
        origin,
        allowedOrigins
      );
    }
    if (receiptFile.size > 5 * 1024 * 1024) {
      return appendCors(
        NextResponse.json(
          { error: "Receipt file size cannot exceed 5 MB." },
          { status: 400 }
        ),
        origin,
        allowedOrigins
      );
    }

    const ext = receiptFile.name.split(".").pop() || "pdf";
    const storageKey = `${edition.id}/${registration.id}_${Date.now()}.${ext}`;
    const arrayBuf = await receiptFile.arrayBuffer();

    const { error: uploadError } = await supabaseAdmin.storage
      .from("conference-bank-receipts")
      .upload(storageKey, Buffer.from(arrayBuf), {
        contentType: receiptFile.type,
        upsert: true,
      });

    if (!uploadError) {
      receiptPath = storageKey;
      receiptFileName = receiptFile.name;
      receiptContentType = receiptFile.type;
      receiptSize = receiptFile.size;
    }
  }

  const now = new Date().toISOString();
  const nextState = applyTransferAction(
    {
      paymentStatus: registration.payment_status,
      registrationStatus: registration.registration_status,
      transferStatus: null,
    },
    "submit"
  );

  // Insert or Update bank transfer record
  const { data: bankTransfer, error: transferError } = await supabaseAdmin
    .from("conference_bank_transfers")
    .upsert(
      {
        conference_edition_id: edition.id,
        registration_id: registration.id,
        utr_number: utrNumber,
        utr_normalized: utrNumber,
        transfer_amount: registration.amount_due,
        currency: registration.currency,
        bank_name: bankName || null,
        depositor_name: depositorName || registration.attendee_snapshot?.name || "Participant",
        transfer_date: transferDate,
        receipt_storage_path: receiptPath,
        receipt_file_name: receiptFileName,
        receipt_content_type: receiptContentType,
        receipt_size_bytes: receiptSize,
        transfer_status: "submitted",
        metadata: customAnswers,
        updated_at: now,
      },
      { onConflict: "conference_edition_id,utr_normalized" }
    )
    .select()
    .single();

  if (transferError || !bankTransfer) {
    return appendCors(
      NextResponse.json({ error: transferError?.message || "Failed to record bank transfer" }, { status: 500 }),
      origin,
      allowedOrigins
    );
  }

  // Update registration payment status
  await supabaseAdmin
    .from("conference_registrations")
    .update({
      payment_status: nextState.paymentStatus,
      updated_at: now,
    })
    .eq("id", registration.id);

  // Maintain payment ledger record: status MUST be 'pending' to satisfy database constraint
  await supabaseAdmin.from("conference_payments").insert({
    registration_id: registration.id,
    provider: "bank_transfer",
    provider_checkout_id: utrNumber,
    amount: registration.amount_due,
    currency: registration.currency,
    status: "pending",
    metadata: {
      transfer_id: bankTransfer.id,
      utr_number: utrNumber,
      depositor_name: depositorName,
      bank_name: bankName || null,
    },
    created_at: now,
    updated_at: now,
  });

  // Enqueue notification outbox email
  const attendeeEmail = registration.attendee_snapshot?.email;
  if (attendeeEmail) {
    await supabaseAdmin.from("conference_email_outbox").insert({
      conference_edition_id: edition.id,
      event_key: "payment_verification_pending",
      idempotency_key: `bank_transfer_submitted:${registration.id}:${utrNumber}`,
      recipient_email: attendeeEmail,
      template_key: "payment_required",
      template_data: {
        conferenceName: edition.name,
        registrationNumber: registration.registration_number,
        utrNumber,
        amount: `${registration.currency === "INR" ? "₹" : "$"}${registration.amount_due.toLocaleString()}`,
      },
    });
  }

  return appendCors(
    NextResponse.json({
      success: true,
      transfer_id: bankTransfer.id,
      utr_number: utrNumber,
      status: "awaiting_verification",
      registration_number: registration.registration_number,
    }),
    origin,
    allowedOrigins
  );
}
