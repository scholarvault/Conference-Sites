import { NextRequest, NextResponse } from "next/server";
import { appendCors, getEditionBySlug } from "@/features/conferences/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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

  // Check if provisional leads are enabled in conference configuration
  if (edition.payment_config?.provisional_leads_enabled === false) {
    return appendCors(
      NextResponse.json({ error: "Provisional lead capture is disabled for this conference." }, { status: 403 }),
      origin,
      allowedOrigins
    );
  }

  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "").toLowerCase().trim();
  const fullName = String(body.full_name || body.name || "").trim();
  const institution = String(body.institution || "").trim();
  const phone = String(body.phone || "").trim();
  const categoryCode = String(body.category_code || body.category || "").trim();
  const consentGiven = body.consent_given === true;

  if (!email || !email.includes("@")) {
    return appendCors(
      NextResponse.json({ error: "A valid email address is required." }, { status: 400 }),
      origin,
      allowedOrigins
    );
  }

  if (!consentGiven) {
    return appendCors(
      NextResponse.json(
        { error: "Explicit consent is required to save provisional registration intent." },
        { status: 400 }
      ),
      origin,
      allowedOrigins
    );
  }

  const now = new Date().toISOString();
  const metadata = {
    phone,
    category_code: categoryCode,
    consent_given: true,
    consent_timestamp: now,
    referrer: request.headers.get("referer") || origin || "direct",
    intent_source: "provisional_registration_dropoff_save",
  };

  const { data: lead, error: insertError } = await supabaseAdmin
    .from("conference_inbound_leads")
    .upsert(
      {
        conference_edition_id: edition.id,
        source: "interest",
        full_name: fullName || null,
        email,
        institution: institution || null,
        message: `Provisional registration intent for category: ${categoryCode || "general"}`,
        metadata,
        status: "new",
        updated_at: now,
      },
      { onConflict: "conference_edition_id,source,email" }
    )
    .select("id, email, status")
    .single();

  if (insertError) {
    return appendCors(
      NextResponse.json({ error: insertError.message }, { status: 500 }),
      origin,
      allowedOrigins
    );
  }

  return appendCors(
    NextResponse.json({
      success: true,
      lead_id: lead.id,
      message: "Provisional registration intent recorded securely.",
    }),
    origin,
    allowedOrigins
  );
}
