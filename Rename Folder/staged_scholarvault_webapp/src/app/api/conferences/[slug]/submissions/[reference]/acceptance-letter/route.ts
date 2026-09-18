import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getEditionBySlug } from "@/features/conferences/server";
import {
  generateAcceptanceLetterPdf,
  AcceptanceLetterFormat,
} from "@/features/conferences/acceptanceLetterEngine";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; reference: string }> }
) {
  const { slug, reference } = await params;
  const decodedRef = decodeURIComponent(reference);

  const { data: edition, error: editionErr } = await getEditionBySlug(slug);
  if (editionErr || !edition) {
    return NextResponse.json({ error: "Conference not found" }, { status: 404 });
  }

  // Look up submission by submission_number or UUID id
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(decodedRef);
  const query = supabaseAdmin
    .from("conference_submissions")
    .select("*, track:conference_tracks(id,name,code), authors:conference_submission_authors(*), registration:conference_registrations(id,participation_mode,payment_status,registration_status)")
    .eq("conference_edition_id", edition.id);

  const { data: submission, error: subErr } = isUuid
    ? await query.eq("id", decodedRef).maybeSingle()
    : await query.eq("submission_number", decodedRef).maybeSingle();

  if (subErr || !submission) {
    return NextResponse.json({ error: "Submission not found" }, { status: 404 });
  }

  if (submission.decision_status !== "accepted") {
    return NextResponse.json(
      {
        error: "Acceptance letter is only issued for accepted submissions",
        decision_status: submission.decision_status,
      },
      { status: 403 }
    );
  }

  const origin = request.nextUrl.origin || "https://scholarvault.in";
  const format = request.nextUrl.searchParams.get("format") as AcceptanceLetterFormat | null;
  const doc = generateAcceptanceLetterPdf(
    submission,
    edition,
    edition.settings?.acceptance_letter,
    origin,
    format || undefined
  );
  const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

  const isVirtual =
    submission.presentation_modality === "virtual" ||
    submission.registration?.participation_mode === "virtual" ||
    edition.delivery_mode === "virtual";

  const defaultFilename =
    format === "two_page_dossier"
      ? `Presentation_Dossier_${submission.submission_number}.pdf`
      : format === "single_page_compact" && isVirtual
        ? `Acceptance_Certificate_${submission.submission_number}.pdf`
        : format === "single_page_compact"
          ? `Visa_Invitation_Letter_${submission.submission_number}.pdf`
          : `Acceptance_Record_${submission.submission_number}.pdf`;

  return new Response(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${defaultFilename}"`,
      "Cache-Control": "private, no-cache, no-store, must-revalidate",
    },
  });
}
