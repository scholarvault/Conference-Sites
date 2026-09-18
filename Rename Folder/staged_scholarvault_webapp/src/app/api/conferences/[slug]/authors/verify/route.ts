import { NextRequest, NextResponse } from "next/server";
import { appendCors, getEditionBySlug } from "@/features/conferences/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  generateAuthorVerificationToken,
  hashIdentifier,
  verifyOtpTimingSafe,
} from "@/features/conferences/authorVerification";

export async function OPTIONS(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { data: edition } = await getEditionBySlug(slug);
  return appendCors(
    new NextResponse(null, { status: 204 }),
    request.headers.get("origin"),
    edition?.allowed_embed_origins || ["*"]
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
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
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "").toLowerCase().trim();
  const code = String(body.code || "").trim();

  if (!email || !code) {
    return appendCors(
      NextResponse.json({ error: "Author email and 6-digit verification code are required." }, { status: 400 }),
      origin,
      allowedOrigins
    );
  }

  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "127.0.0.1";
  const ipHash = hashIdentifier(clientIp);
  const emailHash = hashIdentifier(email);
  const now = new Date();

  // Find the latest unconsumed, unexpired challenge
  const { data: challenge } = await supabaseAdmin
    .from("conference_verification_challenges")
    .select("*, submission:conference_submissions(id, title, submission_number)")
    .eq("conference_edition_id", edition.id)
    .eq("email_hash", emailHash)
    .is("consumed_at", null)
    .gt("expires_at", now.toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!challenge) {
    return appendCors(
      NextResponse.json(
        { error: "No active verification challenge found. Please request a new code." },
        { status: 400 }
      ),
      origin,
      allowedOrigins
    );
  }

  // Enforce maximum attempts
  if (challenge.attempts_count >= challenge.max_attempts) {
    return appendCors(
      NextResponse.json(
        { error: "Maximum attempts exceeded for this code. Please request a new code." },
        { status: 429 }
      ),
      origin,
      allowedOrigins
    );
  }

  const isValid = verifyOtpTimingSafe(code, challenge.code_hash);

  if (!isValid) {
    // Record failed attempt
    await supabaseAdmin
      .from("conference_verification_challenges")
      .update({
        attempts_count: challenge.attempts_count + 1,
        attempt_ip_hash: ipHash,
      })
      .eq("id", challenge.id);

    return appendCors(
      NextResponse.json(
        { error: "Invalid verification code. Please check your email and try again." },
        { status: 400 }
      ),
      origin,
      allowedOrigins
    );
  }

  // Consume challenge immediately to prevent replay
  await supabaseAdmin
    .from("conference_verification_challenges")
    .update({
      consumed_at: now.toISOString(),
      attempt_ip_hash: ipHash,
    })
    .eq("id", challenge.id);

  // Generate cryptographic token bound to selectedSubmissionId
  const submissionId = challenge.submission_id || challenge.submission?.id || "";
  const token = generateAuthorVerificationToken({
    challengeId: challenge.id,
    verifiedEmailHash: emailHash,
    editionId: edition.id,
    selectedSubmissionId: submissionId,
  });

  return appendCors(
    NextResponse.json({
      success: true,
      token,
      submission: {
        id: challenge.submission?.id || challenge.submission_id,
        title: challenge.submission?.title || "Accepted Conference Manuscript",
        submission_number: challenge.submission?.submission_number || "PAPER",
      },
    }),
    origin,
    allowedOrigins
  );
}
