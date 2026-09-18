"use client";

import { ChangeEvent, useCallback, useEffect, useState } from "react";
import {
  Award,
  Check,
  Download,
  Eye,
  FileText,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  Save,
  Sparkles,
  Trash2,
  UploadCloud,
  FileCheck2,
  ShieldCheck,
  Calendar,
  Layers,
  Video,
} from "lucide-react";
import {
  AcceptanceLetterSettings,
  AcceptanceLetterFormat,
  DEFAULT_LETTER_SETTINGS,
  buildAcceptanceLetterData,
  downloadAcceptanceLetterPdf,
} from "./acceptanceLetterEngine";

export default function OrganizerAcceptanceLetterSettings({
  slug,
  edition,
}: {
  slug: string;
  edition: any;
}) {
  const [settings, setSettings] = useState<AcceptanceLetterSettings>(DEFAULT_LETTER_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [activePreviewPage, setActivePreviewPage] = useState<1 | 2 | 3>(1);

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/conferences/organizer/${encodeURIComponent(slug)}/acceptance-letter`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (res.ok && data.settings) {
        setSettings({ ...DEFAULT_LETTER_SETTINGS, ...data.settings });
      }
    } catch {
      setError("Failed to load letterhead configuration");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const handleChange = (key: keyof AcceptanceLetterSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleFileUpload = (
    key: "general_chair_signature" | "tpc_chair_signature" | "seal_image" | "conference_logo",
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be smaller than 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const dataUrl = loadEvt.target?.result as string;
      if (dataUrl) {
        setSettings((prev) => ({ ...prev, [key]: dataUrl }));
        setSaved(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInsertTag = (tag: string) => {
    setSettings((prev) => ({
      ...prev,
      body_template: (prev.body_template || "") + " " + tag,
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      const res = await fetch(`/api/conferences/organizer/${encodeURIComponent(slug)}/acceptance-letter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save configuration");
    } finally {
      setSaving(false);
    }
  };

  const handleSampleDownload = (formatOverride?: AcceptanceLetterFormat) => {
    const sampleSubmission = {
      submission_number: `${edition?.short_name || "SVRIAS"}-ABS-2026-001`,
      title: "Integrity in Machine Intelligence: Quantitative Verification of Safety Constraints in Medical LLMs",
      track: { name: "AI Ethics, Governance & Safety Auditing" },
      authors: [
        {
          name: "Dr. Alicia Vance",
          institution: "Oxford University, Department of Computer Science",
          country: "United Kingdom",
          is_corresponding: true,
        },
        {
          name: "Prof. Kenneth O. Mensah",
          institution: "University of Ghana",
          country: "Ghana",
        },
      ],
    };

    downloadAcceptanceLetterPdf(
      sampleSubmission,
      edition,
      settings,
      "Sample_Acceptance_Letter.pdf",
      undefined,
      formatOverride || settings.default_format
    );
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-base)] p-8 text-center text-xs text-[var(--text-secondary)]">
        <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin text-[var(--gold)]" />
        Loading acceptance letterhead settings…
      </div>
    );
  }

  const samplePreviewData = buildAcceptanceLetterData(
    {
      submission_number: `${edition?.short_name || "SVRIAS"}-ABS-001`,
      title: "Sample Research Paper Title: Rigorous Methodological Verification in Academic Publishing",
      track: { name: "Responsible AI & Scientific Integrity" },
      authors: [
        {
          name: "Sample Corresponding Author, Ph.D.",
          institution: "Institute of Scholarly Research",
          country: "India",
          is_corresponding: true,
        },
      ],
    },
    edition,
    settings
  );

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-base)] p-6 md:p-8 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--border)] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[var(--gold-pale)] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-[var(--gold-dark)]">
              Modality-Aware Engine
            </span>
            <span className="text-[10px] font-bold text-[var(--text-secondary)]">
              High-Res A4 Print-Ready PDF
            </span>
          </div>
          <h2 className="mt-2 text-xl font-black text-[var(--text-primary)]">
            Official Acceptance Letterhead & Consular Dossier Engine
          </h2>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Configure multi-page acceptance dossiers, consular visa declarations (US 9 FAM / UK / Schengen / India MHA), presenter readiness (16:9 & Zoom), and chair endorsements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] px-3.5 text-xs font-bold text-[var(--text-primary)] transition hover:border-[var(--gold)]"
          >
            <Eye size={14} /> {showPreview ? "Hide Preview" : "Live A4 Preview"}
          </button>
          <button
            type="button"
            onClick={() => handleSampleDownload()}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] px-3.5 text-xs font-bold text-[var(--text-primary)] transition hover:border-[var(--gold)]"
            title="Download test PDF with sample data"
          >
            <Download size={14} /> Sample PDF
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--text-primary)] px-5 text-xs font-bold text-[var(--bg-primary)] shadow-sm transition hover:opacity-90 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Saving…
              </>
            ) : saved ? (
              <>
                <Check size={14} className="text-emerald-400" /> Saved ✓
              </>
            ) : (
              <>
                <Save size={14} /> Save Letterhead
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-xl bg-red-500/10 p-3 text-xs font-semibold text-red-600">
          {error}
        </div>
      )}

      {/* Live Preview Panel */}
      {showPreview && (
        <div className="mt-6 rounded-2xl border-2 border-[var(--gold)]/40 bg-[var(--bg-primary)] p-6 shadow-inner">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[var(--gold)]">
                Live Interactive A4 Preview
              </span>
              <span className="text-[10px] text-[var(--text-secondary)]">
                • Rendered with active configuration
              </span>
            </div>

            {/* Page Switcher Tabs */}
            <div className="inline-flex flex-wrap rounded-xl border border-[var(--border)] bg-[var(--surface-base)] p-1 gap-1">
              <button
                type="button"
                onClick={() => setActivePreviewPage(1)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                  activePreviewPage === 1
                    ? "bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-xs"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                Page 1: Acceptance & Consular Visa
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewPage(2)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                  activePreviewPage === 2
                    ? "bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-xs"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                Page 2: Technical Annexure
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewPage(3)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                  activePreviewPage === 3
                    ? "bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-xs"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                Virtual Credential (Mode A)
              </button>
            </div>
          </div>

          {/* Letterhead Preview Box */}
          <div className="mx-auto max-w-2xl rounded-xl border border-[var(--border)] bg-white p-7 text-slate-900 shadow-md font-sans">
            {activePreviewPage === 1 ? (
              /* PAGE 1 PREVIEW */
              <div>
                {/* Header */}
                <div className="border-b-2 border-amber-600 pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      {settings.conference_logo ? (
                        <img
                          src={settings.conference_logo}
                          alt="Conference Logo"
                          className="h-12 w-12 shrink-0 rounded-lg object-contain border border-amber-200 bg-white p-0.5 shadow-sm"
                        />
                      ) : (
                        <div className="h-12 w-10 shrink-0 rounded-lg bg-slate-900 border border-amber-500 flex flex-col items-center justify-center text-amber-400 font-bold text-xs shadow-sm">
                          SV
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="text-[9px] font-black uppercase tracking-widest text-amber-700">
                          SCHOLARVAULT CONFERENCES · OFFICIAL SCIENTIFIC PROCEEDINGS
                        </div>
                        <h3 className="text-sm sm:text-base font-black text-slate-900 mt-1 leading-tight break-words">
                          {edition.name}
                        </h3>
                        <p className="text-[11px] text-slate-600 mt-0.5 break-words">
                          {samplePreviewData.conferenceDates} | {settings.venue_details}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right text-[10px] text-slate-500 bg-slate-50 border border-slate-200 rounded-lg p-2.5 shadow-xs">
                      <div className="text-[8px] uppercase tracking-wider font-bold text-amber-700">Reference ID</div>
                      <div className="font-mono font-bold text-slate-800 text-xs">{samplePreviewData.referenceId}</div>
                      <div className="text-[9px] text-slate-400 mt-0.5">PAGE 1 OF 2 · ISSUED: {samplePreviewData.dateOfIssue}</div>
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div className="my-4 rounded-lg bg-amber-50 p-2.5 text-center text-xs font-bold text-amber-950 border border-amber-200">
                  OFFICIAL LETTER OF ACCEPTANCE & CONSULAR VISA INVITATION
                  <div className="text-[10px] font-normal text-amber-800 mt-0.5">
                    THEMATIC TRACK: {samplePreviewData.trackName.toUpperCase()}
                  </div>
                </div>

                {/* Addressee */}
                <div className="text-xs text-slate-800 mb-3">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">To:</div>
                  <div className="font-bold text-slate-900">{samplePreviewData.authorName}</div>
                  <div className="text-slate-600">{samplePreviewData.authorInstitution}</div>
                </div>

                {/* Title */}
                <div className="rounded border-l-4 border-slate-800 bg-slate-50 p-2.5 text-xs text-slate-900 italic font-serif my-3">
                  "{samplePreviewData.paperTitle}"
                </div>

                {/* Body */}
                <div className="text-xs text-slate-700 space-y-2 leading-relaxed font-serif">
                  {samplePreviewData.bodyParagraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>

                {/* Consular Declarations Box */}
                <div className="mt-4 rounded-lg border-l-4 border-amber-600 bg-amber-50/50 p-3 border border-amber-200 text-[10px] text-slate-800 space-y-1.5">
                  <div className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">
                    OFFICIAL CONSULAR &amp; IMMIGRATION VISA DECLARATION
                  </div>
                  <div className="text-[9px] font-bold text-amber-800">
                    US 9 FAM 402.2-5(B) · UK VISITOR (ACADEMIC) · SCHENGEN CODE (EC) 810/2009 · INDIA MHA
                  </div>
                  <p className="text-slate-700 leading-normal">
                    <strong>1. Oral Presentation Scope &amp; Venue:</strong> Primary and listed co-authors are formally scheduled for oral presentation in {samplePreviewData.trackName} at {settings.venue_details} during {samplePreviewData.conferenceDates}.
                  </p>
                  <p className="text-slate-700 leading-normal">
                    <strong>2. Non-Employment &amp; Non-Remuneration:</strong> {settings.non_remuneration_text || DEFAULT_LETTER_SETTINGS.non_remuneration_text}
                  </p>
                  <p className="text-slate-700 leading-normal">
                    <strong>3. Financial Responsibility:</strong> {settings.financial_clause_text || DEFAULT_LETTER_SETTINGS.financial_clause_text}
                  </p>
                </div>

                {/* Directives */}
                {settings.custom_notes && (
                  <div className="mt-3 rounded bg-amber-50/70 border border-amber-300 p-2 text-[10px] text-amber-900">
                    <strong>NOTE:</strong> {settings.custom_notes}
                  </div>
                )}

                {/* Signatures & Seal */}
                <div className="mt-6 pt-4 border-t border-slate-200 grid grid-cols-3 items-end text-center text-[10px]">
                  <div>
                    <div className="h-9 flex items-center justify-center">
                      {settings.general_chair_signature ? (
                        <img
                          src={settings.general_chair_signature}
                          alt="Signature"
                          className="max-h-8 max-w-[120px] object-contain mx-auto"
                        />
                      ) : (
                        <div className="text-blue-900 font-serif italic text-base">
                          {settings.general_chair_signature_style === "executive"
                            ? `// ${settings.general_chair_name} //`
                            : settings.general_chair_signature_style === "calligraphy"
                            ? `~ ✒️ ${settings.general_chair_name} ~`
                            : `~ ${settings.general_chair_name} ~`}
                        </div>
                      )}
                    </div>
                    <div className="font-bold text-slate-900 mt-1">{settings.general_chair_name}</div>
                    <div className="text-[9px] text-amber-700 font-semibold">{settings.general_chair_title}</div>
                  </div>

                  <div className="flex flex-col items-center">
                    {settings.seal_image ? (
                      <img
                        src={settings.seal_image}
                        alt="Seal"
                        className="h-14 w-14 rounded-full object-contain mx-auto"
                      />
                    ) : (
                      <div className={`h-14 w-14 rounded-full border-2 flex flex-col items-center justify-center text-[7px] font-black shadow-inner ${
                        settings.seal_style === "modern_verified"
                          ? "border-slate-800 bg-slate-100 text-slate-900"
                          : settings.seal_style === "academic_crest"
                          ? "border-amber-700 bg-amber-50 text-amber-900"
                          : "border-amber-600 bg-amber-50 text-amber-800"
                      }`}>
                        <span>★ VERIFIED ★</span>
                        <span className="text-[8px] font-black">ACCEPTED</span>
                        <span className="text-[6px] text-amber-600">SEAL</span>
                      </div>
                    )}
                    <div className="text-[8px] text-slate-500 uppercase font-bold mt-1">
                      {settings.seal_title}
                    </div>
                  </div>

                  <div>
                    <div className="h-9 flex items-center justify-center">
                      {settings.tpc_chair_signature ? (
                        <img
                          src={settings.tpc_chair_signature}
                          alt="Signature"
                          className="max-h-8 max-w-[120px] object-contain mx-auto"
                        />
                      ) : (
                        <div className="text-blue-900 font-serif italic text-base">
                          {settings.tpc_chair_signature_style === "executive"
                            ? `// ${settings.tpc_chair_name} //`
                            : settings.tpc_chair_signature_style === "calligraphy"
                            ? `~ ✒️ ${settings.tpc_chair_name} ~`
                            : `~ ${settings.tpc_chair_name} ~`}
                        </div>
                      )}
                    </div>
                    <div className="font-bold text-slate-900 mt-1">{settings.tpc_chair_name}</div>
                    <div className="text-[9px] text-amber-700 font-semibold">{settings.tpc_chair_title}</div>
                  </div>
                </div>

                {/* Verifiable QR Footer */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[9px] text-slate-500">
                  <span className="font-semibold text-slate-600">Officially Verifiable via ScholarVault Registry QR</span>
                  <span className="font-mono text-amber-800 text-[9px] break-all sm:text-right max-w-sm">
                    {samplePreviewData.verificationUrl}
                  </span>
                </div>
              </div>
            ) : activePreviewPage === 2 ? (
              /* PAGE 2 PREVIEW: TECHNICAL ANNEXURE */
              <div>
                {/* Header */}
                <div className="border-b-2 border-amber-600 pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="text-[9px] font-black uppercase tracking-widest text-amber-700">
                        SCHOLARVAULT CONFERENCES · TECHNICAL ANNEXURE &amp; COMPLIANCE DOSSIER
                      </div>
                      <h3 className="text-sm sm:text-base font-black text-slate-900 mt-1">
                        {edition.name}
                      </h3>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Technical Guidelines &amp; Author Compliance Specification
                      </p>
                    </div>
                    <div className="shrink-0 text-right text-[10px] text-slate-500 bg-slate-50 border border-slate-200 rounded-lg p-2.5 shadow-xs">
                      <div className="text-[8px] uppercase tracking-wider font-bold text-amber-700">Annexure Ref</div>
                      <div className="font-mono font-bold text-slate-800 text-xs">{samplePreviewData.referenceId}</div>
                      <div className="text-[9px] text-slate-400 mt-0.5">PAGE 2 OF 2 · ISSUED: {samplePreviewData.dateOfIssue}</div>
                    </div>
                  </div>
                </div>

                {/* Annexure Banner */}
                <div className="my-3 rounded-lg bg-slate-100 p-2.5 text-center text-xs font-bold text-slate-900 border border-slate-200">
                  TECHNICAL ANNEXURE: PRESENTER READINESS &amp; PROCEEDINGS COMPLIANCE
                  <div className="text-[10px] font-normal text-amber-800 mt-0.5">
                    MANUSCRIPT REF: {samplePreviewData.referenceId} | TRACK: {samplePreviewData.trackName.toUpperCase()}
                  </div>
                </div>

                {/* Section 1: Presenter Technical Readiness */}
                <div className="rounded-lg border-l-4 border-amber-500 bg-amber-50/50 p-3 border border-amber-200 text-[10px] space-y-1 my-3">
                  <div className="font-bold text-slate-900 uppercase text-[10px]">
                    1. PRESENTER TECHNICAL READINESS &amp; PRESENTATION STANDARDS
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 text-slate-700">
                    <div>
                      <strong className="text-slate-900">• Slide Deck (16:9 Mandatory):</strong>
                      <p>Widescreen 16:9 format (PowerPoint / PDF). Legacy 4:3 is deprecated.</p>
                    </div>
                    <div>
                      <strong className="text-slate-900">• Interactive Zoom Setup:</strong>
                      <p>{settings.annexure_virtual_platform || DEFAULT_LETTER_SETTINGS.annexure_virtual_platform}</p>
                    </div>
                    <div>
                      <strong className="text-slate-900">• Oral Presentation Window:</strong>
                      <p>{settings.annexure_oral_duration || DEFAULT_LETTER_SETTINGS.annexure_oral_duration}</p>
                    </div>
                    <div>
                      <strong className="text-slate-900">• Pre-Flight AV Check-In:</strong>
                      <p>Report to hall / Zoom room 15 minutes prior to session start.</p>
                    </div>
                  </div>
                </div>

                {/* Section 2: ScholarVault Standard Proceedings */}
                <div className="rounded-lg border-l-4 border-slate-800 bg-slate-50 p-3 border border-slate-200 text-[10px] space-y-1 my-3">
                  <div className="font-bold text-slate-900 uppercase text-[10px]">
                    2. SCHOLARVAULT PROCEEDINGS &amp; PUBLICATION-READY MANUSCRIPT GUIDELINES
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 text-slate-700">
                    <div>
                      <strong className="text-slate-900">• Proceedings Formatting:</strong>
                      <p>{settings.annexure_proceedings_format || DEFAULT_LETTER_SETTINGS.annexure_proceedings_format}</p>
                    </div>
                    <div>
                      <strong className="text-slate-900">• Crossref DOI Archiving:</strong>
                      <p>Reserved DOI: {samplePreviewData.doiString} in ScholarVault Digital Library.</p>
                    </div>
                  </div>
                </div>

                {/* Section 3: Milestone Timeline Table */}
                <div className="my-3">
                  <div className="text-[10px] font-bold text-slate-900 uppercase mb-1.5">
                    3. CRITICAL MILESTONES &amp; COMPLIANCE TIMELINE
                  </div>
                  <div className="rounded border border-slate-200 overflow-hidden text-[9px]">
                    <div className="grid grid-cols-3 bg-slate-900 text-white font-bold p-1.5">
                      <div>MILESTONE</div>
                      <div>DEADLINE</div>
                      <div>ACTION REQUIRED</div>
                    </div>
                    <div className="grid grid-cols-3 p-1.5 border-b border-slate-100 bg-white">
                      <div className="font-semibold text-slate-800">Final Camera-Ready Manuscript</div>
                      <div className="text-amber-700 font-bold">14 Days Post-Acceptance</div>
                      <div className="text-slate-600">Upload in ScholarVault Standard Proceedings Format</div>
                    </div>
                    <div className="grid grid-cols-3 p-1.5 border-b border-slate-100 bg-slate-50">
                      <div className="font-semibold text-slate-800">Presenter Registration Verification</div>
                      <div className="text-amber-700 font-bold">Registration Due Date</div>
                      <div className="text-slate-600">At least one author must complete registration</div>
                    </div>
                    <div className="grid grid-cols-3 p-1.5 border-b border-slate-100 bg-white">
                      <div className="font-semibold text-slate-800">Presentation Slide Deck (16:9)</div>
                      <div className="text-amber-700 font-bold">48 Hours Prior</div>
                      <div className="text-slate-600">Submit 16:9 slides &amp; conduct Zoom audio/video check</div>
                    </div>
                    <div className="grid grid-cols-3 p-1.5 bg-slate-50">
                      <div className="font-semibold text-slate-800">Summit Delivery &amp; DOI Archiving</div>
                      <div className="text-amber-700 font-bold">{samplePreviewData.conferenceDates}</div>
                      <div className="text-slate-600">Oral presentation followed by persistent Crossref deposit</div>
                    </div>
                  </div>
                </div>

                {/* Section 4: COPE Governance */}
                <div className="rounded-lg border-l-4 border-amber-600 bg-amber-50/50 p-2.5 border border-amber-200 text-[10px] text-slate-700 my-3">
                  <div className="font-bold text-slate-900 uppercase text-[10px] mb-1">
                    4. PUBLICATION ETHICS &amp; RESEARCH INTEGRITY (COPE)
                  </div>
                  <p>{settings.annexure_cope_statement || DEFAULT_LETTER_SETTINGS.annexure_cope_statement}</p>
                </div>

                {/* Footer */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[9px] text-slate-500">
                  <span className="font-semibold text-slate-600">Page 2 of 2 — Technical Annexure | ScholarVault Conference Engine</span>
                  <span className="font-mono text-amber-800 text-[9px] break-all sm:text-right max-w-sm">
                    {samplePreviewData.verificationUrl}
                  </span>
                </div>
              </div>
            ) : (
              /* PAGE 3 PREVIEW: MODE A VIRTUAL PRESENTATION CREDENTIAL */
              <div>
                {/* Header */}
                <div className="border-b-2 border-sky-600 pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      {settings.conference_logo ? (
                        <img
                          src={settings.conference_logo}
                          alt="Conference Logo"
                          className="h-12 w-12 shrink-0 rounded-lg object-contain border border-sky-200 bg-white p-0.5 shadow-sm"
                        />
                      ) : (
                        <div className="h-12 w-10 shrink-0 rounded-lg bg-slate-900 border border-sky-500 flex flex-col items-center justify-center text-sky-400 font-bold text-xs shadow-sm">
                          SV
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="text-[9px] font-black uppercase tracking-widest text-sky-700">
                          SCHOLARVAULT CONFERENCES · OFFICIAL SCIENTIFIC PROCEEDINGS
                        </div>
                        <h3 className="text-sm sm:text-base font-black text-slate-900 mt-1 leading-tight break-words">
                          {edition.name}
                        </h3>
                        <p className="text-[11px] text-slate-600 mt-0.5 break-words">
                          {samplePreviewData.conferenceDates} | Virtual Presentation Hall
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right text-[10px] text-slate-500 bg-slate-50 border border-slate-200 rounded-lg p-2.5 shadow-xs">
                      <div className="text-[8px] uppercase tracking-wider font-bold text-sky-700">Reference ID</div>
                      <div className="font-mono font-bold text-slate-800 text-xs">{samplePreviewData.referenceId}</div>
                      <div className="text-[9px] text-slate-400 mt-0.5">PAGE 1 OF 1 · ISSUED: {samplePreviewData.dateOfIssue}</div>
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div className="my-4 rounded-lg bg-sky-50 p-2.5 text-center text-xs font-bold text-sky-950 border border-sky-200">
                  OFFICIAL LETTER OF ACCEPTANCE & PRESENTATION CREDENTIAL
                  <div className="text-[10px] font-normal text-sky-800 mt-0.5">
                    THEMATIC TRACK: {samplePreviewData.trackName.toUpperCase()}
                  </div>
                </div>

                {/* Addressee */}
                <div className="text-xs text-slate-800 mb-3">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">To:</div>
                  <div className="font-bold text-slate-900">{samplePreviewData.authorName}</div>
                  <div className="text-slate-600">{samplePreviewData.authorInstitution}</div>
                </div>

                {/* Title */}
                <div className="rounded border-l-4 border-slate-800 bg-slate-50 p-2.5 text-xs text-slate-900 italic font-serif my-3">
                  "{samplePreviewData.paperTitle}"
                </div>

                {/* Virtual Intro */}
                <div className="text-xs text-slate-700 leading-relaxed font-serif my-2">
                  On behalf of the Technical Programme Committee and Editorial Board of {edition.name}, we are pleased to confirm that your submitted research manuscript titled above has been formally evaluated through double-blind peer review and ACCEPTED for virtual oral presentation in {samplePreviewData.trackName} at {edition.name}, convening virtually on {samplePreviewData.conferenceDates}.
                </div>

                {/* Virtual Presentation Credential Box */}
                <div className="my-3 rounded-lg border-l-4 border-sky-500 bg-sky-50/50 p-3 border border-sky-200 text-[10px] space-y-1.5">
                  <div className="font-bold text-sky-900 uppercase tracking-wider text-[10px]">
                    VIRTUAL PRESENTATION CREDENTIAL &amp; DIGITAL SESSION DISPATCH
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div>
                      <strong className="text-slate-900">• Digital Room Assignment:</strong>
                      <p className="font-mono text-sky-800 font-semibold">{samplePreviewData.digitalRoomAssignment}</p>
                    </div>
                    <div>
                      <strong className="text-slate-900">• Scheduled Presentation Window:</strong>
                      <p>{samplePreviewData.presentationWindow}</p>
                    </div>
                    <div>
                      <strong className="text-slate-900">• Persistent DOI &amp; Archival:</strong>
                      <p className="font-mono text-slate-800">{samplePreviewData.doiString} | ScholarVault Proceedings</p>
                    </div>
                    <div>
                      <strong className="text-slate-900">• Presenter Technical Readiness:</strong>
                      <p>Zoom Client v6.0+ · 16:9 Slides · Audio/Video test 15 min prior</p>
                    </div>
                  </div>
                </div>

                {/* Directives */}
                {settings.custom_notes && (
                  <div className="mt-3 rounded bg-amber-50/70 border border-amber-300 p-2 text-[10px] text-amber-900">
                    <strong>IMPORTANT PRESENTER DIRECTIVE:</strong> {settings.custom_notes}
                  </div>
                )}

                {/* Signatures & Seal */}
                <div className="mt-6 pt-4 border-t border-slate-200 grid grid-cols-3 items-end text-center text-[10px]">
                  <div>
                    <div className="h-9 flex items-center justify-center">
                      {settings.general_chair_signature ? (
                        <img
                          src={settings.general_chair_signature}
                          alt="Signature"
                          className="max-h-8 max-w-[120px] object-contain mx-auto"
                        />
                      ) : (
                        <div className="text-blue-900 font-serif italic text-base">
                          {settings.general_chair_signature_style === "executive"
                            ? `// ${settings.general_chair_name} //`
                            : settings.general_chair_signature_style === "calligraphy"
                            ? `~ ✒️ ${settings.general_chair_name} ~`
                            : `~ ${settings.general_chair_name} ~`}
                        </div>
                      )}
                    </div>
                    <div className="font-bold text-slate-900 mt-1">{settings.general_chair_name}</div>
                    <div className="text-[9px] text-amber-700 font-semibold">{settings.general_chair_title}</div>
                  </div>

                  <div className="flex flex-col items-center">
                    {settings.seal_image ? (
                      <img
                        src={settings.seal_image}
                        alt="Seal"
                        className="h-14 w-14 rounded-full object-contain mx-auto"
                      />
                    ) : (
                      <div className={`h-14 w-14 rounded-full border-2 flex flex-col items-center justify-center text-[7px] font-black shadow-inner ${
                        settings.seal_style === "modern_verified"
                          ? "border-slate-800 bg-slate-100 text-slate-900"
                          : settings.seal_style === "academic_crest"
                          ? "border-amber-700 bg-amber-50 text-amber-900"
                          : "border-amber-600 bg-amber-50 text-amber-800"
                      }`}>
                        <span>★ VERIFIED ★</span>
                        <span className="text-[8px] font-black">ACCEPTED</span>
                        <span className="text-[6px] text-amber-600">SEAL</span>
                      </div>
                    )}
                    <div className="text-[8px] text-slate-500 uppercase font-bold mt-1">
                      {settings.seal_title}
                    </div>
                  </div>

                  <div>
                    <div className="h-9 flex items-center justify-center">
                      {settings.tpc_chair_signature ? (
                        <img
                          src={settings.tpc_chair_signature}
                          alt="Signature"
                          className="max-h-8 max-w-[120px] object-contain mx-auto"
                        />
                      ) : (
                        <div className="text-blue-900 font-serif italic text-base">
                          {settings.tpc_chair_signature_style === "executive"
                            ? `// ${settings.tpc_chair_name} //`
                            : settings.tpc_chair_signature_style === "calligraphy"
                            ? `~ ✒️ ${settings.tpc_chair_name} ~`
                            : `~ ${settings.tpc_chair_name} ~`}
                        </div>
                      )}
                    </div>
                    <div className="font-bold text-slate-900 mt-1">{settings.tpc_chair_name}</div>
                    <div className="text-[9px] text-amber-700 font-semibold">{settings.tpc_chair_title}</div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[9px] text-slate-500">
                  <span className="font-semibold text-slate-600">Single Page Sovereign Presentation Credential · ScholarVault Registry</span>
                  <span className="font-mono text-amber-800 text-[9px] break-all sm:text-right max-w-sm">
                    {samplePreviewData.verificationUrl}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Editor Form */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Format Selection Mode */}
        <div className="md:col-span-2 rounded-2xl border border-[var(--border)] p-5 bg-[var(--surface-subtle)] space-y-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[var(--gold)]">
            <Layers size={15} /> Document Format &amp; Modality Routing
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              {
                id: "auto",
                title: "Smart Modality Routing (Auto)",
                desc: "Virtual presentations receive 1-Page credential; In-Person / Hybrid receive 2-Page complete dossier.",
              },
              {
                id: "single_page_compact",
                title: "Single Page Compact",
                desc: "Strictly 1-Page layout with official acceptance and credentials for all presentations.",
              },
              {
                id: "two_page_dossier",
                title: "Two-Page Complete Dossier",
                desc: "Always includes Page 1 (Consular Visa Invitation) and Page 2 (Technical Annexure).",
              },
            ].map((fmt) => (
              <label
                key={fmt.id}
                className={`relative flex flex-col p-3.5 rounded-xl border cursor-pointer transition ${
                  (settings.default_format || "auto") === fmt.id
                    ? "border-[var(--gold)] bg-[var(--gold)]/10 ring-1 ring-[var(--gold)]"
                    : "border-[var(--border)] bg-[var(--bg-primary)] hover:border-[var(--gold)]/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[var(--text-primary)]">{fmt.title}</span>
                  <input
                    type="radio"
                    name="default_format"
                    value={fmt.id}
                    checked={(settings.default_format || "auto") === fmt.id}
                    onChange={(e) => handleChange("default_format", e.target.value)}
                    className="h-3.5 w-3.5 text-[var(--gold)]"
                  />
                </div>
                <p className="mt-1 text-[11px] text-[var(--text-secondary)] leading-relaxed">{fmt.desc}</p>
              </label>
            ))}
          </div>
        </div>

        {/* Official Conference Logo */}
        <div className="rounded-2xl border border-[var(--border)] p-4 bg-[var(--surface-subtle)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[var(--gold)]">
              <ImageIcon size={15} /> Official Letterhead Logo
            </div>
            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-1.5 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--gold)] cursor-pointer transition">
                <UploadCloud size={13} /> {settings.conference_logo ? "Change Logo" : "Upload Logo"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml"
                  onChange={(e) => handleFileUpload("conference_logo", e)}
                  className="hidden"
                />
              </label>
              {settings.conference_logo && (
                <button
                  type="button"
                  onClick={() => handleChange("conference_logo", "")}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-red-500 hover:text-red-700"
                >
                  <Trash2 size={12} /> Clear
                </button>
              )}
            </div>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)]">
            Displayed on top-left of Acceptance Letterhead. Recommended: square or 1:1 ratio, transparent PNG.
          </p>
          {settings.conference_logo ? (
            <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-3">
              <img
                src={settings.conference_logo}
                alt="Conference Logo Preview"
                className="h-12 w-12 rounded-lg object-contain border border-[var(--border)] bg-white p-1"
              />
              <div className="text-[11px] leading-tight">
                <div className="font-bold text-[var(--text-primary)]">Custom Conference Logo Active</div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">✓ Embedded into Letterhead and PDF Export</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-[var(--border)] p-3 text-[var(--text-secondary)]">
              <div className="h-10 w-9 shrink-0 rounded bg-slate-900 border border-amber-500 flex items-center justify-center text-amber-400 font-bold text-[10px]">
                SV
              </div>
              <div className="text-[10px]">
                Default Gold & Navy Crest active. Upload a custom logo to brand the acceptance letterhead.
              </div>
            </div>
          )}
        </div>

        {/* Venue / Virtual Zoom Presentation Details */}
        <div className="rounded-2xl border border-[var(--border)] p-4 bg-[var(--surface-subtle)] space-y-3">
          <label className="block text-xs font-black uppercase tracking-wider text-[var(--gold)]">
            Venue &amp; Zoom Presentation Details
          </label>
          <input
            type="text"
            value={settings.venue_details || ""}
            onChange={(e) => handleChange("venue_details", e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--gold)] focus:outline-none"
            placeholder="e.g. Hybrid Session: India International Centre & Virtual Zoom Interactive Hall A"
          />
          <p className="text-[11px] text-[var(--text-secondary)]">
            Printed on letterhead header and directive section to instruct authors on delivery mode.
          </p>
        </div>

        {/* Official Consular Visa Declarations Settings */}
        <div className="md:col-span-2 rounded-2xl border border-[var(--border)] p-5 bg-[var(--surface-subtle)] space-y-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[var(--gold)]">
            <ShieldCheck size={15} /> Official Consular Visa Invitation Clauses
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
            Meets international embassy requirements for academic visas (US 9 FAM 402.2-5(B), UK Standard Visitor, Schengen Visa Code (EC) No 810/2009, and India MHA Conference Visa regulations).
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Non-Employment &amp; Non-Remuneration Declaration
              </label>
              <textarea
                rows={3}
                value={settings.non_remuneration_text || ""}
                onChange={(e) => handleChange("non_remuneration_text", e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-3 text-xs leading-relaxed text-[var(--text-primary)] focus:border-[var(--gold)] focus:outline-none resize-y"
                placeholder={DEFAULT_LETTER_SETTINGS.non_remuneration_text}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Financial Responsibility &amp; Non-Liability Clause
              </label>
              <textarea
                rows={3}
                value={settings.financial_clause_text || ""}
                onChange={(e) => handleChange("financial_clause_text", e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-3 text-xs leading-relaxed text-[var(--text-primary)] focus:border-[var(--gold)] focus:outline-none resize-y"
                placeholder={DEFAULT_LETTER_SETTINGS.financial_clause_text}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Statutory Consular Regulatory Context (US 9 FAM / UK / Schengen / India MHA)
              </label>
              <textarea
                rows={2}
                value={settings.consular_authority_text || ""}
                onChange={(e) => handleChange("consular_authority_text", e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-3 text-xs leading-relaxed text-[var(--text-primary)] focus:border-[var(--gold)] focus:outline-none resize-y"
                placeholder={DEFAULT_LETTER_SETTINGS.consular_authority_text}
              />
            </div>
          </div>
        </div>

        {/* Technical Annexure & Presenter Readiness Settings */}
        <div className="md:col-span-2 rounded-2xl border border-[var(--border)] p-5 bg-[var(--surface-subtle)] space-y-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[var(--gold)]">
            <Video size={15} /> Page 2 Technical Annexure &amp; Presenter Readiness Specifications
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                Oral Presentation Duration
              </label>
              <input
                type="text"
                value={settings.annexure_oral_duration || ""}
                onChange={(e) => handleChange("annexure_oral_duration", e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--gold)] focus:outline-none"
                placeholder={DEFAULT_LETTER_SETTINGS.annexure_oral_duration}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                Slide Aspect Ratio (16:9 Mandatory)
              </label>
              <input
                type="text"
                value={settings.annexure_aspect_ratio || ""}
                onChange={(e) => handleChange("annexure_aspect_ratio", e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--gold)] focus:outline-none"
                placeholder={DEFAULT_LETTER_SETTINGS.annexure_aspect_ratio}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                Zoom &amp; AV Pre-Flight Instructions
              </label>
              <input
                type="text"
                value={settings.annexure_virtual_platform || ""}
                onChange={(e) => handleChange("annexure_virtual_platform", e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--gold)] focus:outline-none"
                placeholder={DEFAULT_LETTER_SETTINGS.annexure_virtual_platform}
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                ScholarVault Proceedings Formatting Standards
              </label>
              <textarea
                rows={2}
                value={settings.annexure_proceedings_format || ""}
                onChange={(e) => handleChange("annexure_proceedings_format", e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-3 text-xs leading-relaxed text-[var(--text-primary)] focus:border-[var(--gold)] focus:outline-none resize-y"
                placeholder={DEFAULT_LETTER_SETTINGS.annexure_proceedings_format}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                COPE Publication Ethics &amp; Research Integrity Policy
              </label>
              <textarea
                rows={2}
                value={settings.annexure_cope_statement || ""}
                onChange={(e) => handleChange("annexure_cope_statement", e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-3 text-xs leading-relaxed text-[var(--text-primary)] focus:border-[var(--gold)] focus:outline-none resize-y"
                placeholder={DEFAULT_LETTER_SETTINGS.annexure_cope_statement}
              />
            </div>
          </div>
        </div>

        {/* General Chair Details */}
        <div className="rounded-2xl border border-[var(--border)] p-4 bg-[var(--surface-subtle)] space-y-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[var(--gold)]">
            <Award size={15} /> General Chair Endorsement
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
              General Chair Full Name
            </label>
            <input
              type="text"
              value={settings.general_chair_name || ""}
              onChange={(e) => handleChange("general_chair_name", e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--gold)] focus:outline-none"
              placeholder="e.g. Prof. Dr. Aris Thorne"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
              Official Title
            </label>
            <input
              type="text"
              value={settings.general_chair_title || ""}
              onChange={(e) => handleChange("general_chair_title", e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--gold)] focus:outline-none"
              placeholder="e.g. General Conference Chair"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
              Affiliation / Organization
            </label>
            <input
              type="text"
              value={settings.general_chair_affiliation || ""}
              onChange={(e) => handleChange("general_chair_affiliation", e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--gold)] focus:outline-none"
              placeholder="e.g. Global Council on Research Integrity"
            />
          </div>

          <div className="border-t border-[var(--border)] pt-3">
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
              Signature Style &amp; Custom Upload
            </label>
            <div className="flex flex-wrap gap-2 items-center">
              <select
                value={settings.general_chair_signature_style || "classic"}
                onChange={(e) => handleChange("general_chair_signature_style", e.target.value as any)}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-1.5 text-xs text-[var(--text-primary)] focus:border-[var(--gold)] focus:outline-none"
              >
                <option value="classic">Classic Cursive Stroke</option>
                <option value="calligraphy">Formal Calligraphy</option>
                <option value="executive">Executive Script</option>
              </select>

              <label className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-1.5 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--gold)] cursor-pointer transition">
                <UploadCloud size={13} /> Upload PNG Signature
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml"
                  onChange={(e) => handleFileUpload("general_chair_signature", e)}
                  className="hidden"
                />
              </label>

              {settings.general_chair_signature && (
                <button
                  type="button"
                  onClick={() => handleChange("general_chair_signature", "")}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-red-500 hover:text-red-700"
                >
                  <Trash2 size={12} /> Clear
                </button>
              )}
            </div>
            {settings.general_chair_signature && (
              <div className="mt-2 p-1.5 rounded-lg bg-white border border-[var(--border)] inline-block">
                <img
                  src={settings.general_chair_signature}
                  alt="General Chair Signature"
                  className="h-8 max-w-[140px] object-contain"
                />
              </div>
            )}
          </div>
        </div>

        {/* TPC Chair Details */}
        <div className="rounded-2xl border border-[var(--border)] p-4 bg-[var(--surface-subtle)] space-y-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[var(--gold)]">
            <Award size={15} /> TPC Chair Endorsement
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
              TPC Chair Full Name
            </label>
            <input
              type="text"
              value={settings.tpc_chair_name || ""}
              onChange={(e) => handleChange("tpc_chair_name", e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--gold)] focus:outline-none"
              placeholder="e.g. Dr. Elena Rostova"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
              Official Title
            </label>
            <input
              type="text"
              value={settings.tpc_chair_title || ""}
              onChange={(e) => handleChange("tpc_chair_title", e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--gold)] focus:outline-none"
              placeholder="e.g. Technical Programme Committee Chair"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
              Affiliation / Faculty
            </label>
            <input
              type="text"
              value={settings.tpc_chair_affiliation || ""}
              onChange={(e) => handleChange("tpc_chair_affiliation", e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--gold)] focus:outline-none"
              placeholder="e.g. International Association of AI Ethics"
            />
          </div>

          <div className="border-t border-[var(--border)] pt-3">
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
              Signature Style &amp; Custom Upload
            </label>
            <div className="flex flex-wrap gap-2 items-center">
              <select
                value={settings.tpc_chair_signature_style || "classic"}
                onChange={(e) => handleChange("tpc_chair_signature_style", e.target.value as any)}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-1.5 text-xs text-[var(--text-primary)] focus:border-[var(--gold)] focus:outline-none"
              >
                <option value="classic">Classic Cursive Stroke</option>
                <option value="calligraphy">Formal Calligraphy</option>
                <option value="executive">Executive Script</option>
              </select>

              <label className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-1.5 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--gold)] cursor-pointer transition">
                <UploadCloud size={13} /> Upload PNG Signature
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml"
                  onChange={(e) => handleFileUpload("tpc_chair_signature", e)}
                  className="hidden"
                />
              </label>

              {settings.tpc_chair_signature && (
                <button
                  type="button"
                  onClick={() => handleChange("tpc_chair_signature", "")}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-red-500 hover:text-red-700"
                >
                  <Trash2 size={12} /> Clear
                </button>
              )}
            </div>
            {settings.tpc_chair_signature && (
              <div className="mt-2 p-1.5 rounded-lg bg-white border border-[var(--border)] inline-block">
                <img
                  src={settings.tpc_chair_signature}
                  alt="TPC Chair Signature"
                  className="h-8 max-w-[140px] object-contain"
                />
              </div>
            )}
          </div>
        </div>

        {/* Official Seal Customization */}
        <div className="rounded-2xl border border-[var(--border)] p-4 bg-[var(--surface-subtle)] space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-black uppercase tracking-wider text-[var(--gold)]">
              Official Conference Seal Stamp
            </label>
            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-1 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--gold)] cursor-pointer">
                <UploadCloud size={12} /> Custom Seal
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml"
                  onChange={(e) => handleFileUpload("seal_image", e)}
                  className="hidden"
                />
              </label>
              {settings.seal_image && (
                <button
                  type="button"
                  onClick={() => handleChange("seal_image", "")}
                  className="text-[11px] font-bold text-red-500 hover:text-red-700"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <div>
            <span className="text-[10px] text-[var(--text-secondary)]">Seal Design Preset</span>
            <select
              value={settings.seal_style || "classic_gold"}
              onChange={(e) => handleChange("seal_style", e.target.value as any)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-1.5 text-xs text-[var(--text-primary)] focus:border-[var(--gold)] focus:outline-none mt-1"
            >
              <option value="classic_gold">Classic Gold Academic Seal</option>
              <option value="academic_crest">Peer Reviewed Crest Stamp</option>
              <option value="modern_verified">Modern Navy &amp; Gold Verified</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-[var(--text-secondary)]">Seal Top Title</span>
              <input
                type="text"
                value={settings.seal_title || ""}
                onChange={(e) => handleChange("seal_title", e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-1.5 text-xs text-[var(--text-primary)] focus:border-[var(--gold)] focus:outline-none mt-1"
                placeholder="OFFICIAL ACCEPTANCE"
              />
            </div>
            <div>
              <span className="text-[10px] text-[var(--text-secondary)]">Seal Subtitle</span>
              <input
                type="text"
                value={settings.seal_subtext || ""}
                onChange={(e) => handleChange("seal_subtext", e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-1.5 text-xs text-[var(--text-primary)] focus:border-[var(--gold)] focus:outline-none mt-1"
                placeholder="SCHOLARVAULT SEAL"
              />
            </div>
          </div>
          {settings.seal_image && (
            <div className="mt-1 flex items-center gap-2">
              <img
                src={settings.seal_image}
                alt="Custom Seal"
                className="h-10 w-10 rounded-full object-contain border border-[var(--border)] bg-white p-0.5"
              />
              <span className="text-[11px] text-[var(--text-secondary)]">Custom seal image active</span>
            </div>
          )}
        </div>

        {/* Body Template with Placeholders */}
        <div className="rounded-2xl border border-[var(--border)] p-4 bg-[var(--surface-subtle)] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <label className="text-xs font-black uppercase tracking-wider text-[var(--gold)]">
              Acceptance Body Text
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                "{{author_name}}",
                "{{paper_title}}",
                "{{track}}",
                "{{conference_date}}",
                "{{conference_name}}",
                "{{submission_number}}",
                "{{venue}}",
              ].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleInsertTag(tag)}
                  className="rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-2 py-0.5 text-[10px] font-mono font-bold text-[var(--text-secondary)] hover:text-[var(--gold)] transition"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          <textarea
            rows={5}
            value={settings.body_template || ""}
            onChange={(e) => handleChange("body_template", e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-3.5 text-xs font-mono leading-relaxed text-[var(--text-primary)] focus:border-[var(--gold)] focus:outline-none resize-y"
            placeholder="Type body template text..."
          />

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
              Important Author Directives / Camera-Ready Notice (Optional)
            </label>
            <input
              type="text"
              value={settings.custom_notes || ""}
              onChange={(e) => handleChange("custom_notes", e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--gold)] focus:outline-none"
              placeholder="e.g. Please ensure final manuscript updates and registration are completed before deadline."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
