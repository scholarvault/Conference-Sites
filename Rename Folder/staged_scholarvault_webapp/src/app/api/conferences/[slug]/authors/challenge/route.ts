import { NextRequest, NextResponse } from "next/server";
import { appendCors, getEditionBySlug } from "@/features/conferences/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  generateSecureOtp,
  hashIdentifier,
  hashOtp,
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
  const requestedSubmissionId = String(body.submission_id || "").trim();

  if (!email || !email.includes("@")) {
    return appendCors(
      NextResponse.json({ error: "A valid author email address is required." }, { status: 400 }),
      origin,
      allowedOrigins
    );
  }

  // IP Resolution & Hashing for Privacy Defense
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "127.0.0.1";
  const ipHash = hashIdentifier(clientIp);
  const emailHash = hashIdentifier(email);
  const now = new Date();

  // 1. IP Rate Limiting (max 5 requests per 15 minutes)
  const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000).toISOString();
  const { count: ipCount } = await supabaseAdmin
    .from("conference_verification_challenges")
    .select("id", { count: "exact", head: true })
    .eq("request_ip_hash", ipHash)
    .gte("created_at", fifteenMinutesAgo);

  if ((ipCount || 0) >= 5) {
    return appendCors(
      NextResponse.json(
        { error: "Too many verification requests from your network. Please wait a few minutes." },
        { status: 429 }
      ),
      origin,
      allowedOrigins
    );
  }

  // 2. Email Rate Limiting (max 3 challenges per email per hour)
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
  const { count: emailCount } = await supabaseAdmin
    .from("conference_verification_challenges")
    .select("id", { count: "exact", head: true })
    .eq("conference_edition_id", edition.id)
    .eq("email_hash", emailHash)
    .gte("created_at", oneHourAgo);

  if ((emailCount || 0) >= 3) {
    return appendCors(
      NextResponse.json(
        { error: "Too many verification codes sent to this email. Please check your inbox or wait an hour." },
        { status: 429 }
      ),
      origin,
      allowedOrigins
    );
  }

  // 3. Search for eligible accepted or screened submissions matching this author
  let query = supabaseAdmin
    .from("conference_submissions")
    .select(
      `id, submission_number, title, decision_status, screening_status,
       authors:conference_submission_authors!inner(email, author_role, is_corresponding)`
    )
    .eq("conference_edition_id", edition.id)
    .ilike("authors.email", email);

  if (requestedSubmissionId) {
    query = query.or(`id.eq.${requestedSubmissionId},submission_number.eq.${requestedSubmissionId}`);
  }

  const { data: matchedSubmissions } = await query;

  // Filter for eligible submissions (accepted or passed screening)
  const eligible = (matchedSubmissions || []).filter(
    (sub) => sub.decision_status === "accepted" || sub.screening_status === "passed"
  );

  // Timing-safe response: Always return the identical response to prevent author enumeration
  if (!eligible.length) {
    // Artificial jitter to mimic hashing/dispatch latency
    await new Promise((resolve) => setTimeout(resolve, 150));
    return appendCors(
      NextResponse.json({
        success: true,
        message: "If an eligible accepted submission is associated with this email, a 6-digit verification code has been dispatched.",
      }),
      origin,
      allowedOrigins
    );
  }

  const targetSubmission = eligible[0];
  const otpCode = generateSecureOtp();
  const codeHash = hashOtp(otpCode);
  const expiresAt = new Date(now.getTime() + 15 * 60 * 1000).toISOString(); // 15 mins

  // Record challenge
  await supabaseAdmin.from("conference_verification_challenges").insert({
    conference_edition_id: edition.id,
    email_hash: emailHash,
    code_hash: codeHash,
    submission_id: targetSubmission.id,
    request_ip_hash: ipHash,
    attempts_count: 0,
    max_attempts: 5,
    expires_at: expiresAt,
    created_at: now.toISOString(),
  });

  // Enqueue branded OTP email in outbox
  await supabaseAdmin.from("conference_email_outbox").insert({
    conference_edition_id: edition.id,
    event_key: "author_verification_challenge",
    idempotency_key: `author_otp:${edition.id}:${emailHash}:${Date.now()}`,
    recipient_email: email,
    template_key: "author_verification_code",
    template_data: {
      conferenceName: edition.name,
      code: otpCode,
      paperTitle: targetSubmission.title,
      paperNumber: targetSubmission.submission_number,
      validityMinutes: 15,
    },
  });

  return appendCors(
    NextResponse.json({
      success: true,
      message: "If an eligible accepted submission is associated with this email, a 6-digit verification code has been dispatched.",
    }),
    origin,
    allowedOrigins
  );
}
