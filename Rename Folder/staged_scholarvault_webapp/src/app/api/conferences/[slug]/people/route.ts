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

export async function GET(
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

  const { data: people, error } = await supabaseAdmin
    .from("conference_people")
    .select("id, display_name, role, institution, country, avatar_url, bio, social_links, display_order")
    .eq("conference_edition_id", edition.id)
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  if (error) {
    return appendCors(
      NextResponse.json({ error: error.message }, { status: 500 }),
      origin,
      allowedOrigins
    );
  }

  return appendCors(
    NextResponse.json({
      success: true,
      people: people || [],
    }),
    origin,
    allowedOrigins
  );
}
