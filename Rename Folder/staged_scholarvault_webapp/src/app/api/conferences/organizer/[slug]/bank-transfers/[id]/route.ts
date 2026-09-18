import { NextRequest, NextResponse } from "next/server";
import { requireCredentialLifecycleAccess } from "@/features/conferences/credentialLifecycle";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { applyTransferAction } from "@/features/conferences/registrationStateMachine";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string; id: string }> }
) {
  const { slug, id } = await context.params;
  const access = await requireCredentialLifecycleAccess(slug);
  if ("response" in access) return access.response;

  const { data: transfer, error } = await supabaseAdmin
    .from("conference_bank_transfers")
    .select(
      `*,
       registration:conference_registrations(
         id,
         registration_number,
         participant_type,
         amount_due,
         currency,
         payment_status,
         registration_status,
         attendee_snapshot
       )`
    )
    .eq("id", id)
    .eq("conference_edition_id", access.edition.id)
    .maybeSingle();

  if (error || !transfer) {
    return NextResponse.json({ error: "Bank transfer record not found" }, { status: 404 });
  }

  let signedReceiptUrl: string | null = null;
  if (transfer.receipt_storage_path) {
    const { data: signed } = await supabaseAdmin.storage
      .from("conference-bank-receipts")
      .createSignedUrl(transfer.receipt_storage_path, 900); // 15 minutes
    signedReceiptUrl = signed?.signedUrl || null;
  }

  return NextResponse.json({
    transfer: {
      ...transfer,
      signed_receipt_url: signedReceiptUrl,
    },
  });
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ slug: string; id: string }> }
) {
  const { slug, id } = await context.params;
  const access = await requireCredentialLifecycleAccess(slug);
  if ("response" in access) return access.response;

  const body = await request.json().catch(() => ({}));
  const action = String(body.action || "").trim(); // "approve" | "reject"
  const notes = typeof body.notes === "string" ? body.notes.trim() : null;

  if (action !== "approve" && action !== "reject") {
    return NextResponse.json(
      { error: "Action must be either 'approve' or 'reject'" },
      { status: 400 }
    );
  }

  const { data: transfer, error: fetchError } = await supabaseAdmin
    .from("conference_bank_transfers")
    .select("*, registration:conference_registrations(*)")
    .eq("id", id)
    .eq("conference_edition_id", access.edition.id)
    .maybeSingle();

  if (fetchError || !transfer) {
    return NextResponse.json({ error: "Bank transfer not found" }, { status: 404 });
  }

  const reg = transfer.registration;
  if (!reg) {
    return NextResponse.json({ error: "Associated registration not found" }, { status: 404 });
  }

  const now = new Date().toISOString();
  let nextState;
  try {
    nextState = applyTransferAction(
      {
        transferStatus: transfer.transfer_status,
        paymentStatus: reg.payment_status,
        registrationStatus: reg.registration_status,
      },
      action === "approve" ? "approve" : "reject"
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 409 });
  }

  // 1. Update conference_bank_transfers
  const { error: updateTransferError } = await supabaseAdmin
    .from("conference_bank_transfers")
    .update({
      transfer_status: nextState.transferStatus,
      review_notes: notes,
      reviewed_by: access.userId,
      reviewed_at: now,
      updated_at: now,
    })
    .eq("id", transfer.id);

  if (updateTransferError) {
    return NextResponse.json({ error: updateTransferError.message }, { status: 500 });
  }

  // 2. Update conference_registrations
  const regUpdates: Record<string, unknown> = {
    payment_status: nextState.paymentStatus,
    registration_status: nextState.registrationStatus,
    updated_at: now,
  };
  if (action === "approve") {
    regUpdates.confirmed_at = now;
  }

  await supabaseAdmin
    .from("conference_registrations")
    .update(regUpdates)
    .eq("id", reg.id);

  // 3. Upsert participant record upon approval for attendee operations & credentials
  if (action === "approve") {
    await supabaseAdmin
      .from("conference_participants")
      .upsert(
        {
          conference_edition_id: access.edition.id,
          registration_id: reg.id,
          user_id: reg.user_id || null,
          participation_status: "registered",
          confirmed_by: access.userId,
          updated_at: now,
        },
        { onConflict: "registration_id" }
      );
  }

  // 4. Update or upsert conference_payments ledger
  await supabaseAdmin
    .from("conference_payments")
    .upsert(
      {
        registration_id: reg.id,
        provider: "bank_transfer",
        provider_checkout_id: transfer.utr_normalized,
        amount: transfer.transfer_amount,
        currency: transfer.currency,
        status: action === "approve" ? "paid" : "failed",
        paid_at: action === "approve" ? now : null,
        metadata: {
          transfer_id: transfer.id,
          utr_number: transfer.utr_number,
          reviewer_user_id: access.userId,
          notes,
        },
        updated_at: now,
      },
      { onConflict: "provider,provider_payment_id" }
    );

  // 5. Record Audit Log
  await supabaseAdmin.from("conference_audit_log").insert({
    organization_id: access.edition.organization_id || null,
    conference_edition_id: access.edition.id,
    actor_user_id: access.userId,
    action: action === "approve" ? "bank_transfer_approved" : "bank_transfer_rejected",
    entity_type: "conference_bank_transfers",
    entity_id: transfer.id,
    previous_data: {
      transfer_status: transfer.transfer_status,
      payment_status: reg.payment_status,
      registration_status: reg.registration_status,
    },
    new_data: {
      transfer_status: nextState.transferStatus,
      payment_status: nextState.paymentStatus,
      registration_status: nextState.registrationStatus,
      notes,
    },
    reason: notes,
  });

  // 6. Enqueue email notification to participant
  const attendeeEmail = reg.attendee_snapshot?.email;
  if (attendeeEmail) {
    if (action === "approve") {
      await supabaseAdmin.from("conference_email_outbox").insert({
        conference_edition_id: access.edition.id,
        event_key: "payment_settled",
        idempotency_key: `bank_transfer_approved:${reg.id}`,
        recipient_email: attendeeEmail,
        template_key: "registration_confirmed",
        template_data: {
          conferenceName: access.edition.name,
          registrationNumber: reg.registration_number,
          participantName: reg.attendee_snapshot?.name || "Participant",
          amount: `${reg.currency === "INR" ? "₹" : "$"}${reg.amount_due.toLocaleString()}`,
        },
      });
    } else {
      await supabaseAdmin.from("conference_email_outbox").insert({
        conference_edition_id: access.edition.id,
        event_key: "payment_verification_failed",
        idempotency_key: `bank_transfer_rejected:${reg.id}:${Date.now()}`,
        recipient_email: attendeeEmail,
        template_key: "payment_failed",
        template_data: {
          conferenceName: access.edition.name,
          registrationNumber: reg.registration_number,
          utrNumber: transfer.utr_number,
          reason: notes || "UTR reference or payment amount could not be reconciled with the bank account statement.",
        },
      });
    }
  }

  return NextResponse.json({
    success: true,
    transfer_id: transfer.id,
    transfer_status: nextState.transferStatus,
    payment_status: nextState.paymentStatus,
    registration_status: nextState.registrationStatus,
  });
}
