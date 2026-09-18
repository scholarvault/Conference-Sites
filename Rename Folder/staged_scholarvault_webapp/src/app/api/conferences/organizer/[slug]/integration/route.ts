/* eslint-disable @typescript-eslint/no-explicit-any -- Supabase readiness projections are normalized at this protected API boundary. */

import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { requireCredentialLifecycleAccess } from "@/features/conferences/credentialLifecycle";
import { conferenceProductPrice } from "@/features/conferences/paymentPricing";
import { resolvePaymentCapabilities } from "@/features/conferences/paymentCapabilities";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { runAudit } from "@/lib/auditEngine";

type CheckStatus = "connected" | "needs_attention" | "not_configured" | "testing" | "failed";
type HealthCheck = {
  checkType: string;
  label: string;
  status: CheckStatus;
  evidence: Record<string, unknown>;
  failureReason?: string | null;
  nextAction: string;
  checkedAt: string;
};

const LABELS: Record<string, string> = {
  database_record: "Conference database record",
  public_website: "Public website",
  authorized_origin: "Authorized website origin",
  connector: "ScholarVault connector",
  submission_form: "Abstract submission form",
  registration_form: "Registration form",
  payments: "Payments & bank wire",
  transactional_email: "Transactional email",
  scvs_badge: "SCVS assessment and badge",
  credential_readiness: "Credential readiness",
};

function result(
  checkType: string,
  status: CheckStatus,
  nextAction: string,
  evidence: Record<string, unknown> = {},
  failureReason?: string
): HealthCheck {
  return {
    checkType,
    label: LABELS[checkType] || checkType,
    status,
    evidence,
    failureReason: failureReason || null,
    nextAction,
    checkedAt: new Date().toISOString(),
  };
}

function privateAddress(address: string) {
  if (
    address === "::1" ||
    address.startsWith("fc") ||
    address.startsWith("fd") ||
    address.startsWith("fe80:")
  )
    return true;
  const parts = address.split(".").map(Number);
  if (parts.length !== 4) return false;
  return (
    parts[0] === 10 ||
    parts[0] === 127 ||
    (parts[0] === 169 && parts[1] === 254) ||
    (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
    (parts[0] === 192 && parts[1] === 168)
  );
}

async function safeWebsite(value: unknown) {
  const url = new URL(String(value || ""));
  if (!["http:", "https:"].includes(url.protocol) || !url.hostname || url.username || url.password)
    throw new Error("Use a public HTTP or HTTPS website URL.");
  if (
    url.hostname === "localhost" ||
    url.hostname.endsWith(".local") ||
    (isIP(url.hostname) && privateAddress(url.hostname))
  )
    throw new Error("Private or local network websites cannot be tested.");
  const addresses = await lookup(url.hostname, { all: true });
  if (!addresses.length || addresses.some((entry) => privateAddress(entry.address)))
    throw new Error("The website resolves to a private or unavailable network address.");
  return url;
}

async function buildChecks(edition: any, scanWebsite: boolean) {
  const [forms, categories, scvs, credentialBucket, receiptsBucket] = await Promise.all([
    supabaseAdmin
      .from("conference_form_schemas")
      .select("form_type,is_active")
      .eq("conference_edition_id", edition.id)
      .eq("is_active", true),
    supabaseAdmin
      .from("conference_registration_categories")
      .select("id,code,amount,currency,payment_config,is_active")
      .eq("conference_edition_id", edition.id)
      .eq("is_active", true),
    supabaseAdmin
      .from("conference_scvs_profiles")
      .select("*")
      .eq("conference_edition_id", edition.id)
      .maybeSingle(),
    supabaseAdmin.storage.getBucket("conference-credentials"),
    supabaseAdmin.storage.getBucket("conference-bank-receipts"),
  ]);

  const formTypes = new Set((forms.data || []).map((item) => item.form_type));
  const paid = (categories.data || []).filter((item) => Number(item.amount || 0) > 0);

  // Contextual payment checks
  const capabilities = resolvePaymentCapabilities(edition.payment_config, edition.currency || "INR");
  const omniwareKey = Boolean(process.env.FEDERAL_OMNIWARE_API_KEY || process.env.OMNIWARE_API_KEY);
  const dodoKey = Boolean(process.env.DODO_PAYMENTS_API_KEY);
  const bankWireOk = capabilities.bankTransferAvailable;

  const onlineOk = paid.every((item) =>
    Boolean(conferenceProductPrice(item, item.currency || edition.currency))
  );

  let paymentStatus: CheckStatus = "connected";
  let paymentMsg = "Every paid category resolves to a server-approved product or bank wire.";
  if (paid.length > 0) {
    const hasInr = paid.some((c) => (c.currency || "INR").toUpperCase() === "INR");
    const hasUsd = paid.some((c) => (c.currency || "").toUpperCase() === "USD");

    const inrOk = !hasInr || (omniwareKey && onlineOk) || bankWireOk;
    const usdOk = !hasUsd || (dodoKey && onlineOk);

    if (!inrOk || !usdOk) {
      paymentStatus = "needs_attention";
      paymentMsg = "Configure valid payment providers (Federal Omniware, Dodo, or Bank Wire).";
    }
  }

  const websiteUrl = String(edition.website_url || "").trim();
  let website = result(
    "public_website",
    websiteUrl ? "needs_attention" : "not_configured",
    websiteUrl ? "Run the website connection test." : "Add the public conference website URL.",
    { websiteUrl }
  );
  let origin = result(
    "authorized_origin",
    edition.allowed_embed_origins?.length && !edition.allowed_embed_origins.includes("*")
      ? "connected"
      : "not_configured",
    edition.allowed_embed_origins?.length
      ? "Authorized origins are configured."
      : "Add the specific website origin that may open ScholarVault forms.",
    { origins: edition.allowed_embed_origins || [] }
  );
  let connector = result(
    "connector",
    "not_configured",
    "Install conference-embed/v2.0.0.js and map Submit and Register CTAs."
  );

  if (scanWebsite && websiteUrl) {
    try {
      const url = await safeWebsite(websiteUrl);
      const response = await fetch(url, {
        redirect: "follow",
        signal: AbortSignal.timeout(8000),
        headers: { "user-agent": "ScholarVault-Integration-Check/2.0" },
      });
      if (!response.ok) throw new Error(`Website returned HTTP ${response.status}.`);
      const html = (await response.text()).slice(0, 400_000);
      const hasScript = /conference-embed/i.test(html);
      const hasSlug = html.includes(edition.slug);
      const hasSubmit = /data-(scholarvault|sv)-action=["']submit["']/i.test(html);
      const hasRegister = /data-(scholarvault|sv)-action=["']register["']/i.test(html);
      website = result("public_website", "connected", "Website responds successfully.", {
        websiteUrl: url.toString(),
        httpStatus: response.status,
      });
      origin = result(
        "authorized_origin",
        (edition.allowed_embed_origins || []).includes(url.origin) ? "connected" : "needs_attention",
        (edition.allowed_embed_origins || []).includes(url.origin)
          ? "Website origin is authorized."
          : `Add ${url.origin} to allowed origins.`,
        { origin: url.origin }
      );
      connector = result(
        "connector",
        hasScript && hasSlug && hasSubmit && hasRegister ? "connected" : "needs_attention",
        hasScript && hasSlug && hasSubmit && hasRegister
          ? "Submit and Register CTAs are mapped to this edition."
          : "Install the connector and map both Submit and Register CTAs to this edition slug.",
        { hasScript, hasSlug, hasSubmit, hasRegister }
      );
    } catch (error) {
      website = result(
        "public_website",
        "failed",
        "Confirm the URL is public and try again.",
        { websiteUrl },
        error instanceof Error ? error.message : "Website test failed."
      );
      connector = result("connector", "failed", "Website must be reachable before the connector can be verified.");
    }
  }

  return [
    result("database_record", "connected", "Canonical edition record is active.", {
      editionId: edition.id,
      slug: edition.slug,
    }),
    website,
    origin,
    connector,
    result(
      "submission_form",
      formTypes.has("submission") ? "connected" : "not_configured",
      formTypes.has("submission") ? "Submission schema is active." : "Create and publish the submission form."
    ),
    result(
      "registration_form",
      formTypes.has("registration") ? "connected" : "not_configured",
      formTypes.has("registration") ? "Registration schema is active." : "Create and publish the registration form."
    ),
    result("payments", paymentStatus, paymentMsg, {
      totalCategories: categories.data?.length || 0,
      paidCategories: paid.length,
      bankWireOk,
      onlineOk,
      providers: capabilities.providers,
    }),
    result(
      "transactional_email",
      process.env.RESEND_API_KEY && (process.env.CONFERENCE_EMAIL_WORKER_SECRET || process.env.CRON_SECRET)
        ? "connected"
        : "needs_attention",
      process.env.RESEND_API_KEY
        ? "Resend and outbox processor are configured."
        : "Configure RESEND_API_KEY and CRON_SECRET for outbox notifications."
    ),
    result(
      "scvs_badge",
      scvs.data?.badge_status === "active" ? "connected" : "not_configured",
      scvs.data?.badge_status === "active"
        ? "SCVS assessment and badge are active."
        : "Run an SCVS assessment or request expert review."
    ),
    result(
      "credential_readiness",
      credentialBucket.data && receiptsBucket.data ? "connected" : "needs_attention",
      credentialBucket.data && receiptsBucket.data
        ? "Private storage buckets are initialized."
        : "Initialize conference-credentials and conference-bank-receipts buckets."
    ),
  ];
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const access = await requireCredentialLifecycleAccess(slug);
  if ("response" in access) return access.response;

  const checks = await buildChecks(access.edition, false);
  const connected = checks.filter((c) => c.status === "connected").length;

  return NextResponse.json({
    edition: access.edition,
    checks,
    connectedCount: connected,
    totalCount: checks.length,
    percentage: Math.round((connected / checks.length) * 100),
  });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const access = await requireCredentialLifecycleAccess(slug);
  if ("response" in access) return access.response;

  const body = await request.json().catch(() => ({}));
  const action = String(body.action || "run_checks");

  if (action === "run_scvs") {
    const websiteUrl = String(access.edition.website_url || "").trim();
    if (!websiteUrl) {
      return NextResponse.json({ error: "Public conference website URL is required for SCVS assessment." }, { status: 400 });
    }
    const audit = await runAudit(websiteUrl, {
      editionId: access.edition.id,
      conferenceName: access.edition.name,
      year: access.edition.year || 2026,
    });
    return NextResponse.json({ success: true, audit });
  }

  const checks = await buildChecks(access.edition, action === "run_checks");
  const connected = checks.filter((c) => c.status === "connected").length;

  return NextResponse.json({
    success: true,
    edition: access.edition,
    checks,
    connectedCount: connected,
    totalCount: checks.length,
    percentage: Math.round((connected / checks.length) * 100),
  });
}
