import { NextRequest, NextResponse } from "next/server";
import { requireCredentialLifecycleAccess } from "@/features/conferences/credentialLifecycle";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { conferenceProductPrice } from "@/features/conferences/paymentPricing";
import { resolvePaymentCapabilities } from "@/features/conferences/paymentCapabilities";

export interface ReadinessRuleResult {
  ruleId: string;
  name: string;
  isMandatory: boolean;
  status: "passed" | "failed" | "not_applicable";
  description: string;
  remediation?: string | null;
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const access = await requireCredentialLifecycleAccess(slug);
  if ("response" in access) return access.response;

  const edition = access.edition;

  // Gather platform dependencies concurrently
  const [formsResult, categoriesResult, credentialsBucket, receiptsBucket] = await Promise.all([
    supabaseAdmin
      .from("conference_form_schemas")
      .select("form_type, is_active")
      .eq("conference_edition_id", edition.id)
      .eq("is_active", true),
    supabaseAdmin
      .from("conference_registration_categories")
      .select("id, code, amount, currency, payment_config, is_active")
      .eq("conference_edition_id", edition.id)
      .eq("is_active", true),
    supabaseAdmin.storage.getBucket("conference-credentials"),
    supabaseAdmin.storage.getBucket("conference-bank-receipts"),
  ]);

  const formTypes = new Set((formsResult.data || []).map((f) => f.form_type));
  const categories = categoriesResult.data || [];
  const paidCategories = categories.filter((c) => Number(c.amount || 0) > 0);
  const isPaidConference = paidCategories.length > 0;

  const hasInrCategories = paidCategories.some((c) => (c.currency || "INR").toUpperCase() === "INR");
  const hasUsdCategories = paidCategories.some((c) => (c.currency || "").toUpperCase() === "USD");

  const rules: ReadinessRuleResult[] = [];

  // Rule 1: Canonical Database Record
  rules.push({
    ruleId: "canonical_record",
    name: "Canonical Conference Record",
    isMandatory: true,
    status: edition.id ? "passed" : "failed",
    description: "Conference edition is active on ScholarVault registry.",
  });

  // Rule 2: Authorized Origins
  const origins = edition.allowed_embed_origins || [];
  const hasOrigins = origins.length > 0 && !origins.includes("*");
  rules.push({
    ruleId: "authorized_origins",
    name: "Authorized Website Origins",
    isMandatory: true,
    status: hasOrigins ? "passed" : "failed",
    description: hasOrigins
      ? `Embed origins configured: ${origins.join(", ")}`
      : "No production origins configured. Wildcards (*) are disallowed for production.",
    remediation: "Add the exact public origin (e.g. https://researchintegrity2026.scholarvault.in) in conference settings.",
  });

  // Rule 3: Forms Configuration
  const hasSubmissionForm = formTypes.has("submission");
  const hasRegForm = formTypes.has("registration");
  rules.push({
    ruleId: "form_schemas",
    name: "Active Form Schemas",
    isMandatory: true,
    status: hasSubmissionForm && hasRegForm ? "passed" : "failed",
    description: hasSubmissionForm && hasRegForm
      ? "Abstract submission and delegate registration forms are published."
      : "One or more required forms are missing or inactive.",
    remediation: "Publish both the abstract submission and registration form schemas.",
  });

  // Rule 4: Registration Categories & Verified Pricing
  const allPaidPriced =
    paidCategories.length > 0 &&
    paidCategories.every((cat) => Boolean(conferenceProductPrice(cat, cat.currency || "INR")));

  rules.push({
    ruleId: "registration_pricing",
    name: "Registration Categories & Pricing",
    isMandatory: true,
    status: categories.length > 0 && (!isPaidConference || allPaidPriced) ? "passed" : "failed",
    description: categories.length > 0
      ? isPaidConference
        ? allPaidPriced
          ? `All ${paidCategories.length} paid pass tiers reconcile with server pricing.`
          : "Some paid tiers have unresolved gateway product mappings."
        : "Free conference passes are active."
      : "No active registration categories configured.",
    remediation: "Ensure all active delegate pass tiers have matching server pricing models.",
  });

  // Rule 5: INR Payment Capabilities (Omniware OR Bank Wire)
  const inrCapabilities = resolvePaymentCapabilities(edition.payment_config, "INR");
  const omniwareKey = Boolean(process.env.FEDERAL_OMNIWARE_API_KEY || process.env.OMNIWARE_API_KEY);
  const bankWireConfigured = inrCapabilities.bankTransferAvailable;

  if (hasInrCategories) {
    const inrPassed = (omniwareKey && inrCapabilities.onlineAvailable) || bankWireConfigured;
    rules.push({
      ruleId: "inr_payment_gateway",
      name: "INR Payment Route (Omniware or Bank Wire)",
      isMandatory: true,
      status: inrPassed ? "passed" : "failed",
      description: inrPassed
        ? bankWireConfigured && omniwareKey
          ? "Both Federal Omniware gateway and direct bank wire reconciliation are active."
          : bankWireConfigured
          ? "Direct Bank Wire reconciliation is active."
          : "Federal Omniware gateway is active."
        : "Neither Federal Omniware nor Bank Wire reconciliation is configured for INR.",
      remediation: "Enable Federal Omniware credentials in environment or configure bank transfer instructions.",
    });
  } else {
    rules.push({
      ruleId: "inr_payment_gateway",
      name: "INR Payment Route",
      isMandatory: false,
      status: "not_applicable",
      description: "No INR registration passes configured for this edition.",
    });
  }

  // Rule 6: USD Payment Capabilities (Dodo Payments)
  const dodoKey = Boolean(process.env.DODO_PAYMENTS_API_KEY);
  if (hasUsdCategories) {
    rules.push({
      ruleId: "usd_payment_gateway",
      name: "USD International Gateway (Dodo Payments)",
      isMandatory: true,
      status: dodoKey ? "passed" : "failed",
      description: dodoKey
        ? "Dodo Payments credentials are configured for international delegates."
        : "Missing Dodo Payments API key in environment.",
      remediation: "Add DODO_PAYMENTS_API_KEY and DODO_PAYMENTS_WEBHOOK_KEY to environment variables.",
    });
  } else {
    rules.push({
      ruleId: "usd_payment_gateway",
      name: "USD International Gateway",
      isMandatory: false,
      status: "not_applicable",
      description: "No USD registration passes configured for this edition.",
    });
  }

  // Rule 7: Transactional Email Deliverability
  const emailReady = Boolean(
    process.env.RESEND_API_KEY && (process.env.CONFERENCE_EMAIL_WORKER_SECRET || process.env.CRON_SECRET)
  );
  rules.push({
    ruleId: "transactional_email",
    name: "Transactional Email Engine",
    isMandatory: true,
    status: emailReady ? "passed" : "failed",
    description: emailReady
      ? "Resend email delivery pipeline and outbox processor are active."
      : "Transactional email credentials or cron secrets are missing.",
    remediation: "Configure RESEND_API_KEY and CRON_SECRET for the conference outbox queue.",
  });

  // Rule 8: Secure Storage Buckets
  const storageReady = Boolean(credentialsBucket.data && receiptsBucket.data);
  rules.push({
    ruleId: "storage_buckets",
    name: "Private Storage Infrastructure",
    isMandatory: true,
    status: storageReady ? "passed" : "failed",
    description: storageReady
      ? "Private credential storage and bank receipt buckets are provisioned."
      : "One or more private storage buckets are not initialized.",
    remediation: "Run database migrations to ensure conference-credentials and conference-bank-receipts exist.",
  });

  // Compute overall readiness verdict
  const mandatoryRules = rules.filter((r) => r.isMandatory);
  const mandatoryPassed = mandatoryRules.filter((r) => r.status === "passed");
  const isReady = mandatoryPassed.length === mandatoryRules.length;
  const readinessPercentage = Math.round((mandatoryPassed.length / mandatoryRules.length) * 100);

  return NextResponse.json({
    verdict: isReady ? "READY" : "BLOCKED",
    readinessPercentage,
    passedCount: mandatoryPassed.length,
    mandatoryCount: mandatoryRules.length,
    rules,
    checkedAt: new Date().toISOString(),
  });
}
