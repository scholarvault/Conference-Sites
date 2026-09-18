import { NextRequest, NextResponse } from "next/server";
import { requireCredentialLifecycleAccess } from "@/features/conferences/credentialLifecycle";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const access = await requireCredentialLifecycleAccess(slug);
  if ("response" in access) return access.response;

  const url = new URL(request.url);
  const statusFilter = url.searchParams.get("status");

  let query = supabaseAdmin
    .from("conference_bank_transfers")
    .select(
      `*,
       registration:conference_registrations(
         id,
         registration_number,
         participant_type,
         participation_mode,
         amount_due,
         currency,
         payment_status,
         registration_status,
         attendee_snapshot
       )`
    )
    .eq("conference_edition_id", access.edition.id)
    .order("created_at", { ascending: false });

  if (statusFilter) {
    query = query.eq("transfer_status", statusFilter);
  }

  const { data: transfers, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Generate signed receipt URLs (short-lived, 15 minutes) for transfers that have receipts
  const transfersWithReceipts = await Promise.all(
    (transfers || []).map(async (transfer) => {
      let signedReceiptUrl: string | null = null;
      if (transfer.receipt_storage_path) {
        const { data: signed } = await supabaseAdmin.storage
          .from("conference-bank-receipts")
          .createSignedUrl(transfer.receipt_storage_path, 900); // 15 minutes
        signedReceiptUrl = signed?.signedUrl || null;
      }
      return {
        ...transfer,
        signed_receipt_url: signedReceiptUrl,
      };
    })
  );

  return NextResponse.json({
    transfers: transfersWithReceipts,
    counts: {
      total: transfers?.length || 0,
      submitted: transfers?.filter((t) => t.transfer_status === "submitted").length || 0,
      awaiting_verification: transfers?.filter((t) => t.transfer_status === "awaiting_verification").length || 0,
      approved: transfers?.filter((t) => t.transfer_status === "approved").length || 0,
      rejected: transfers?.filter((t) => t.transfer_status === "rejected").length || 0,
    },
  });
}
