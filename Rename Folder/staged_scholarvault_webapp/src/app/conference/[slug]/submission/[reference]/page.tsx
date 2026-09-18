"use client";

/* eslint-disable @typescript-eslint/no-explicit-any -- Submission relation payloads vary by conference settings. */

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  FileText,
  Sparkles,
  ArrowRight,
  Calendar,
  User,
  Award,
  Download,
  ShieldCheck,
  MapPin,
  Building2,
  Lock,
  Send,
  ExternalLink,
} from "lucide-react";
import "@/features/portal/portal.css";
import {
  DEFAULT_LETTER_SETTINGS,
  downloadAcceptanceLetterPdf,
  AcceptanceLetterFormat,
} from "@/features/conferences/acceptanceLetterEngine";

function formatConferenceDates(start?: string | null, end?: string | null) {
  if (!start) return "Dates to be announced";
  const s = new Date(start);
  const e = end ? new Date(end) : s;
  return (
    s.toLocaleDateString("en-US", { month: "long", day: "numeric" }) +
    "–" +
    e.toLocaleDateString("en-US", { day: "numeric", year: "numeric" })
  );
}

export default function GuestSubmissionTracker({
  params,
}: {
  params: Promise<{ slug: string; reference: string }>;
}) {
  const [data, setData] = useState<any>(null);
  const [conferenceSlug, setConferenceSlug] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Loading your secure submission tracker…");

  // Magic link request state for public verification desk gateway
  const [authorEmailInput, setAuthorEmailInput] = useState("");
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [magicLinkMessage, setMagicLinkMessage] = useState("");
  const [magicLinkError, setMagicLinkError] = useState("");

  const [claimingWaiver, setClaimingWaiver] = useState(false);
  const [waiverClaimSuccess, setWaiverClaimSuccess] = useState("");
  const [waiverClaimError, setWaiverClaimError] = useState("");

  useEffect(() => {
    void params.then(async (value) => {
      setConferenceSlug(value.slug);
      setReferenceId(value.reference);
      try {
        const response = await fetch(
          `/api/conferences/${encodeURIComponent(value.slug)}/guest/submissions/${encodeURIComponent(value.reference)}`
        );
        const result = await response.json();
        if (!response.ok) {
          setMessage(result?.error?.message || "Unable to load this submission.");
          setLoading(false);
          return;
        }
        setData(result.data);
      } catch {
        setMessage("Could not connect to the submission tracker. Please try again.");
      } finally {
        setLoading(false);
      }
    });
  }, [params]);

  const handleRequestMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorEmailInput.trim()) return;
    setMagicLinkLoading(true);
    setMagicLinkError("");
    try {
      const response = await fetch(
        `/api/conferences/${encodeURIComponent(conferenceSlug)}/guest/submissions/${encodeURIComponent(referenceId)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: authorEmailInput }),
        }
      );
      const result = await response.json();
      if (!response.ok) {
        setMagicLinkError(result?.error?.message || "Failed to request access link.");
        return;
      }
      setMagicLinkSent(true);
      setMagicLinkMessage(
        result?.message ||
          "If this email matches our records, a secure access link has been sent to your inbox."
      );
    } catch {
      setMagicLinkError("Unable to connect to service. Please try again.");
    } finally {
      setMagicLinkLoading(false);
    }
  };

  const handleClaimWaiver = async () => {
    setClaimingWaiver(true);
    setWaiverClaimError("");
    setWaiverClaimSuccess("");
    try {
      const response = await fetch(
        `/api/conferences/${encodeURIComponent(conferenceSlug)}/guest/submissions/${encodeURIComponent(referenceId)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "claim_waiver" }),
        }
      );
      const resData = await response.json();
      if (!response.ok) {
        setWaiverClaimError(resData?.error?.message || "Failed to confirm registration.");
        return;
      }
      setWaiverClaimSuccess("Registration confirmed! Presenter registration fee completely waived (₹0).");
      const refResponse = await fetch(
        `/api/conferences/${encodeURIComponent(conferenceSlug)}/guest/submissions/${encodeURIComponent(referenceId)}`
      );
      const refResult = await refResponse.json();
      if (refResult.ok) setData(refResult.data);
    } catch {
      setWaiverClaimError("Network error. Please try again.");
    } finally {
      setClaimingWaiver(false);
    }
  };

  const handleDownloadAcceptance = (formatOverride?: AcceptanceLetterFormat) => {
    if (data?.edition) {
      downloadAcceptanceLetterPdf(
        data,
        data.edition,
        data.edition.settings?.acceptance_letter,
        undefined,
        undefined,
        formatOverride
      );
    } else {
      const query = formatOverride ? `?format=${encodeURIComponent(formatOverride)}` : "";
      window.open(
        `/api/conferences/${encodeURIComponent(conferenceSlug || "svrias-2026")}/submissions/${encodeURIComponent(data?.submission_number || referenceId)}/acceptance-letter${query}`,
        "_blank"
      );
    }
    void fetch(
      `/api/conferences/${encodeURIComponent(conferenceSlug || "svrias-2026")}/guest/submissions/${encodeURIComponent(data?.submission_number || referenceId)}/track-download`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "author_tracker", format: formatOverride }),
      }
    ).catch(() => null);
  };

  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center px-5 bg-[var(--bg-primary)]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--gold)] border-t-transparent" />
          <p className="text-xs font-semibold text-[var(--text-secondary)]">
            Loading submission record…
          </p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen grid place-items-center px-5 bg-[var(--bg-primary)]">
        <div className="max-w-md text-center rounded-3xl border border-[var(--border)] bg-[var(--surface-base)] p-8 shadow-xl">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-red-500/10 text-red-500 mb-4">
            <FileText size={24} />
          </div>
          <h1 className="text-lg font-black text-[var(--text-primary)]">
            Submission Access
          </h1>
          <p className="mt-2 text-xs text-[var(--text-secondary)]">{message}</p>
          <p className="mt-4 text-[11px] text-[var(--text-tertiary)]">
            Please verify your link or check your email for the secure verification link sent to the author.
          </p>
        </div>
      </main>
    );
  }

  // PUBLIC ACCEPTANCE VERIFICATION GATEWAY
  if (data.isPublicVerification) {
    const chairSettings = {
      ...DEFAULT_LETTER_SETTINGS,
      ...(data.edition?.settings?.acceptance_letter || {}),
    };

    const trackName =
      typeof data.track === "object" && data.track !== null
        ? data.track.name
        : String(data.track || "General Conference Track");

    const venueString =
      chairSettings.venue_details ||
      [data.edition?.venue_name, data.edition?.city, data.edition?.country]
        .filter(Boolean)
        .join(", ") ||
      "Hybrid Session (In-Person & Virtual Presentation)";

    const isAccepted = data.decision_status === "accepted";
    const decisionText = isAccepted
      ? "Officially Accepted for Oral/Poster Presentation"
      : data.decision_status
        ? `Status: ${String(data.decision_status).replace(/_/g, " ").toUpperCase()}`
        : "Evaluation Underway";

    const isSample = Boolean(data.isSamplePreview);

    return (
      <main className="min-h-screen bg-[var(--bg-primary)] px-5 py-8 md:px-8 md:py-12 text-[var(--text-primary)]">
        <div className="mx-auto w-full max-w-4xl space-y-6">
          {/* Concluded Conference Expiry Alert */}
          {data.edition?.isConcluded && (
            <div className="rounded-2xl border border-zinc-500/30 bg-zinc-100 dark:bg-zinc-900/60 p-4 text-xs">
              <div className="flex items-center gap-2 font-black uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                <Clock size={14} /> Conference Concluded & Verification Window Expired
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
                This conference edition concluded on {new Date(data.edition.ends_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}. Live conference presentation credentials and active attendee verification windows have expired. This record is preserved in the permanent ScholarVault Academic Archive.
              </p>
            </div>
          )}

          {/* Top Verified Academic Record Trust Card */}
          <div className="rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-[var(--surface-base)] to-amber-500/10 p-6 md:p-8 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start sm:items-center gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 shadow-inner">
                  <ShieldCheck size={32} />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-emerald-600">
                    {isSample ? "SAMPLE ACCEPTANCE RECORD VERIFIED ✓" : "OFFICIAL ACADEMIC RECORD VERIFIED ✓"}
                  </div>
                  <h1 className="mt-1 text-lg md:text-xl font-black text-[var(--text-primary)]">
                    ScholarVault Conference Verification Engine
                  </h1>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Cryptographic Public Authenticity Ledger • Ref:{" "}
                    <span className="font-mono font-bold text-[var(--text-primary)]">
                      {data.submission_number}
                    </span>
                  </p>
                </div>
              </div>

              <div className="sm:text-right">
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--gold)]/30 bg-[var(--gold)]/10 px-3 py-1.5 text-xs font-black text-[var(--gold-dark)]">
                  <Award size={14} /> Tamper-Proof Record
                </span>
                {isSample && (
                  <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mt-1">
                    Preview Sample Mode
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Conference Details & Emblem Card */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-base)] p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-[var(--border)]">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-1 text-[11px] font-black uppercase tracking-widest text-[var(--gold)]">
                  {data.edition?.short_name || "Academic Conference"}
                </div>
                <h2 className="text-xl md:text-2xl font-black text-[var(--text-primary)]">
                  {data.edition?.name || "International Academic Summit"}
                </h2>
                <div className="flex flex-wrap gap-4 pt-1 text-xs text-[var(--text-secondary)]">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <Calendar size={14} className="text-[var(--gold)]" />
                    {formatConferenceDates(data.edition?.starts_at, data.edition?.ends_at)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <MapPin size={14} className="text-[var(--gold)]" />
                    {venueString}
                  </span>
                </div>
              </div>

              {data.edition?.logo_url && (
                <div className="shrink-0 flex items-center justify-center p-2 rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)] h-16 w-16 md:h-20 md:w-20">
                  <img
                    src={data.edition.logo_url}
                    alt={`${data.edition.name} emblem`}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}
            </div>

            {/* Manuscript Info */}
            <div className="pt-6 space-y-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-[var(--gold)]">
                  Verified Manuscript Title
                </span>
                <h3 className="mt-1 text-xl md:text-2xl font-black leading-snug text-[var(--text-primary)]">
                  {data.title}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)]">
                  Thematic Track: <strong className="text-[var(--text-primary)]">{trackName}</strong>
                </span>
                {data.submitted_at && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)]">
                    Submitted:{" "}
                    <strong className="text-[var(--text-primary)]">
                      {new Date(data.submitted_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </strong>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Decision Status Banner */}
          <div className="rounded-3xl border-2 border-[var(--gold)]/40 bg-gradient-to-br from-[var(--gold-pale)] via-[var(--surface-base)] to-[var(--surface-subtle)] p-6 md:p-8 shadow-md">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[var(--gold)]/20 text-[var(--gold-dark)] border border-[var(--gold)]/30">
                <Award size={26} />
              </div>
              <div>
                <div className="text-[11px] font-black uppercase tracking-widest text-[var(--gold-dark)]">
                  Editorial Decision Status
                </div>
                <h4 className="mt-1 text-lg font-black text-[var(--text-primary)]">
                  {decisionText}
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
                  This research manuscript has been peer-reviewed and vetted through rigorous double-blind evaluation by the Technical Programme Committee and General Chair.
                </p>
              </div>
            </div>
          </div>

          {/* Authors & Affiliations Card */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-base)] p-6 md:p-8 shadow-sm">
            <div className="text-[11px] font-black uppercase tracking-widest text-[var(--gold)] mb-4">
              Verified Authors & Institutional Affiliations
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {(data.authors || []).map((author: any, idx: number) => (
                <div
                  key={`${author.name}-${idx}`}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] p-4 space-y-1.5"
                >
                  <div className="flex items-center gap-2 font-bold text-sm text-[var(--text-primary)]">
                    <User size={15} className="text-[var(--gold)] shrink-0" />
                    <span>{author.name}</span>
                  </div>
                  {author.institution && (
                    <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                      <Building2 size={13} className="text-[var(--text-tertiary)] shrink-0" />
                      <span className="truncate">{author.institution}</span>
                    </div>
                  )}
                  {author.country && (
                    <div className="flex items-center gap-2 text-[11px] text-[var(--text-tertiary)]">
                      <MapPin size={13} className="text-[var(--text-tertiary)] shrink-0" />
                      <span>{author.country}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-4 text-[11px] text-[var(--text-tertiary)] flex items-center gap-1.5">
              <Lock size={12} /> Contact emails are securely masked to protect researcher privacy from unauthorized scraping.
            </p>
          </div>

          {/* Leadership Endorsement Card */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-base)] p-6 md:p-8 shadow-sm">
            <div className="text-[11px] font-black uppercase tracking-widest text-[var(--gold)] mb-4">
              Executive Conference Leadership & Endorsement
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* General Chair */}
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] p-5 space-y-1">
                <div className="text-[10px] font-black uppercase tracking-wider text-[var(--gold)]">
                  General Conference Chair
                </div>
                <div className="text-sm font-black text-[var(--text-primary)]">
                  {chairSettings.general_chair_name}
                </div>
                <div className="text-xs font-semibold text-[var(--text-secondary)]">
                  {chairSettings.general_chair_title}
                </div>
                <div className="text-[11px] text-[var(--text-tertiary)]">
                  {chairSettings.general_chair_affiliation}
                </div>
              </div>

              {/* TPC Chair */}
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] p-5 space-y-1">
                <div className="text-[10px] font-black uppercase tracking-wider text-[var(--gold)]">
                  Technical Programme Committee Chair
                </div>
                <div className="text-sm font-black text-[var(--text-primary)]">
                  {chairSettings.tpc_chair_name}
                </div>
                <div className="text-xs font-semibold text-[var(--text-secondary)]">
                  {chairSettings.tpc_chair_title}
                </div>
                <div className="text-[11px] text-[var(--text-tertiary)]">
                  {chairSettings.tpc_chair_affiliation}
                </div>
              </div>
            </div>

            {/* Official Seal / Notice Badge */}
            <div className="mt-4 flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-3 text-xs text-[var(--text-secondary)]">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[var(--gold)]" />
                <span className="font-bold text-[var(--text-primary)]">
                  {chairSettings.seal_title || "OFFICIAL ACCEPTANCE SEAL"}
                </span>
                <span className="text-[var(--text-tertiary)]">• {chairSettings.seal_subtext || "SCHOLARVAULT"}</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600">
                Verified Integrity ✓
              </span>
            </div>
          </div>

          {/* Official Verification Notice */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-base)]/50 p-5 text-center text-xs text-[var(--text-secondary)] space-y-1">
            <p className="font-bold text-[var(--text-primary)]">
              This digital record confirms the authenticity of the official acceptance letter issued for this submission.
            </p>
            <p className="text-[11px] text-[var(--text-tertiary)]">
              Academic institutions, visa officers, granting agencies, and conference secretariats can rely on this record as authoritative confirmation of acceptance in the ScholarVault Conference Network.
            </p>
          </div>

          {/* Author Action Gateway */}
          <div className="rounded-3xl border-2 border-[var(--gold)]/40 bg-gradient-to-br from-[var(--surface-base)] to-[var(--surface-subtle)] p-6 md:p-8 shadow-lg">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[var(--gold)]">
                <Lock size={14} /> Private Author Desk Gateway
              </div>
              <h3 className="text-lg font-black text-[var(--text-primary)]">
                Are you the author? Access Private Author Desk
              </h3>
              <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                Access your private author portal to view detailed reviewer remarks, download high-resolution acceptance PDFs, request formal visa letters, and complete presenter registration.
              </p>

              {magicLinkSent ? (
                <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-700 space-y-1">
                  <div className="flex items-center gap-2 font-black">
                    <CheckCircle2 size={16} /> Link Dispatched
                  </div>
                  <p>{magicLinkMessage}</p>
                </div>
              ) : (
                <form
                  onSubmit={handleRequestMagicLink}
                  className="mt-4 flex flex-col sm:flex-row gap-2 max-w-lg"
                >
                  <input
                    type="email"
                    required
                    placeholder="Enter author email address…"
                    value={authorEmailInput}
                    onChange={(e) => setAuthorEmailInput(e.target.value)}
                    className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-2.5 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                  />
                  <button
                    type="submit"
                    disabled={magicLinkLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--text-primary)] px-5 py-2.5 text-xs font-black text-[var(--bg-primary)] hover:opacity-90 transition disabled:opacity-50 shrink-0"
                  >
                    {magicLinkLoading ? "Sending…" : "Send Secure Link"} <Send size={13} />
                  </button>
                </form>
              )}

              {magicLinkError && (
                <p className="text-xs font-semibold text-red-500 mt-2">{magicLinkError}</p>
              )}

              <div className="pt-3 flex flex-wrap items-center gap-4 text-xs text-[var(--text-secondary)]">
                <span>Have a ScholarVault account?</span>
                <Link
                  href={`/login?next=${encodeURIComponent(`/conference/${conferenceSlug}/submission/${data.submission_number}`)}`}
                  className="inline-flex items-center gap-1 font-bold text-[var(--gold)] hover:underline"
                >
                  Sign in with Google / Email <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center text-[11px] text-[var(--text-tertiary)] pt-2 pb-6">
            ScholarVault Academic Registry • Powered by DeepMind & AI Research Verification Engine
          </div>
        </div>
      </main>
    );
  }

  // FULL AUTHOR SUBMISSION TRACKER (Visitor has active author session)
  const correspondingAuthor =
    data.authors?.find((a: any) => a.is_corresponding) || data.authors?.[0];
  const authorEmail = correspondingAuthor?.email || "";
  const isVerified = data.email_verification_status === "verified";
  const loginUrl = `/login?email=${encodeURIComponent(authorEmail)}&next=${encodeURIComponent("/dashboard/submissions")}&reference=${encodeURIComponent(data.submission_number)}`;

  // Stepper determination
  const isAccepted = data.decision_status === "accepted";
  const isRejected = data.decision_status === "rejected";
  const isRevision =
    data.decision_status === "revision_requested" ||
    data.screening_status === "revision_requested";
  const isRegistered = Boolean(
    data.registration &&
      (data.registration.registration_status === "confirmed" ||
        data.registration.payment_status === "paid" ||
        data.registration.payment_status === "waived")
  );

  const waiver = data.custom_answers?.waiver;
  const isFullWaiver =
    waiver?.status === "full_waiver" || Number(waiver?.concession_percent || 0) === 100;
  const isConcession50 =
    waiver?.status === "concession_50" || Number(waiver?.concession_percent || 0) === 50;

  // Modality awareness determination
  const editionDeliveryMode = data.edition?.delivery_mode || "hybrid";
  const authorModality =
    data.registration?.participation_mode ||
    data.presentation_modality ||
    data.custom_answers?.presentation_modality ||
    data.custom_answers?.participation_mode ||
    data.custom_answers?.presentation_mode ||
    (editionDeliveryMode === "virtual" ? "virtual" : editionDeliveryMode === "physical" ? "in_person" : "hybrid");
  const isVirtualPresentation = String(authorModality).toLowerCase().includes("virtual") || editionDeliveryMode === "virtual";

  const steps = [
    {
      label: "Submission Received",
      status: "completed",
      statusText: "Completed ✓",
    },
    {
      label: "Editorial Screening",
      status:
        isAccepted || data.screening_status === "passed"
          ? "completed"
          : data.screening_status === "revision_requested"
            ? "action_required"
            : data.screening_status === "in_progress"
              ? "current"
              : "upcoming",
      statusText:
        isAccepted || data.screening_status === "passed"
          ? "Completed ✓"
          : data.screening_status === "revision_requested"
            ? "Revision Requested ✍️"
            : data.screening_status === "in_progress"
              ? "In Progress ⏳"
              : "Upcoming",
    },
    {
      label: "Peer Review",
      status:
        isAccepted || data.review_status === "completed"
          ? "completed"
          : isRevision
            ? "action_required"
            : data.review_status === "in_progress" || data.review_status === "assigned"
              ? "current"
              : "upcoming",
      statusText:
        isAccepted || data.review_status === "completed"
          ? "Completed ✓"
          : isRevision
            ? "Revision Required ✍️"
            : data.review_status === "in_progress" || data.review_status === "assigned"
              ? "In Progress ⏳"
              : "Upcoming",
    },
    {
      label: "Official Acceptance",
      status: isAccepted
        ? "completed"
        : isRejected
          ? "rejected"
          : isRevision
            ? "action_required"
            : "upcoming",
      statusText: isAccepted
        ? "Completed ✓"
        : isRejected
          ? "Declined"
          : isRevision
            ? "Revision Requested ✍️"
            : "Upcoming",
    },
    {
      label: "Presenter Registration",
      status: isRegistered
        ? "completed"
        : isFullWaiver
          ? "action_required"
          : isAccepted
            ? "action_required"
            : "upcoming",
      statusText: isRegistered
        ? isFullWaiver
          ? "Completed (100% Waived) ✓"
          : "Completed ✓"
        : isFullWaiver
          ? "100% Fee Waiver Approved 🎓"
          : isConcession50
            ? "50% Concession Approved 🎓"
            : isAccepted
              ? "Action Required 💳"
              : "Pending",
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-5 py-8 md:px-8 md:py-12">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        {/* Navigation / Header Branding */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--border)] pb-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-base)] px-3 py-1 text-[11px] font-black uppercase tracking-widest text-[var(--gold)]">
              ScholarVault Conferences
            </div>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              Official Submission Status Tracker
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ${
                isVerified
                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
              }`}
            >
              <CheckCircle2 size={13} />
              {isVerified ? "Email Confirmed" : "Email Confirmation Pending"}
            </span>
          </div>
        </div>

        {/* Conference Concluded Archive Banner */}
        {data.edition?.isConcluded && (
          <div className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-5 md:p-6 text-amber-800 dark:text-amber-200">
            <div className="flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider">Conference Concluded · Academic Archive</h3>
                <p className="mt-1 text-xs leading-relaxed opacity-90">
                  This conference concluded on {new Date(data.edition.ends_at).toLocaleDateString()}. This submission record is permanently preserved in the ScholarVault Academic Archive for verification and citation purposes.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Paper Overview Card */}
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-base)] p-6 md:p-8 shadow-sm">
          <div className="text-[11px] font-black uppercase tracking-widest text-[var(--gold)]">
            Reference ID: {data.submission_number}
          </div>
          <h1 className="mt-2 text-2xl md:text-3xl font-black text-[var(--text-primary)] leading-tight">
            {data.title}
          </h1>

          <div className="mt-4 flex flex-wrap gap-4 text-xs text-[var(--text-secondary)]">
            {correspondingAuthor && (
              <span className="inline-flex items-center gap-1.5">
                <User size={14} className="text-[var(--text-tertiary)]" />
                {correspondingAuthor.name}{" "}
                {correspondingAuthor.institution ? `(${correspondingAuthor.institution})` : ""}
              </span>
            )}
            {data.submitted_at && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={14} className="text-[var(--text-tertiary)]" />
                Submitted: {new Date(data.submitted_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Official Acceptance Letter Download Banner */}
        {data.decision_status === "accepted" && (
          <div className="rounded-3xl border-2 border-[var(--gold)]/50 bg-gradient-to-br from-[var(--gold-pale)] to-[var(--surface-base)] p-6 md:p-8 shadow-xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--gold)]/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-[var(--gold-dark)]">
                  <Award size={15} /> Official Manuscript Acceptance
                </div>
                <h2 className="text-xl font-black text-[var(--text-primary)]">
                  Congratulations! Your manuscript has been formally accepted.
                </h2>
                <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                  {isVirtualPresentation
                    ? "The Technical Programme Committee and General Chair have approved your paper for virtual presentation. You can download your official, signed acceptance certificate with virtual session credentials and persistent Crossref DOI below."
                    : "The Technical Programme Committee and General Chair have approved your paper for presentation. Download your official consular visa invitation letter for embassy submission or the complete 2-page technical presentation dossier below."}
                </p>
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
                {isVirtualPresentation ? (
                  <button
                    type="button"
                    onClick={() => handleDownloadAcceptance("single_page_compact")}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--text-primary)] px-5 text-xs font-black text-[var(--bg-primary)] shadow-md hover:brightness-110 transition"
                  >
                    <Download size={15} className="text-[var(--gold)]" />
                    Download Official Acceptance Certificate (1-Page PDF)
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleDownloadAcceptance("single_page_compact")}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--surface-base)] border-2 border-[var(--gold)]/60 px-4 text-xs font-black text-[var(--text-primary)] shadow-md hover:bg-[var(--gold)]/10 transition"
                      title="Sovereign visa invitation letter with international consular clauses (US 9 FAM / UK / Schengen / India MHA)"
                    >
                      <Download size={15} className="text-[var(--gold)] shrink-0" />
                      Download Official Visa Invitation Letter (1-Page PDF)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadAcceptance("two_page_dossier")}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--text-primary)] px-5 text-xs font-black text-[var(--bg-primary)] shadow-md hover:brightness-110 transition"
                      title="Complete 2-page dossier with consular invitation and Technical Annexure"
                    >
                      <FileText size={15} className="text-[var(--gold)] shrink-0" />
                      Download Complete Presentation Dossier & Annexure (2-Page PDF)
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Presenter Registration & Travel Grant / Waiver Status Section */}
        {data.decision_status === "accepted" && (
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-base)] p-6 md:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                <Award size={16} className="text-[var(--gold)]" /> Presenter Registration & Grant Status
              </h2>
              {isRegistered && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-600 border border-emerald-500/20">
                  <CheckCircle2 size={13} /> Registration Confirmed
                </span>
              )}
            </div>

            {isFullWaiver ? (
              <div className="rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 p-5 md:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-emerald-600">
                      🎓 100% Registration Fee Waiver Approved
                    </div>
                    <h3 className="text-base font-black text-[var(--text-primary)]">
                      Congratulations! Your registration fee has been fully waived (₹0 Due)
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      The Organizing Committee has awarded your submission a 100% Travel Grant / Registration Waiver
                      {waiver?.concession_code ? ` (Grant Code: ${waiver.concession_code})` : ""}.
                      {isRegistered
                        ? " Your registration has been confirmed with ₹0 fee."
                        : " Please confirm your presenter registration below to secure your oral/poster presentation slot."}
                    </p>
                  </div>

                  {!isRegistered && (
                    <div className="shrink-0">
                      <button
                        type="button"
                        onClick={handleClaimWaiver}
                        disabled={claimingWaiver}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-xs font-black text-white shadow-md hover:bg-emerald-700 transition disabled:opacity-50"
                      >
                        {claimingWaiver ? "Confirming…" : "Confirm Waived Registration (₹0) →"}
                      </button>
                    </div>
                  )}
                </div>

                {waiverClaimSuccess && (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 size={14} /> {waiverClaimSuccess}
                  </div>
                )}
                {waiverClaimError && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-600 dark:text-red-400">
                    {waiverClaimError}
                  </div>
                )}
              </div>
            ) : isConcession50 ? (
              <div className="rounded-2xl border-2 border-amber-500/30 bg-amber-500/5 p-5 md:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      🎓 50% Travel Grant / Fee Concession Approved
                    </div>
                    <h3 className="text-base font-black text-[var(--text-primary)]">
                      50% Registration Fee Concession Granted
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      The Organizing Committee has awarded your submission a 50% fee concession
                      {waiver?.concession_code ? ` (Concession Code: ${waiver.concession_code})` : ""}.
                      {isRegistered
                        ? " Your registration is confirmed."
                        : " Complete your presenter registration with your 50% concession code."}
                    </p>
                  </div>

                  {!isRegistered && (
                    <div className="shrink-0">
                      <Link
                        href={`/conference/${conferenceSlug}/register?code=${encodeURIComponent(waiver?.concession_code || "")}&ref=${encodeURIComponent(data.submission_number)}`}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--gold)] px-5 text-xs font-black text-[var(--bg-primary)] shadow-md hover:brightness-110 transition"
                      >
                        Register with 50% Concession <ArrowRight size={14} />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ) : !isRegistered ? (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] p-5 md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-base font-black text-[var(--text-primary)]">
                    Presenter Registration Action Required
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    At least one author must register to present this accepted paper at the summit and be included in the official proceedings.
                  </p>
                </div>
                <div className="shrink-0">
                  <Link
                    href={`/conference/${conferenceSlug}/register?ref=${encodeURIComponent(data.submission_number)}`}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--text-primary)] px-5 text-xs font-black text-[var(--bg-primary)] shadow-md hover:opacity-90 transition"
                  >
                    Complete Registration <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* The Dashboard Bridge Card (Direct 1-Click Sign-In) */}
        <div className="rounded-3xl border border-[var(--gold)]/30 bg-gradient-to-br from-[var(--surface-base)] to-[var(--surface-subtle)] p-6 md:p-8 shadow-lg relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[var(--gold)]">
                <Sparkles size={15} /> Continuous Dashboard Access
              </div>
              <h2 className="text-lg font-black text-[var(--text-primary)]">
                Access your submission anytime in ScholarVault Dashboard
              </h2>
              <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                Want to check your review comments, view acceptance letters, and complete registration without hunting for emails? Sign in with your submitted email (<strong>{authorEmail}</strong>) using Google or Email to link this paper directly to your account.
              </p>
            </div>

            <div className="shrink-0">
              <Link
                href={loginUrl}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--text-primary)] px-5 text-xs font-black text-[var(--bg-primary)] shadow-md hover:opacity-90 transition"
              >
                Sign in with Google / Email <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        {/* Visual Progress Stepper */}
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-base)] p-6 md:p-8 shadow-sm">
          <h2 className="text-sm font-black uppercase tracking-wider text-[var(--text-primary)] mb-6">
            Review Lifecycle Progress
          </h2>

          <div className="grid gap-4 sm:grid-cols-5">
            {steps.map((step, idx) => (
              <div key={step.label} className="relative flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-black ${
                      step.status === "completed"
                        ? "bg-emerald-500 text-white"
                        : step.status === "action_required"
                          ? "bg-amber-500 text-white ring-4 ring-amber-500/20"
                          : step.status === "rejected"
                            ? "bg-red-500 text-white"
                            : step.status === "current"
                              ? "bg-[var(--gold)] text-[var(--bg-primary)] animate-pulse"
                              : "bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-tertiary)]"
                    }`}
                  >
                    {step.status === "completed" ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <div className="hidden sm:block flex-1 h-0.5 bg-[var(--border)]" />
                </div>
                <div>
                  <div className="text-xs font-black text-[var(--text-primary)]">
                    {step.label}
                  </div>
                  <div
                    className={`text-[10px] capitalize font-medium ${
                      step.status === "completed"
                        ? "text-emerald-600"
                        : step.status === "action_required"
                          ? "text-amber-600 font-bold"
                          : step.status === "rejected"
                            ? "text-red-600 font-bold"
                            : "text-[var(--text-secondary)]"
                    }`}
                  >
                    {(step as any).statusText ||
                      (step.status === "completed"
                        ? "Completed ✓"
                        : step.status === "action_required"
                          ? "Action Required 💳"
                          : step.status === "current"
                            ? "In Progress ⏳"
                            : "Upcoming")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Timeline */}
        {data.events?.length > 0 && (
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-base)] p-6 md:p-8 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-wider text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Clock size={16} className="text-[var(--gold)]" /> Activity Log
            </h2>
            <div className="space-y-3">
              {data.events.map((event: any, i: number) => (
                <div
                  key={`${event.event_type}-${i}`}
                  className="flex items-center justify-between border-b border-[var(--border)]/50 pb-2 text-xs last:border-none"
                >
                  <span className="font-bold text-[var(--text-primary)] capitalize">
                    {event.event_type.replaceAll("_", " ")}
                  </span>
                  <span className="text-[var(--text-tertiary)]">
                    {new Date(event.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Help & Support Footer */}
        <div className="text-center text-xs text-[var(--text-tertiary)] pt-4">
          Need assistance with your abstract? Contact the conference secretariat or chat with ScholarVault Support.
        </div>
      </div>
    </main>
  );
}
