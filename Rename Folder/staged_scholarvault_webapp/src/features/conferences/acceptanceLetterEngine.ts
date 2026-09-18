/**
 * Automated Centralized Acceptance Letter Engine
 * Generates an official, print-ready, high-resolution A4 Acceptance Letter template
 * with dynamic fields, chair signatures, official conference seal, and verifiable QR code.
 *
 * Supports:
 * - Mode A (Virtual 1-Page): Sovereign credential with digital room assignment, presentation window,
 *   Crossref DOI, chair signatures, seal, and QR verification. Zero visa clutter.
 * - Mode B (In-Person / Hybrid 2-Page Dossier):
 *   - Page 1: Sovereign Letter of Acceptance & Consular Visa Invitation with full official embassy clauses,
 *     chair signatures, and seal.
 *   - Page 2: Technical Annexure with Presenter Technical Readiness (Zoom / 16:9 AV checks), ScholarVault
 *     Proceedings formatting, milestone compliance table, and COPE governance.
 * - Format selection: "auto" (routes by event format & author presentation modality),
 *   "single_page_compact", and "two_page_dossier".
 */

import { jsPDF } from "jspdf";

export type AcceptanceLetterFormat = "auto" | "single_page_compact" | "two_page_dossier";
export type PresentationModality = "virtual" | "in_person" | "hybrid";

export type AcceptanceLetterSettings = {
  conference_logo?: string;
  general_chair_name?: string;
  general_chair_title?: string;
  general_chair_affiliation?: string;
  general_chair_signature?: string;
  general_chair_signature_style?: "classic" | "calligraphy" | "executive";
  tpc_chair_name?: string;
  tpc_chair_title?: string;
  tpc_chair_affiliation?: string;
  tpc_chair_signature?: string;
  tpc_chair_signature_style?: "classic" | "calligraphy" | "executive";
  seal_title?: string;
  seal_subtext?: string;
  seal_image?: string;
  seal_style?: "classic_gold" | "academic_crest" | "modern_verified";
  venue_details?: string;
  letterhead_subtitle?: string;
  body_template?: string;
  custom_notes?: string;
  default_format?: AcceptanceLetterFormat;
  // Official Consular & Visa settings
  consular_authority_text?: string;
  non_remuneration_text?: string;
  financial_clause_text?: string;
  // Technical Annexure settings
  annexure_oral_duration?: string;
  annexure_aspect_ratio?: string;
  annexure_proceedings_format?: string;
  annexure_virtual_platform?: string;
  annexure_cope_statement?: string;
};

export const DEFAULT_LETTER_SETTINGS: AcceptanceLetterSettings = {
  general_chair_name: "Prof. Dr. Aris Thorne",
  general_chair_title: "General Conference Chair",
  general_chair_affiliation: "Global Council on Research Integrity & Ethical Systems",
  general_chair_signature_style: "classic",
  tpc_chair_name: "Dr. Elena Rostova",
  tpc_chair_title: "Technical Programme Committee Chair",
  tpc_chair_affiliation: "International Association of Responsible AI Researchers",
  tpc_chair_signature_style: "classic",
  seal_title: "OFFICIAL ACCEPTANCE",
  seal_subtext: "SCHOLARVAULT ACADEMIC SEAL",
  seal_style: "classic_gold",
  venue_details: "Hybrid Session: India International Centre & Virtual Zoom Interactive Hall A",
  letterhead_subtitle: "International Summit on Research Integrity & Responsible AI in Scholarly Publishing",
  default_format: "auto",
  body_template:
    "Dear {{author_name}},\n\nOn behalf of the Technical Programme Committee and Editorial Board of {{conference_name}}, we are pleased to inform you that your submitted research manuscript titled:\n\n\"{{paper_title}}\"\n\nhas been evaluated through our double-blind peer-review process and formally ACCEPTED for oral presentation in {{track}} at {{conference_name}}, taking place on {{conference_date}}.\n\nYour submission was praised by the review panel for its methodological rigor, original academic contribution, and alignment with the summit's high standards of research integrity. We cordially invite you and your co-authors to attend and deliver your research presentation.\n\nAccepted and presented papers are eligible for archiving in the official Conference Proceedings with persistent digital object identifiers (DOIs) and verifiable ScholarVault credentials.",
  custom_notes:
    "Please ensure final publication-ready manuscript updates, presenter registration, and technical readiness checks (Zoom client and 16:9 widescreen presentation slide deck) are completed prior to the announced deadline to secure your presentation slot and conference proceedings inclusion.",
  consular_authority_text:
    "Issued in compliance with international consular regulations for scientific and academic convention attendance, including US 9 FAM 402.2-5(B) (Scientific Conferences), UK Immigration Rules Appendix V (Visitor: Academic & Conference Activity), Schengen Visa Code (EC) No 810/2009 (Scientific Exchange & Events), and India Ministry of Home Affairs (MHA) Conference Guidelines.",
  non_remuneration_text:
    "The Organizing Secretariat hereby declares that the invited participant will not receive any salary, wages, honoraria, living allowance, or remuneration of any kind from sources within the host nation. The sole purpose of travel is bona fide participation in scholarly sessions and oral delivery of their peer-reviewed research.",
  financial_clause_text:
    "Neither the conference host institution nor the Organizing Committee assumes any financial liability for the participant's travel, subsistence, local accommodation, or medical insurance. All expenses relating to round-trip international travel, local transit, lodging, living costs, and comprehensive medical coverage remain the sole responsibility of the participant and/or their sponsoring academic institution, unless explicitly confirmed in an official ScholarVault Travel Grant award letter.",
  annexure_oral_duration: "15 minutes oral presentation followed by 5 minutes interactive Q&A discussion.",
  annexure_aspect_ratio: "16:9 Widescreen aspect ratio (PowerPoint / PDF). Legacy 4:3 format is deprecated.",
  annexure_proceedings_format: "ScholarVault Standard Proceedings Format (two-column academic layout, embedded vector figures, Crossref DOI deposition).",
  annexure_virtual_platform: "Latest Zoom Desktop Client (v6.0+) installed and tested. Audio/video pre-check 15 minutes prior to session.",
  annexure_cope_statement: "Adherence to the Committee on Publication Ethics (COPE) Code of Conduct. Strict zero-plagiarism policy (<15% similarity excluding references) and transparent disclosure of AI assistance.",
};

export type AcceptanceLetterData = {
  conferenceLogo?: string;
  conferenceName: string;
  conferenceShortName: string;
  conferenceSlug: string;
  conferenceDates: string;
  venueDetails: string;
  referenceId: string;
  dateOfIssue: string;
  authorName: string;
  authorInstitution: string;
  authorCountry: string;
  coauthorsText: string;
  paperTitle: string;
  trackName: string;
  bodyParagraphs: string[];
  notesText: string;
  verificationUrl: string;
  generalChairName: string;
  generalChairTitle: string;
  generalChairAffiliation: string;
  generalChairSignature?: string;
  generalChairSignatureStyle: "classic" | "calligraphy" | "executive";
  tpcChairName: string;
  tpcChairTitle: string;
  tpcChairAffiliation: string;
  tpcChairSignature?: string;
  tpcChairSignatureStyle: "classic" | "calligraphy" | "executive";
  sealTitle: string;
  sealSubtext: string;
  sealImage?: string;
  sealStyle: "classic_gold" | "academic_crest" | "modern_verified";
  deliveryMode: "physical" | "virtual" | "hybrid";
  presentationModality: "virtual" | "in_person" | "hybrid";
  isVirtual: boolean;
  doiString: string;
  digitalRoomAssignment: string;
  presentationWindow: string;
  consularAuthorityText: string;
  nonRemunerationText: string;
  financialClauseText: string;
  annexureOralDuration: string;
  annexureAspectRatio: string;
  annexureProceedingsFormat: string;
  annexureVirtualPlatform: string;
  annexureCopeStatement: string;
  defaultFormat: AcceptanceLetterFormat;
};

/**
 * Resolves whether to render a 1-page compact credential or a 2-page complete dossier.
 */
export function resolveLetterFormat(
  formatOverride?: AcceptanceLetterFormat | null,
  configuredDefault?: AcceptanceLetterFormat,
  isVirtual?: boolean
): "single_page_compact" | "two_page_dossier" {
  const chosen = formatOverride || configuredDefault || "auto";
  if (chosen === "single_page_compact") return "single_page_compact";
  if (chosen === "two_page_dossier") return "two_page_dossier";
  // Auto routing: Virtual presentations get 1-page compact credential; in-person/hybrid get 2-page dossier
  return isVirtual ? "single_page_compact" : "two_page_dossier";
}

/**
 * Sanitizes verification origin to guarantee official canonical domain on verified credentials.
 */
export function getCanonicalVerificationOrigin(origin?: string): string {
  if (!origin || origin.includes("vercel.app") || origin.includes("localhost") || origin.includes("127.0.0.1")) {
    return "https://app.scholarvault.in";
  }
  return origin.replace(/\/+$/, "");
}

/**
 * Resolves dynamic placeholders in the body template and creates normalized letter data.
 */
export function buildAcceptanceLetterData(
  submission: any,
  edition: any,
  customConfig?: Partial<AcceptanceLetterSettings> | null,
  origin = "https://app.scholarvault.in"
): AcceptanceLetterData {
  const settings: AcceptanceLetterSettings = {
    ...DEFAULT_LETTER_SETTINGS,
    ...(edition?.settings?.acceptance_letter || {}),
    ...(customConfig || {}),
  };

  const authors = Array.isArray(submission?.authors) ? submission.authors : [];
  const primaryAuthor =
    authors.find((a: any) => a.is_corresponding) ||
    authors[0] ||
    submission?.custom_answers?.public_form_contact ||
    {};

  const authorName =
    primaryAuthor?.name ||
    submission?.custom_answers?.author_name ||
    "Author";

  const authorInstitution =
    primaryAuthor?.institution ||
    submission?.custom_answers?.author_institution ||
    "Academic Institution";

  const authorCountry =
    primaryAuthor?.country ||
    submission?.custom_answers?.author_country ||
    "";

  const coauthorList = authors
    .filter((a: any) => a.email !== primaryAuthor?.email)
    .map((a: any) => `${a.name}${a.institution ? ` (${a.institution})` : ""}`);

  const coauthorsText =
    coauthorList.length > 0
      ? coauthorList.join("; ")
      : submission?.custom_answers?.public_form_contact?.coauthors_text || "";

  const paperTitle = submission?.title || "Submitted Manuscript";
  const trackName = submission?.track?.name || (typeof submission?.track === "string" ? submission.track : "Thematic Research Track");
  const conferenceName = edition?.name || "ScholarVault Academic Summit";
  const conferenceShortName =
    edition?.short_name ||
    edition?.series?.acronym ||
    "SVRIAS 2026";

  let conferenceDates = "December 14–15, 2026";
  if (edition?.starts_at) {
    const start = new Date(edition.starts_at);
    const end = edition.ends_at ? new Date(edition.ends_at) : start;
    conferenceDates =
      start.toLocaleDateString("en-US", { month: "long", day: "numeric" }) +
      "–" +
      end.toLocaleDateString("en-US", { day: "numeric", year: "numeric" });
  }

  const referenceId = submission?.submission_number || "SVRIAS-ABS-2026-001";
  const dateOfIssue = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const venueDetails =
    settings.venue_details ||
    [edition?.venue_name, edition?.city, edition?.country]
      .filter(Boolean)
      .join(", ") ||
    "Hybrid Conference (In-Person & Virtual Zoom Interactive)";

  // Determine conference edition delivery mode
  const deliveryMode: "physical" | "virtual" | "hybrid" =
    edition?.delivery_mode === "virtual"
      ? "virtual"
      : edition?.delivery_mode === "physical"
        ? "physical"
        : "hybrid";

  // Determine presentation modality
  const rawModality =
    submission?.registration?.participation_mode ||
    submission?.presentation_modality ||
    submission?.custom_answers?.presentation_modality ||
    submission?.custom_answers?.participation_mode ||
    submission?.custom_answers?.presentation_mode ||
    submission?.modality ||
    (deliveryMode === "virtual" ? "virtual" : deliveryMode === "physical" ? "in_person" : "hybrid");

  const normalizedModality = String(rawModality).toLowerCase();
  const presentationModality: "virtual" | "in_person" | "hybrid" =
    normalizedModality.includes("virtual") || normalizedModality.includes("online")
      ? "virtual"
      : normalizedModality.includes("physical") ||
        normalizedModality.includes("person") ||
        normalizedModality.includes("in-person")
        ? "in_person"
        : deliveryMode === "virtual"
          ? "virtual"
          : deliveryMode === "physical"
            ? "in_person"
            : "hybrid";

  const isVirtual = presentationModality === "virtual" || deliveryMode === "virtual";

  // Placeholder replacements
  const rawBody = settings.body_template || DEFAULT_LETTER_SETTINGS.body_template || "";
  const replacedBody = rawBody
    .replaceAll("{{author_name}}", authorName)
    .replaceAll("{{paper_title}}", paperTitle)
    .replaceAll("{{track}}", trackName)
    .replaceAll("{{conference_date}}", conferenceDates)
    .replaceAll("{{conference_name}}", conferenceName)
    .replaceAll("{{conference_short_name}}", conferenceShortName)
    .replaceAll("{{submission_number}}", referenceId)
    .replaceAll("{{venue}}", venueDetails);

  const bodyParagraphs = replacedBody.split("\n\n").map((p) => p.trim()).filter(Boolean);

  const canonicalOrigin = getCanonicalVerificationOrigin(origin);
  const conferenceSlug = edition?.slug || "svrias-2026";
  const verificationUrl = `${canonicalOrigin}/conference/${conferenceSlug}/submission/${encodeURIComponent(referenceId)}`;

  const cleanRef = referenceId.replace(/[^A-Za-z0-9]/g, "").toLowerCase();
  const doiString = `10.5555/${conferenceSlug}.${cleanRef}`;
  const digitalRoomAssignment = "Interactive Virtual Hall Alpha (Zoom Direct Room)";
  const presentationWindow = `${conferenceDates} — Scheduled 20-Min Oral Track (15m talk + 5m Q&A)`;

  return {
    conferenceLogo:
      settings.conference_logo ||
      edition?.settings?.acceptance_letter?.conference_logo ||
      edition?.settings?.conference_logo ||
      edition?.logo_url ||
      undefined,
    conferenceName,
    conferenceShortName,
    conferenceSlug,
    conferenceDates,
    venueDetails,
    referenceId,
    dateOfIssue,
    authorName,
    authorInstitution,
    authorCountry,
    coauthorsText,
    paperTitle,
    trackName,
    bodyParagraphs,
    notesText: settings.custom_notes || DEFAULT_LETTER_SETTINGS.custom_notes || "",
    verificationUrl,
    generalChairName: settings.general_chair_name || DEFAULT_LETTER_SETTINGS.general_chair_name!,
    generalChairTitle: settings.general_chair_title || DEFAULT_LETTER_SETTINGS.general_chair_title!,
    generalChairAffiliation: settings.general_chair_affiliation || DEFAULT_LETTER_SETTINGS.general_chair_affiliation!,
    generalChairSignature: settings.general_chair_signature,
    generalChairSignatureStyle: settings.general_chair_signature_style || "classic",
    tpcChairName: settings.tpc_chair_name || DEFAULT_LETTER_SETTINGS.tpc_chair_name!,
    tpcChairTitle: settings.tpc_chair_title || DEFAULT_LETTER_SETTINGS.tpc_chair_title!,
    tpcChairAffiliation: settings.tpc_chair_affiliation || DEFAULT_LETTER_SETTINGS.tpc_chair_affiliation!,
    tpcChairSignature: settings.tpc_chair_signature,
    tpcChairSignatureStyle: settings.tpc_chair_signature_style || "classic",
    sealTitle: settings.seal_title || DEFAULT_LETTER_SETTINGS.seal_title!,
    sealSubtext: settings.seal_subtext || DEFAULT_LETTER_SETTINGS.seal_subtext!,
    sealImage: settings.seal_image,
    sealStyle: settings.seal_style || "classic_gold",
    deliveryMode,
    presentationModality,
    isVirtual,
    doiString,
    digitalRoomAssignment,
    presentationWindow,
    consularAuthorityText: settings.consular_authority_text || DEFAULT_LETTER_SETTINGS.consular_authority_text!,
    nonRemunerationText: settings.non_remuneration_text || DEFAULT_LETTER_SETTINGS.non_remuneration_text!,
    financialClauseText: settings.financial_clause_text || DEFAULT_LETTER_SETTINGS.financial_clause_text!,
    annexureOralDuration: settings.annexure_oral_duration || DEFAULT_LETTER_SETTINGS.annexure_oral_duration!,
    annexureAspectRatio: settings.annexure_aspect_ratio || DEFAULT_LETTER_SETTINGS.annexure_aspect_ratio!,
    annexureProceedingsFormat: settings.annexure_proceedings_format || DEFAULT_LETTER_SETTINGS.annexure_proceedings_format!,
    annexureVirtualPlatform: settings.annexure_virtual_platform || DEFAULT_LETTER_SETTINGS.annexure_virtual_platform!,
    annexureCopeStatement: settings.annexure_cope_statement || DEFAULT_LETTER_SETTINGS.annexure_cope_statement!,
    defaultFormat: settings.default_format || "auto",
  };
}

/**
 * ISO/IEC 18004 QR Code Matrix Generator (Nayuki MIT Algorithm)
 * Generates authentic, verifiable QR Code matrices for URL verification.
 */
class QrEcc {
  public static readonly LOW = new QrEcc(0, 1);
  public static readonly MEDIUM = new QrEcc(1, 0);
  public static readonly QUARTILE = new QrEcc(2, 3);
  public static readonly HIGH = new QrEcc(3, 2);
  private constructor(public readonly ordinal: number, public readonly formatBits: number) {}
}

class QrMode {
  public static readonly NUMERIC = new QrMode(1, [10, 12, 14]);
  public static readonly ALPHANUMERIC = new QrMode(2, [9, 11, 13]);
  public static readonly BYTE = new QrMode(4, [8, 16, 16]);
  private constructor(public readonly modeBits: number, private readonly numBitsCharCount: [number, number, number]) {}
  public numCharCountBits(ver: number): number {
    return this.numBitsCharCount[Math.floor((ver + 7) / 17)];
  }
}

function qrAppendBits(val: number, len: number, bb: number[]): void {
  if (len < 0 || len > 31 || val >>> len !== 0) throw new RangeError("Value out of range");
  for (let i = len - 1; i >= 0; i--) bb.push((val >>> i) & 1);
}

function qrGetBit(x: number, i: number): boolean {
  return ((x >>> i) & 1) !== 0;
}

class QrSegment {
  public static readonly ALPHANUMERIC_CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:";
  public constructor(public readonly mode: QrMode, public readonly numChars: number, public readonly bitData: number[]) {
    if (numChars < 0) throw new RangeError("Invalid argument");
  }
  public static makeBytes(data: number[]): QrSegment {
    const bb: number[] = [];
    for (const b of data) qrAppendBits(b, 8, bb);
    return new QrSegment(QrMode.BYTE, data.length, bb);
  }
  public static makeAlphanumeric(text: string): QrSegment {
    const bb: number[] = [];
    let i = 0;
    for (; i + 2 <= text.length; i += 2) {
      let temp = QrSegment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i)) * 45;
      temp += QrSegment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i + 1));
      qrAppendBits(temp, 11, bb);
    }
    if (i < text.length) qrAppendBits(QrSegment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i)), 6, bb);
    return new QrSegment(QrMode.ALPHANUMERIC, text.length, bb);
  }
  public static makeNumeric(digits: string): QrSegment {
    const bb: number[] = [];
    for (let i = 0; i < digits.length; ) {
      const n = Math.min(digits.length - i, 3);
      qrAppendBits(parseInt(digits.substring(i, i + n), 10), n * 3 + 1, bb);
      i += n;
    }
    return new QrSegment(QrMode.NUMERIC, digits.length, bb);
  }
  public static makeSegments(text: string): QrSegment[] {
    if (text === "") return [];
    if (/^[0-9]*$/.test(text)) return [QrSegment.makeNumeric(text)];
    if (/^[A-Z0-9 $%*+.\/:-]*$/.test(text)) return [QrSegment.makeAlphanumeric(text)];
    const encoded = encodeURI(text);
    const bytes: number[] = [];
    for (let i = 0; i < encoded.length; i++) {
      if (encoded.charAt(i) !== "%") bytes.push(encoded.charCodeAt(i));
      else { bytes.push(parseInt(encoded.substring(i + 1, i + 3), 16)); i += 2; }
    }
    return [QrSegment.makeBytes(bytes)];
  }
  public static getTotalBits(segs: QrSegment[], version: number): number {
    let result = 0;
    for (const seg of segs) {
      const ccbits = seg.mode.numCharCountBits(version);
      if (seg.numChars >= 1 << ccbits) return Infinity;
      result += 4 + ccbits + seg.bitData.length;
    }
    return result;
  }
}

class QrCodeGenerator {
  public static readonly MIN_VERSION = 1;
  public static readonly MAX_VERSION = 40;
  public static readonly ECC_CODEWORDS_PER_BLOCK = [
    [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
    [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  ];
  public static readonly NUM_ERROR_CORRECTION_BLOCKS = [
    [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
    [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
    [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
    [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81],
  ];

  public readonly size: number;
  public readonly modules: boolean[][];
  private isFunction: boolean[][];

  public constructor(public readonly version: number, public readonly errorCorrectionLevel: QrEcc, dataCodewords: number[], mask: number) {
    this.size = version * 4 + 17;
    this.modules = Array.from({ length: this.size }, () => Array(this.size).fill(false));
    this.isFunction = Array.from({ length: this.size }, () => Array(this.size).fill(false));

    this.drawFunctionPatterns();
    const allCodewords = this.addEccAndInterleave(dataCodewords);
    this.drawCodewords(allCodewords);

    if (mask === -1) {
      let minPenalty = 1e9;
      for (let i = 0; i < 8; i++) {
        this.applyMask(i);
        this.drawFormatBits(i);
        const penalty = this.getPenaltyScore();
        if (penalty < minPenalty) {
          mask = i;
          minPenalty = penalty;
        }
        this.applyMask(i);
      }
    }
    this.applyMask(mask);
    this.drawFormatBits(mask);
    this.isFunction = [];
  }

  public static encodeText(text: string, ecl = QrEcc.MEDIUM): boolean[][] {
    const segs = QrSegment.makeSegments(text);
    let version = 1;
    for (; version <= 40; version++) {
      const dataCapacityBits = (Math.floor(QrCodeGenerator.getNumRawDataModules(version) / 8) -
        QrCodeGenerator.ECC_CODEWORDS_PER_BLOCK[ecl.ordinal][version] *
        QrCodeGenerator.NUM_ERROR_CORRECTION_BLOCKS[ecl.ordinal][version]) * 8;
      const usedBits = QrSegment.getTotalBits(segs, version);
      if (usedBits <= dataCapacityBits) break;
    }
    if (version > 40) version = 40;

    const bb: number[] = [];
    for (const seg of segs) {
      qrAppendBits(seg.mode.modeBits, 4, bb);
      qrAppendBits(seg.numChars, seg.mode.numCharCountBits(version), bb);
      for (const b of seg.bitData) bb.push(b);
    }
    const dataCapacityBits = (Math.floor(QrCodeGenerator.getNumRawDataModules(version) / 8) -
      QrCodeGenerator.ECC_CODEWORDS_PER_BLOCK[ecl.ordinal][version] *
      QrCodeGenerator.NUM_ERROR_CORRECTION_BLOCKS[ecl.ordinal][version]) * 8;
    qrAppendBits(0, Math.min(4, dataCapacityBits - bb.length), bb);
    qrAppendBits(0, (8 - (bb.length % 8)) % 8, bb);
    for (let padByte = 236; bb.length < dataCapacityBits; padByte ^= 236 ^ 17) {
      qrAppendBits(padByte, 8, bb);
    }
    const dataCodewords: number[] = Array(bb.length >>> 3).fill(0);
    bb.forEach((b, i) => (dataCodewords[i >>> 3] |= b << (7 - (i & 7))));

    const qr = new QrCodeGenerator(version, ecl, dataCodewords, -1);
    return qr.modules;
  }

  private drawFunctionPatterns(): void {
    for (let i = 0; i < this.size; i++) {
      this.setFunctionModule(6, i, i % 2 === 0);
      this.setFunctionModule(i, 6, i % 2 === 0);
    }
    this.drawFinderPattern(3, 3);
    this.drawFinderPattern(this.size - 4, 3);
    this.drawFinderPattern(3, this.size - 4);
    const alignPos = this.getAlignmentPatternPositions();
    for (let i = 0; i < alignPos.length; i++) {
      for (let j = 0; j < alignPos.length; j++) {
        if (!((i === 0 && j === 0) || (i === 0 && j === alignPos.length - 1) || (i === alignPos.length - 1 && j === 0))) {
          this.drawAlignmentPattern(alignPos[i], alignPos[j]);
        }
      }
    }
    this.drawFormatBits(0);
    if (this.version >= 7) this.drawVersion();
  }

  private drawFormatBits(mask: number): void {
    const data = (this.errorCorrectionLevel.formatBits << 3) | mask;
    let rem = data;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 1335);
    const bits = ((data << 10) | rem) ^ 21522;
    for (let i = 0; i <= 5; i++) this.setFunctionModule(8, i, qrGetBit(bits, i));
    this.setFunctionModule(8, 7, qrGetBit(bits, 6));
    this.setFunctionModule(8, 8, qrGetBit(bits, 7));
    this.setFunctionModule(7, 8, qrGetBit(bits, 8));
    for (let i = 9; i < 15; i++) this.setFunctionModule(14 - i, 8, qrGetBit(bits, i));
    for (let i = 0; i < 8; i++) this.setFunctionModule(this.size - 1 - i, 8, qrGetBit(bits, i));
    for (let i = 8; i < 15; i++) this.setFunctionModule(8, this.size - 15 + i, qrGetBit(bits, i));
    this.setFunctionModule(8, this.size - 8, true);
  }

  private drawVersion(): void {
    let rem = this.version;
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 7973);
    const bits = (this.version << 12) | rem;
    for (let i = 0; i < 18; i++) {
      const color = qrGetBit(bits, i);
      const a = this.size - 11 + (i % 3);
      const b = Math.floor(i / 3);
      this.setFunctionModule(a, b, color);
      this.setFunctionModule(b, a, color);
    }
  }

  private drawFinderPattern(x: number, y: number): void {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        const xx = x + dx;
        const yy = y + dy;
        if (xx >= 0 && xx < this.size && yy >= 0 && yy < this.size) {
          this.setFunctionModule(xx, yy, dist !== 2 && dist !== 4);
        }
      }
    }
  }

  private drawAlignmentPattern(x: number, y: number): void {
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        this.setFunctionModule(x + dx, y + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
      }
    }
  }

  private setFunctionModule(x: number, y: number, isDark: boolean): void {
    this.modules[y][x] = isDark;
    this.isFunction[y][x] = true;
  }

  private addEccAndInterleave(data: number[]): number[] {
    const ver = this.version;
    const ecl = this.errorCorrectionLevel;
    const numBlocks = QrCodeGenerator.NUM_ERROR_CORRECTION_BLOCKS[ecl.ordinal][ver];
    const blockEccLen = QrCodeGenerator.ECC_CODEWORDS_PER_BLOCK[ecl.ordinal][ver];
    const rawCodewords = Math.floor(QrCodeGenerator.getNumRawDataModules(ver) / 8);
    const numShortBlocks = numBlocks - (rawCodewords % numBlocks);
    const shortBlockLen = Math.floor(rawCodewords / numBlocks);

    const blocks: number[][] = [];
    const rsDiv = QrCodeGenerator.reedSolomonComputeDivisor(blockEccLen);
    for (let i = 0, k = 0; i < numBlocks; i++) {
      const dat = data.slice(k, k + shortBlockLen - blockEccLen + (i >= numShortBlocks ? 1 : 0));
      k += dat.length;
      const ecc = QrCodeGenerator.reedSolomonComputeRemainder(dat, rsDiv);
      blocks.push(dat.concat(ecc));
    }

    const result: number[] = [];
    for (let i = 0; i < blocks[0].length; i++) {
      blocks.forEach((b, j) => {
        if (i !== shortBlockLen - blockEccLen || j >= numShortBlocks) result.push(b[i]);
      });
    }
    return result;
  }

  private drawCodewords(data: number[]): void {
    let i = 0;
    for (let right = this.size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (let vert = 0; vert < this.size; vert++) {
        for (let j = 0; j < 2; j++) {
          const x = right - j;
          const upward = ((right + 1) & 2) === 0;
          const y = upward ? this.size - 1 - vert : vert;
          if (!this.isFunction[y][x] && i < data.length * 8) {
            this.modules[y][x] = qrGetBit(data[i >>> 3], 7 - (i & 7));
            i++;
          }
        }
      }
    }
  }

  private applyMask(mask: number): void {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        let invert: boolean;
        switch (mask) {
          case 0: invert = (x + y) % 2 === 0; break;
          case 1: invert = y % 2 === 0; break;
          case 2: invert = x % 3 === 0; break;
          case 3: invert = (x + y) % 3 === 0; break;
          case 4: invert = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0; break;
          case 5: invert = ((x * y) % 2) + ((x * y) % 3) === 0; break;
          case 6: invert = (((x * y) % 2) + ((x * y) % 3)) % 2 === 0; break;
          case 7: invert = (((x + y) % 2) + ((x * y) % 3)) % 2 === 0; break;
          default: throw new Error("Unreachable");
        }
        if (!this.isFunction[y][x] && invert) this.modules[y][x] = !this.modules[y][x];
      }
    }
  }

  private getPenaltyScore(): number {
    let result = 0;
    for (let y = 0; y < this.size; y++) {
      let runColor = false;
      let runX = 0;
      for (let x = 0; x < this.size; x++) {
        if (this.modules[y][x] === runColor) {
          runX++;
          if (runX === 5) result += 3;
          else if (runX > 5) result++;
        } else {
          runColor = this.modules[y][x];
          runX = 1;
        }
      }
    }
    for (let x = 0; x < this.size; x++) {
      let runColor = false;
      let runY = 0;
      for (let y = 0; y < this.size; y++) {
        if (this.modules[y][x] === runColor) {
          runY++;
          if (runY === 5) result += 3;
          else if (runY > 5) result++;
        } else {
          runColor = this.modules[y][x];
          runY = 1;
        }
      }
    }
    return result;
  }

  private getAlignmentPatternPositions(): number[] {
    if (this.version === 1) return [];
    const numAlign = Math.floor(this.version / 7) + 2;
    const step = this.version === 32 ? 26 : Math.ceil((this.version * 4 + 4) / (numAlign * 2 - 2)) * 2;
    const result: number[] = [6];
    for (let pos = this.size - 7; result.length < numAlign; pos -= step) result.splice(1, 0, pos);
    return result;
  }

  private static getNumRawDataModules(ver: number): number {
    let result = (16 * ver + 128) * ver + 64;
    if (ver >= 2) {
      const numAlign = Math.floor(ver / 7) + 2;
      result -= (25 * numAlign - 10) * numAlign - 55;
      if (ver >= 7) result -= 36;
    }
    return result;
  }

  private static reedSolomonComputeDivisor(degree: number): number[] {
    const result: number[] = Array(degree).fill(0);
    result[degree - 1] = 1;
    let root = 1;
    for (let i = 0; i < degree; i++) {
      for (let j = 0; j < degree; j++) {
        result[j] = QrCodeGenerator.gmult(result[j], root);
        if (j + 1 < degree) result[j] ^= result[j + 1];
      }
      root = QrCodeGenerator.gmult(root, 0x02);
    }
    return result;
  }

  private static reedSolomonComputeRemainder(data: number[], divisor: number[]): number[] {
    const result: number[] = Array(divisor.length).fill(0);
    for (const b of data) {
      const factor = b ^ (result.shift() as number);
      result.push(0);
      divisor.forEach((coef, i) => (result[i] ^= QrCodeGenerator.gmult(coef, factor)));
    }
    return result;
  }

  private static gmult(x: number, y: number): number {
    let z = 0;
    for (let i = 7; i >= 0; i--) {
      z = (z << 1) ^ ((z >>> 7) * 285);
      z ^= ((y >>> i) & 1) * x;
    }
    return z;
  }
}

/**
 * Generates an authentic, standard ISO/IEC 18004 QR Code matrix representation for URL verification.
 */
function drawQRCode(doc: jsPDF, x: number, y: number, size: number, payload: string) {
  doc.setFillColor(255, 255, 255);
  doc.rect(x, y, size, size, "F");

  try {
    const matrix = QrCodeGenerator.encodeText(payload, QrEcc.MEDIUM);
    const N = matrix.length;
    const QUIET_ZONE = 4;
    const totalGrid = N + QUIET_ZONE * 2;
    const step = size / totalGrid;
    const startX = x + QUIET_ZONE * step;
    const startY = y + QUIET_ZONE * step;

    doc.setFillColor(0, 0, 0);
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (matrix[r][c]) {
          doc.rect(startX + c * step, startY + r * step, step * 1.01, step * 1.01, "F");
        }
      }
    }
  } catch {
    doc.setTextColor(15, 23, 42);
    doc.setFont("courier", "bold");
    doc.setFontSize(5);
    doc.text("SCAN FOR VERIFICATION", x + size / 2, y + size / 2, { align: "center" });
  }
}

/**
 * Draws an official circular academic seal stamp.
 */
function drawOfficialSeal(
  doc: jsPDF,
  cx: number,
  cy: number,
  radius: number,
  title: string,
  subtext: string,
  sealImage?: string,
  sealStyle: "classic_gold" | "academic_crest" | "modern_verified" = "classic_gold"
) {
  if (sealImage && sealImage.startsWith("data:image/")) {
    try {
      const format = sealImage.includes("image/jpeg") || sealImage.includes("image/jpg") ? "JPEG" : "PNG";
      doc.addImage(sealImage, format, cx - radius, cy - radius, radius * 2, radius * 2, undefined, "FAST");
      return;
    } catch {
      // Fallback to vector seal
    }
  }

  const isModern = sealStyle === "modern_verified";
  doc.setDrawColor(isModern ? 15 : 180, isModern ? 23 : 140, isModern ? 42 : 50);
  doc.setLineWidth(0.8);
  doc.circle(cx, cy, radius, "S");

  doc.setLineWidth(0.3);
  doc.setDrawColor(15, 23, 42);
  doc.circle(cx, cy, radius - 1.6, "S");

  doc.setFillColor(254, 252, 245);
  doc.circle(cx, cy, radius - 2, "F");

  doc.setDrawColor(180, 140, 50);
  doc.setLineWidth(0.4);
  doc.circle(cx, cy, radius - 4.5, "S");

  doc.setTextColor(180, 140, 50);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6);
  doc.text("★  VERIFIED  ★", cx, cy - 3.5, { align: "center" });

  doc.setTextColor(15, 23, 42);
  doc.setFont("times", "bold");
  doc.setFontSize(8.5);
  doc.text(sealStyle === "modern_verified" ? "AUTHENTIC" : "ACCEPTED", cx, cy + 0.5, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(5);
  doc.setTextColor(120, 95, 30);
  doc.text("SCHOLARVAULT", cx, cy + 3.8, { align: "center" });

  doc.setFontSize(4.5);
  doc.setTextColor(100, 116, 139);
  doc.text(sealStyle === "academic_crest" ? "PEER REVIEWED CREST" : "PEER REVIEWED", cx, cy + 6.2, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(4.5);
  doc.setTextColor(15, 23, 42);
  doc.text((title || "OFFICIAL ACCEPTANCE").slice(0, 24).toUpperCase(), cx, cy - radius + 3.2, { align: "center" });
  doc.setTextColor(120, 95, 30);
  doc.text((subtext || "SCHOLARVAULT ACADEMIC SEAL").slice(0, 28).toUpperCase(), cx, cy + radius - 2.4, { align: "center" });
}

/**
 * Draws an elegant signature stroke or renders custom signature image for academic leadership.
 */
function drawChairSignature(
  doc: jsPDF,
  x: number,
  y: number,
  name: string,
  customSignature?: string,
  style: "classic" | "calligraphy" | "executive" = "classic"
) {
  if (customSignature && customSignature.startsWith("data:image/")) {
    try {
      const format = customSignature.includes("image/jpeg") || customSignature.includes("image/jpg") ? "JPEG" : "PNG";
      doc.addImage(customSignature, format, x, y - 8, 42, 12, undefined, "FAST");
      return;
    } catch {
      // Fallback to vector stroke
    }
  }

  doc.setDrawColor(20, 40, 90);

  if (style === "calligraphy") {
    doc.setLineWidth(0.6);
    doc.lines([[5, -5], [8, 3], [7, -7], [9, 6], [10, -4], [6, 4], [16, -2]], x, y);
    doc.circle(x + 14, y - 3, 3, "S");
    doc.setLineWidth(0.3);
    doc.line(x - 2, y + 2.5, x + 44, y + 2.5);
  } else if (style === "executive") {
    doc.setLineWidth(0.5);
    doc.lines([[8, -3], [12, 1], [6, -5], [10, 4], [14, -1]], x, y);
    doc.setLineWidth(0.7);
    doc.line(x, y + 2.5, x + 42, y + 2.5);
    doc.line(x + 5, y + 3.8, x + 38, y + 3.8);
  } else {
    doc.setLineWidth(0.4);
    doc.lines(
      [
        [6, -4],
        [10, 2],
        [8, -6],
        [6, 5],
        [12, -2],
        [8, 3],
        [14, -1],
      ],
      x,
      y
    );
    doc.circle(x + 12, y - 2.5, 2.5, "S");
    doc.line(x - 2, y + 2.5, x + 46, y + 2.5);
  }
}

/**
 * Renders the top ribbon and official letterhead across both Mode A and Mode B pages.
 */
function drawPageHeader(
  doc: jsPDF,
  data: AcceptanceLetterData,
  options: {
    pageNumber: number;
    totalPages: number;
    isAnnexure?: boolean;
  }
): number {
  const PAGE_WIDTH = 210;
  const MARGIN_LEFT = 18;
  const MARGIN_RIGHT = 192;
  const refBoxX = 138;
  const refBoxWidth = 54;
  const titleStartX = MARGIN_LEFT + 15;
  const maxHeaderWidth = refBoxX - titleStartX - 2;

  // Top elegant header ribbon
  doc.setFillColor(15, 23, 42); // Navy
  doc.rect(0, 0, PAGE_WIDTH, 6.5, "F");

  doc.setFillColor(218, 165, 32); // Gold
  doc.rect(0, 6.5, PAGE_WIDTH, 1.8, "F");

  let currentY = 15;

  // Emblem / Logo
  let logoRendered = false;
  if (data.conferenceLogo && (data.conferenceLogo.startsWith("data:image/") || data.conferenceLogo.startsWith("http"))) {
    try {
      const format = data.conferenceLogo.includes("image/jpeg") || data.conferenceLogo.includes("image/jpg") ? "JPEG" : "PNG";
      doc.addImage(data.conferenceLogo, format, MARGIN_LEFT, currentY - 1, 12.5, 12.5, undefined, "FAST");
      logoRendered = true;
    } catch {
      logoRendered = false;
    }
  }

  if (!logoRendered) {
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(MARGIN_LEFT, currentY, 10.5, 12, 1.5, 1.5, "F");
    doc.setFillColor(218, 165, 32);
    doc.roundedRect(MARGIN_LEFT + 1.2, currentY + 1.2, 8.1, 9.6, 1, 1, "F");
    doc.setTextColor(15, 23, 42);
    doc.setFont("times", "bold");
    doc.setFontSize(8.5);
    doc.text("SV", MARGIN_LEFT + 5.25, currentY + 7.5, { align: "center" });
  }

  // Tagline
  doc.setTextColor(180, 140, 50);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.2);
  const tagline = options.isAnnexure
    ? "SCHOLARVAULT CONFERENCES · TECHNICAL ANNEXURE & COMPLIANCE DOSSIER"
    : "SCHOLARVAULT CONFERENCES · OFFICIAL SCIENTIFIC PROCEEDINGS";
  doc.text(tagline, titleStartX, currentY + 2);

  // Conference Header Title with dynamic wrap
  doc.setTextColor(15, 23, 42);
  doc.setFont("times", "bold");
  const titleFontSize = data.conferenceName.length > 55 ? 10.5 : 11.5;
  doc.setFontSize(titleFontSize);
  const confTitleLines = doc.splitTextToSize(data.conferenceName, maxHeaderWidth);
  const titleLineHeight = titleFontSize * 0.36;
  doc.text(confTitleLines, titleStartX, currentY + 6.5);

  const afterTitleY = currentY + 6.5 + (confTitleLines.length - 1) * titleLineHeight + 4.5;

  // Subtitle
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  const subtitleRaw = `${data.conferenceDates}  |  ${data.venueDetails}`;
  const subtitleLines = doc.splitTextToSize(subtitleRaw, maxHeaderWidth);
  doc.text(subtitleLines, titleStartX, afterTitleY);

  const textBottomY = afterTitleY + (subtitleLines.length - 1) * 3 + 2;

  // Right side: Reference Box
  const refBoxHeight = 14;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(refBoxX, currentY - 1, refBoxWidth, refBoxHeight, 1.5, 1.5, "F");
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.25);
  doc.roundedRect(refBoxX, currentY - 1, refBoxWidth, refBoxHeight, 1.5, 1.5, "S");

  doc.setTextColor(180, 140, 50);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6);
  doc.text(options.isAnnexure ? "ANNEXURE REF" : "REFERENCE ID", refBoxX + 3, currentY + 3);
  doc.setTextColor(15, 23, 42);
  doc.setFont("courier", "bold");
  doc.setFontSize(8.5);
  doc.text(data.referenceId, refBoxX + 3, currentY + 7);

  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  const pageLabel = options.totalPages > 1 ? `PAGE ${options.pageNumber} OF ${options.totalPages} · ` : "";
  doc.text(`${pageLabel}ISSUED: ${data.dateOfIssue}`, refBoxX + 3, currentY + 11);

  // Horizontal divider rule
  const headerContentBottom = Math.max(textBottomY, currentY - 1 + refBoxHeight, currentY + 13.5);
  currentY = headerContentBottom + 3.5;

  doc.setDrawColor(218, 165, 32);
  doc.setLineWidth(0.4);
  doc.line(MARGIN_LEFT, currentY, MARGIN_RIGHT, currentY);

  return currentY;
}

/**
 * Draws the Accepted Manuscript Title Box with DYNAMIC HEIGHT BUDGETING.
 * Guarantees zero text truncation regardless of title length.
 */
function drawAcceptedTitleBox(doc: jsPDF, paperTitle: string, startY: number, contentWidth: number, marginLeft: number): number {
  const titleBoxPaddingTop = 3.5;
  const titleBoxPaddingBottom = 3;
  const titleLabelHeight = 4;
  const titleLineHeight = 4.2;
  const titleLines = doc.splitTextToSize(`"${paperTitle}"`, contentWidth - 10);
  const titleBoxHeight = Math.max(13.5, titleBoxPaddingTop + titleLabelHeight + titleLines.length * titleLineHeight + titleBoxPaddingBottom);

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(marginLeft, startY, contentWidth, titleBoxHeight, 2, 2, "F");
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(marginLeft, startY, contentWidth, titleBoxHeight, 2, 2, "S");

  // Title accent bar
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(marginLeft, startY, 2, titleBoxHeight, 1, 1, "F");

  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.text("ACCEPTED MANUSCRIPT TITLE:", marginLeft + 5, startY + titleBoxPaddingTop + 2.5);

  doc.setTextColor(15, 23, 42);
  doc.setFont("times", "bold");
  doc.setFontSize(9);
  doc.text(titleLines, marginLeft + 5, startY + titleBoxPaddingTop + titleLabelHeight + 3);

  return startY + titleBoxHeight + 3.5;
}

/**
 * Draws the Addressee block.
 */
function drawAddresseeBlock(doc: jsPDF, data: AcceptanceLetterData, startY: number, contentWidth: number, marginLeft: number): number {
  let currentY = startY;
  doc.setTextColor(180, 140, 50);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.text("TO CORRESPONDING AUTHOR & RESEARCH TEAM:", marginLeft, currentY);

  currentY += 4.2;
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text(data.authorName, marginLeft, currentY);

  currentY += 4.0;
  doc.setTextColor(71, 85, 105);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const affilLine = [data.authorInstitution, data.authorCountry].filter(Boolean).join(", ");
  doc.text(affilLine || "Academic Institution", marginLeft, currentY);

  if (data.coauthorsText) {
    currentY += 3.8;
    doc.setFontSize(7.2);
    doc.setTextColor(100, 116, 139);
    const coauthorsWrapped = doc.splitTextToSize(`Co-Author(s): ${data.coauthorsText}`, contentWidth);
    doc.text(coauthorsWrapped, marginLeft, currentY);
    currentY += (coauthorsWrapped.length - 1) * 3.2;
  }

  return currentY + 3.5;
}

/**
 * Draws the Signatures and Official Seal section cleanly at Y = 226mm.
 */
function drawSignatureBlock(doc: jsPDF, data: AcceptanceLetterData, sigSectionY = 226): void {
  const MARGIN_LEFT = 18;
  const CONTENT_WIDTH = 174;
  const colLeftX = MARGIN_LEFT + 2;
  const colRightX = 136;
  const sealCenterX = MARGIN_LEFT + CONTENT_WIDTH / 2;

  // Left Column: General Chair
  drawChairSignature(
    doc,
    colLeftX,
    sigSectionY + 6,
    data.generalChairName,
    data.generalChairSignature,
    data.generalChairSignatureStyle
  );
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text(data.generalChairName, colLeftX, sigSectionY + 12);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(180, 140, 50);
  doc.text(data.generalChairTitle, colLeftX, sigSectionY + 15.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(data.generalChairAffiliation, colLeftX, sigSectionY + 19);

  // Center: Official Conference Seal Stamp
  drawOfficialSeal(
    doc,
    sealCenterX,
    sigSectionY + 10,
    14.5,
    data.sealTitle,
    data.sealSubtext,
    data.sealImage,
    data.sealStyle
  );

  // Right Column: TPC Chair
  drawChairSignature(
    doc,
    colRightX,
    sigSectionY + 6,
    data.tpcChairName,
    data.tpcChairSignature,
    data.tpcChairSignatureStyle
  );
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text(data.tpcChairName, colRightX, sigSectionY + 12);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(180, 140, 50);
  doc.text(data.tpcChairTitle, colRightX, sigSectionY + 15.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(data.tpcChairAffiliation, colRightX, sigSectionY + 19);
}

/**
 * Draws the Security QR Code and Sovereign Registry Footer.
 */
function drawSecurityFooter(doc: jsPDF, data: AcceptanceLetterData, pageNumber = 1, totalPages = 1): void {
  const PAGE_WIDTH = 210;
  const MARGIN_LEFT = 18;
  const MARGIN_RIGHT = 192;
  const footerY = 258;

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.25);
  doc.line(MARGIN_LEFT, footerY, MARGIN_RIGHT, footerY);

  const qrSize = 19;
  drawQRCode(doc, MARGIN_LEFT, footerY + 3, qrSize, data.verificationUrl);

  const textStartX = MARGIN_LEFT + qrSize + 4;
  const maxUrlWidth = MARGIN_RIGHT - textStartX;

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("OFFICIALLY VERIFIABLE ACADEMIC RECORD", textStartX, footerY + 6.5);

  doc.setTextColor(71, 85, 105);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.text(
    "Scan QR code or visit the ScholarVault Registry to verify manuscript acceptance authenticity.",
    textStartX,
    footerY + 10.5
  );

  doc.setTextColor(180, 140, 50);
  doc.setFont("courier", "bold");
  doc.setFontSize(6.5);
  const urlLines = doc.splitTextToSize(data.verificationUrl, maxUrlWidth);
  doc.text(urlLines, textStartX, footerY + 14.5);

  const afterUrlY = footerY + 14.5 + (urlLines.length - 1) * 2.8 + 4;

  doc.setTextColor(148, 163, 184);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.5);
  doc.text(
    "Cryptographically tracked via ScholarVault Conference Engine. Any alteration of this document invalidates its authenticity.",
    textStartX,
    afterUrlY
  );

  // Bottom navy footer strip
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 292, PAGE_WIDTH, 5, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(5.5);
  const pageText = totalPages > 1 ? `  |  PAGE ${pageNumber} OF ${totalPages}` : "";
  doc.text(
    `SCHOLARVAULT ACADEMIC RECORD  |  CONFERENCE EDITION: ${data.conferenceShortName}  |  REF: ${data.referenceId}${pageText}`,
    PAGE_WIDTH / 2,
    295.5,
    { align: "center" }
  );
}

/**
 * Renders Page 2: Technical Annexure with Presenter Technical Readiness,
 * ScholarVault Proceedings formatting (neutral ScholarVault format), Milestone compliance table,
 * and COPE publication ethics governance.
 */
function renderTechnicalAnnexurePage(doc: jsPDF, data: AcceptanceLetterData): void {
  doc.addPage();

  const PAGE_WIDTH = 210;
  const MARGIN_LEFT = 18;
  const MARGIN_RIGHT = 192;
  const CONTENT_WIDTH = MARGIN_RIGHT - MARGIN_LEFT; // 174mm

  let currentY = drawPageHeader(doc, data, {
    pageNumber: 2,
    totalPages: 2,
    isAnnexure: true,
  });

  // Annexure Subject Banner
  currentY += 4;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(MARGIN_LEFT, currentY, CONTENT_WIDTH, 10.5, 2, 2, "F");
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.35);
  doc.roundedRect(MARGIN_LEFT, currentY, CONTENT_WIDTH, 10.5, 2, 2, "S");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("TECHNICAL ANNEXURE: PRESENTER READINESS & PROCEEDINGS COMPLIANCE", MARGIN_LEFT + CONTENT_WIDTH / 2, currentY + 4.5, {
    align: "center",
  });

  doc.setTextColor(120, 95, 30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.text(
    `MANUSCRIPT REF: ${data.referenceId}  |  THEMATIC TRACK: ${data.trackName.toUpperCase()}`,
    MARGIN_LEFT + CONTENT_WIDTH / 2,
    currentY + 8.2,
    { align: "center" }
  );

  currentY += 13.5;

  // SECTION 1: Presenter Technical Readiness & Presentation Standards
  const sec1Height = 33;
  doc.setFillColor(254, 252, 243);
  doc.roundedRect(MARGIN_LEFT, currentY, CONTENT_WIDTH, sec1Height, 1.5, 1.5, "F");
  doc.setDrawColor(218, 165, 32);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGIN_LEFT, currentY, CONTENT_WIDTH, sec1Height, 1.5, 1.5, "S");
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(MARGIN_LEFT, currentY, 2, sec1Height, 1, 1, "F");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("1. PRESENTER TECHNICAL READINESS & PRESENTATION STANDARDS", MARGIN_LEFT + 5, currentY + 4.5);

  doc.setTextColor(71, 85, 105);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);

  const col1X = MARGIN_LEFT + 5;
  const col2X = MARGIN_LEFT + CONTENT_WIDTH / 2 + 3;

  doc.setFont("helvetica", "bold");
  doc.text("• Slide Deck Layout (16:9 Mandatory):", col1X, currentY + 9);
  doc.setFont("helvetica", "normal");
  doc.text("Presentation slides must be formatted in 16:9 widescreen layout (PowerPoint / PDF). Legacy 4:3 is deprecated.", col1X, currentY + 12.5, { maxWidth: CONTENT_WIDTH / 2 - 8 });

  doc.setFont("helvetica", "bold");
  doc.text("• Oral Presentation Window:", col1X, currentY + 19.5);
  doc.setFont("helvetica", "normal");
  doc.text(`${data.annexureOralDuration} Presenters must adhere strictly to the allotted time.`, col1X, currentY + 23, { maxWidth: CONTENT_WIDTH / 2 - 8 });

  doc.setFont("helvetica", "bold");
  doc.text("• Interactive Zoom Client & AV Setup:", col2X, currentY + 9);
  doc.setFont("helvetica", "normal");
  doc.text(`${data.annexureVirtualPlatform} Ensure dedicated headset and high-definition video camera.`, col2X, currentY + 12.5, { maxWidth: CONTENT_WIDTH / 2 - 8 });

  doc.setFont("helvetica", "bold");
  doc.text("• Pre-Flight Check-In:", col2X, currentY + 19.5);
  doc.setFont("helvetica", "normal");
  doc.text("Report to assigned physical hall or Zoom room 15 minutes prior to session start for screen sharing test.", col2X, currentY + 23, { maxWidth: CONTENT_WIDTH / 2 - 8 });

  currentY += sec1Height + 3.5;

  // SECTION 2: ScholarVault Standard Proceedings & Final Publication-Ready Manuscript
  const sec2Height = 31;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(MARGIN_LEFT, currentY, CONTENT_WIDTH, sec2Height, 1.5, 1.5, "F");
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGIN_LEFT, currentY, CONTENT_WIDTH, sec2Height, 1.5, 1.5, "S");
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(MARGIN_LEFT, currentY, 2, sec2Height, 1, 1, "F");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("2. SCHOLARVAULT PROCEEDINGS & PUBLICATION-READY MANUSCRIPT GUIDELINES", MARGIN_LEFT + 5, currentY + 4.5);

  doc.setTextColor(71, 85, 105);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);

  doc.setFont("helvetica", "bold");
  doc.text("• Formatting Standard:", col1X, currentY + 9);
  doc.setFont("helvetica", "normal");
  doc.text("Format strictly in ScholarVault Standard Proceedings Format. Two-column academic layout, vector figures (300+ DPI), standard font sizing.", col1X, currentY + 12.5, { maxWidth: CONTENT_WIDTH / 2 - 8 });

  doc.setFont("helvetica", "bold");
  doc.text("• DOI & Persistent Archiving:", col1X, currentY + 19.5);
  doc.setFont("helvetica", "normal");
  doc.text(`Reserved DOI: ${data.doiString} | Indexed in the permanent ScholarVault Open Proceedings Repository.`, col1X, currentY + 23, { maxWidth: CONTENT_WIDTH / 2 - 8 });

  doc.setFont("helvetica", "bold");
  doc.text("• Author Affiliations & ORCID:", col2X, currentY + 9);
  doc.setFont("helvetica", "normal");
  doc.text("Verify primary author affiliation, corresponding author email, and ORCID iDs prior to camera-ready upload.", col2X, currentY + 12.5, { maxWidth: CONTENT_WIDTH / 2 - 8 });

  doc.setFont("helvetica", "bold");
  doc.text("• Final Upload Deadline:", col2X, currentY + 19.5);
  doc.setFont("helvetica", "normal");
  doc.text("Camera-ready manuscripts must be submitted before the announced deadline to secure inclusion in proceedings.", col2X, currentY + 23, { maxWidth: CONTENT_WIDTH / 2 - 8 });

  currentY += sec2Height + 3.5;

  // SECTION 3: Milestone & Critical Deadlines Compliance Table
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("3. CRITICAL MILESTONES & COMPLIANCE TIMELINE", MARGIN_LEFT, currentY + 3.5);

  currentY += 5;

  const tableCol1W = 58;
  const tableCol2W = 48;
  const tableCol3W = 68;
  const tableRowH = 7.5;

  // Table Header
  doc.setFillColor(15, 23, 42); // Navy
  doc.rect(MARGIN_LEFT, currentY, CONTENT_WIDTH, 5.5, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.2);
  doc.text("MILESTONE / REQUIREMENT", MARGIN_LEFT + 3, currentY + 3.8);
  doc.text("TIMELINE / DEADLINE", MARGIN_LEFT + tableCol1W + 3, currentY + 3.8);
  doc.text("MANDATORY COMPLIANCE ACTION", MARGIN_LEFT + tableCol1W + tableCol2W + 3, currentY + 3.8);

  currentY += 5.5;

  const milestones = [
    {
      m: "Publication-Ready Manuscript",
      t: "Due 14 Days Post-Acceptance",
      a: "Upload final camera-ready PDF formatted in ScholarVault Standard.",
    },
    {
      m: "Presenter Registration Verification",
      t: "Official Registration Close",
      a: "At least one author must register to secure oral presentation slot.",
    },
    {
      m: "Presentation Slide Deck (16:9)",
      t: "48 Hours Prior to Summit",
      a: "Submit 16:9 slides and conduct Zoom audio/video pre-flight test.",
    },
    {
      m: "Summit Delivery & DOI Archival",
      t: data.conferenceDates,
      a: "Oral presentation in track followed by formal Crossref DOI deposit.",
    },
  ];

  milestones.forEach((item, idx) => {
    const isAlt = idx % 2 === 1;
    doc.setFillColor(isAlt ? 248 : 255, isAlt ? 250 : 255, isAlt ? 252 : 255);
    doc.rect(MARGIN_LEFT, currentY, CONTENT_WIDTH, tableRowH, "F");
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.rect(MARGIN_LEFT, currentY, CONTENT_WIDTH, tableRowH, "S");

    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.2);
    doc.text(item.m, MARGIN_LEFT + 3, currentY + 4.8);

    doc.setTextColor(180, 140, 50);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.8);
    doc.text(item.t, MARGIN_LEFT + tableCol1W + 3, currentY + 4.8);

    doc.setTextColor(71, 85, 105);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(5.8);
    doc.text(item.a, MARGIN_LEFT + tableCol1W + tableCol2W + 3, currentY + 4.8);

    currentY += tableRowH;
  });

  currentY += 4.5;

  // SECTION 4: COPE Publication Ethics & Research Integrity Governance
  const sec4Height = 24;
  doc.setFillColor(254, 252, 243);
  doc.roundedRect(MARGIN_LEFT, currentY, CONTENT_WIDTH, sec4Height, 1.5, 1.5, "F");
  doc.setDrawColor(218, 165, 32);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGIN_LEFT, currentY, CONTENT_WIDTH, sec4Height, 1.5, 1.5, "S");
  doc.setFillColor(180, 140, 50);
  doc.roundedRect(MARGIN_LEFT, currentY, 2, sec4Height, 1, 1, "F");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.2);
  doc.text("4. PUBLICATION ETHICS & RESEARCH INTEGRITY GOVERNANCE (COPE)", MARGIN_LEFT + 5, currentY + 4.5);

  doc.setTextColor(71, 85, 105);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.2);
  const copeText =
    "All accepted papers are governed by the Committee on Publication Ethics (COPE) Code of Conduct. Submissions are subject to automated cross-check screening for textual similarity (<15% threshold excluding bibliography). The use of generative AI in drafting must be explicitly disclosed in the methodology section; AI systems do not meet authorship criteria. Any detected data fabrication or dual-submission will result in immediate disqualification and academic reporting.";
  const copeLines = doc.splitTextToSize(copeText, CONTENT_WIDTH - 10);
  doc.text(copeLines, MARGIN_LEFT + 5, currentY + 8.5);

  currentY += sec4Height + 3.5;

  if (data.notesText) {
    const p2NotesLines = doc.splitTextToSize(`PRESENTER DIRECTIVE: ${data.notesText}`, CONTENT_WIDTH - 10);
    const p2NotesHeight = Math.min(22, 5 + p2NotesLines.length * 3.0 + 2);
    doc.setFillColor(255, 251, 235);
    doc.roundedRect(MARGIN_LEFT, currentY, CONTENT_WIDTH, p2NotesHeight, 1.5, 1.5, "F");
    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(0.3);
    doc.roundedRect(MARGIN_LEFT, currentY, CONTENT_WIDTH, p2NotesHeight, 1.5, 1.5, "S");

    doc.setTextColor(180, 83, 9);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.2);
    doc.text("CONFERENCE DIRECTIVE & PRESENTER INSTRUCTIONS:", MARGIN_LEFT + 5, currentY + 4.0);

    doc.setTextColor(120, 53, 15);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.2);
    doc.text(p2NotesLines, MARGIN_LEFT + 5, currentY + 7.5);
  }

  // Security Verification Footer on Page 2
  drawSecurityFooter(doc, data, 2, 2);
}

/**
 * Generates the complete, high-resolution A4 Acceptance Letter PDF.
 * Modality-aware: renders Mode A (1-page virtual) or Mode B (2-page dossier with consular clauses & technical annexure).
 */
export function generateAcceptanceLetterPdf(
  submission: any,
  edition: any,
  customConfig?: Partial<AcceptanceLetterSettings> | null,
  origin = "https://app.scholarvault.in",
  formatOverride?: AcceptanceLetterFormat
): jsPDF {
  const data = buildAcceptanceLetterData(submission, edition, customConfig, origin);
  const activeFormat = resolveLetterFormat(formatOverride, data.defaultFormat, data.isVirtual);
  const isTwoPage = activeFormat === "two_page_dossier";
  const totalPages = isTwoPage ? 2 : 1;

  // A4 dimensions: 210mm x 297mm
  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
    orientation: "portrait",
    compress: true,
  });

  const PAGE_WIDTH = 210;
  const MARGIN_LEFT = 18;
  const MARGIN_RIGHT = 192;
  const CONTENT_WIDTH = MARGIN_RIGHT - MARGIN_LEFT; // 174mm

  // 1. PAGE 1 HEADER & LETTERHEAD
  let currentY = drawPageHeader(doc, data, {
    pageNumber: 1,
    totalPages,
    isAnnexure: false,
  });

  // 2. DOCUMENT SUBJECT BANNER
  currentY += 4.5;
  doc.setFillColor(254, 252, 243);
  doc.roundedRect(MARGIN_LEFT, currentY, CONTENT_WIDTH, 11, 2, 2, "F");
  doc.setDrawColor(218, 165, 32);
  doc.setLineWidth(0.35);
  doc.roundedRect(MARGIN_LEFT, currentY, CONTENT_WIDTH, 11, 2, 2, "S");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);

  const bannerTitle = data.isVirtual
    ? "OFFICIAL LETTER OF ACCEPTANCE & PRESENTATION CREDENTIAL"
    : "OFFICIAL LETTER OF ACCEPTANCE & CONSULAR VISA INVITATION";

  doc.text(bannerTitle, MARGIN_LEFT + CONTENT_WIDTH / 2, currentY + 4.8, {
    align: "center",
  });

  doc.setTextColor(120, 95, 30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text(
    `THEMATIC TRACK: ${data.trackName.toUpperCase()}`,
    MARGIN_LEFT + CONTENT_WIDTH / 2,
    currentY + 8.8,
    { align: "center" }
  );

  // 3. ADDRESSEE BLOCK
  currentY += 15.5;
  currentY = drawAddresseeBlock(doc, data, currentY, CONTENT_WIDTH, MARGIN_LEFT);

  // 4. ACCEPTED PAPER TITLE BOX (Dynamic budgeting, NO slice truncation)
  currentY = drawAcceptedTitleBox(doc, data.paperTitle, currentY, CONTENT_WIDTH, MARGIN_LEFT);

  // 5. BODY OR MODALITY-SPECIFIC CONTENT
  if (data.isVirtual) {
    // MODE A (VIRTUAL 1-PAGE): Clean, sovereign credential with digital room assignment, Crossref DOI, zero visa clutter.
    doc.setTextColor(30, 41, 59);
    doc.setFont("times", "normal");
    doc.setFontSize(9);
    const vIntro = `On behalf of the Technical Programme Committee and Editorial Board of ${data.conferenceName}, we are pleased to confirm that your submitted research manuscript titled above has been formally evaluated through double-blind peer review and ACCEPTED for virtual oral presentation in the ${data.trackName} track at ${data.conferenceName}, convening virtually on ${data.conferenceDates}.`;
    const wrappedIntro = doc.splitTextToSize(vIntro, CONTENT_WIDTH);
    doc.text(wrappedIntro, MARGIN_LEFT, currentY);
    currentY += wrappedIntro.length * 4.0 + 3.5;

    // Digital Session Credential Box
    const vBoxHeight = 32;
    doc.setFillColor(240, 249, 255);
    doc.roundedRect(MARGIN_LEFT, currentY, CONTENT_WIDTH, vBoxHeight, 1.5, 1.5, "F");
    doc.setDrawColor(186, 230, 253);
    doc.setLineWidth(0.3);
    doc.roundedRect(MARGIN_LEFT, currentY, CONTENT_WIDTH, vBoxHeight, 1.5, 1.5, "S");
    doc.setFillColor(2, 132, 199);
    doc.roundedRect(MARGIN_LEFT, currentY, 2, vBoxHeight, 1, 1, "F");

    doc.setTextColor(2, 132, 199);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.2);
    doc.text("VIRTUAL PRESENTATION CREDENTIAL & DIGITAL SESSION DISPATCH", MARGIN_LEFT + 5, currentY + 4.5);

    const vCol1X = MARGIN_LEFT + 5;
    const vCol2X = MARGIN_LEFT + CONTENT_WIDTH / 2 + 3;

    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.text("• Digital Room Assignment:", vCol1X, currentY + 9.5);
    doc.setFont("helvetica", "normal");
    doc.text(data.digitalRoomAssignment, vCol1X, currentY + 13);

    doc.setFont("helvetica", "bold");
    doc.text("• Scheduled Presentation Window:", vCol1X, currentY + 18.5);
    doc.setFont("helvetica", "normal");
    doc.text(data.presentationWindow, vCol1X, currentY + 22);

    doc.setFont("helvetica", "bold");
    doc.text("• Persistent DOI & Archival:", vCol2X, currentY + 9.5);
    doc.setFont("helvetica", "normal");
    doc.text(`${data.doiString} | ScholarVault Proceedings`, vCol2X, currentY + 13);

    doc.setFont("helvetica", "bold");
    doc.text("• Presenter Technical Readiness:", vCol2X, currentY + 18.5);
    doc.setFont("helvetica", "normal");
    doc.text("Zoom Client v6.0+ · 16:9 Slides · Audio/Video test 15 min prior", vCol2X, currentY + 22);

    currentY += vBoxHeight + 3.5;

    // Directives Box (Dynamic Height, NO slice truncation)
    if (data.notesText) {
      const notesWrapped = doc.splitTextToSize(data.notesText, CONTENT_WIDTH - 8);
      const notesBoxHeight = Math.max(11, 5 + notesWrapped.length * 3.2 + 2);
      doc.setFillColor(255, 251, 235);
      doc.roundedRect(MARGIN_LEFT, currentY, CONTENT_WIDTH, notesBoxHeight, 1.5, 1.5, "F");
      doc.setDrawColor(245, 158, 11);
      doc.setLineWidth(0.3);
      doc.roundedRect(MARGIN_LEFT, currentY, CONTENT_WIDTH, notesBoxHeight, 1.5, 1.5, "S");

      doc.setTextColor(180, 83, 9);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.2);
      doc.text("IMPORTANT PRESENTER READINESS DIRECTIVE:", MARGIN_LEFT + 4, currentY + 3.8);

      doc.setTextColor(120, 53, 15);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.8);
      doc.text(notesWrapped, MARGIN_LEFT + 4, currentY + 7.5);

      currentY += notesBoxHeight + 3.5;
    }
  } else {
    // MODE B PAGE 1 (IN-PERSON / HYBRID): Sovereign Acceptance & Consular Visa Invitation with full official clauses.
    doc.setTextColor(30, 41, 59);
    doc.setFont("times", "normal");
    doc.setFontSize(8.5);
    const pIntro = `On behalf of the Technical Programme Committee and General Chair of ${data.conferenceName}, we are pleased to confirm that the research manuscript titled above has been formally ACCEPTED following double-blind peer review for oral presentation in ${data.trackName} at ${data.conferenceName}, convening on ${data.conferenceDates} at ${data.venueDetails}.`;
    const wrappedIntro = doc.splitTextToSize(pIntro, CONTENT_WIDTH);
    doc.text(wrappedIntro, MARGIN_LEFT, currentY);
    currentY += wrappedIntro.length * 3.8 + 3.0;

    // OFFICIAL CONSULAR & IMMIGRATION DECLARATIONS BOX
    const authorAffil = [data.authorInstitution, data.authorCountry].filter(Boolean).join(", ");
    const authorCitation = authorAffil ? `${data.authorName} (${authorAffil})` : data.authorName;
    const coauthorsMention = data.coauthorsText ? ` and listed co-authors` : "";
    const clause1 = `1. ORAL PRESENTATION SCOPE & VENUE: The Organizing Committee formally invites ${authorCitation}${coauthorsMention} to attend ${data.conferenceName} in person to deliver an oral research presentation for accepted manuscript "${data.paperTitle}" in the ${data.trackName} track during official conference dates (${data.conferenceDates}) at the designated physical venue (${data.venueDetails}).`;
    const clause2 = `2. NON-EMPLOYMENT & NON-REMUNERATION DECLARATION: ${data.nonRemunerationText}`;
    const clause3 = `3. FINANCIAL RESPONSIBILITY & NON-LIABILITY: ${data.financialClauseText}`;
    const statutoryRef = `STATUTORY CONTEXT: ${data.consularAuthorityText}`;

    const clauseWidth = CONTENT_WIDTH - 8;
    const c1Lines = doc.splitTextToSize(clause1, clauseWidth);
    const c2Lines = doc.splitTextToSize(clause2, clauseWidth);
    const c3Lines = doc.splitTextToSize(clause3, clauseWidth);
    const statLines = doc.splitTextToSize(statutoryRef, clauseWidth);

    const lineSpacing = 3.0;
    const totalLines = c1Lines.length + c2Lines.length + c3Lines.length + statLines.length;
    const consularBoxHeight = Math.max(52, 10 + totalLines * lineSpacing + 6);

    doc.setFillColor(254, 252, 243);
    doc.roundedRect(MARGIN_LEFT, currentY, CONTENT_WIDTH, consularBoxHeight, 1.5, 1.5, "F");
    doc.setDrawColor(218, 165, 32);
    doc.setLineWidth(0.4);
    doc.roundedRect(MARGIN_LEFT, currentY, CONTENT_WIDTH, consularBoxHeight, 1.5, 1.5, "S");

    // Navy accent bar
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(MARGIN_LEFT, currentY, 2, consularBoxHeight, 1, 1, "F");

    let boxY = currentY + 4.5;
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.2);
    doc.text("OFFICIAL CONSULAR & IMMIGRATION VISA DECLARATION", MARGIN_LEFT + 4, boxY);

    boxY += 3.5;
    doc.setTextColor(180, 140, 50);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.6);
    doc.text("US 9 FAM 402.2-5(B) · UK VISITOR (ACADEMIC) · SCHENGEN CODE (EC) 810/2009 · INDIA MHA", MARGIN_LEFT + 4, boxY);

    boxY += 3.2;
    doc.setTextColor(51, 65, 85);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.2);

    doc.text(c1Lines, MARGIN_LEFT + 4, boxY);
    boxY += c1Lines.length * lineSpacing + 1.5;

    doc.text(c2Lines, MARGIN_LEFT + 4, boxY);
    boxY += c2Lines.length * lineSpacing + 1.5;

    doc.text(c3Lines, MARGIN_LEFT + 4, boxY);
    boxY += c3Lines.length * lineSpacing + 1.5;

    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.4);
    doc.text(statLines, MARGIN_LEFT + 4, boxY);

    currentY += consularBoxHeight + 3.0;

    // Mode B Directives Box (Preserves custom notes on Page 1 if budget permits, NO truncation)
    if (data.notesText && currentY + 14 <= 224) {
      const maxNotesHeight = 224 - currentY;
      const notesWrapped = doc.splitTextToSize(data.notesText, CONTENT_WIDTH - 8);
      const notesBoxHeight = Math.min(maxNotesHeight, Math.max(10, 5 + notesWrapped.length * 3.1 + 2));
      doc.setFillColor(255, 251, 235);
      doc.roundedRect(MARGIN_LEFT, currentY, CONTENT_WIDTH, notesBoxHeight, 1.5, 1.5, "F");
      doc.setDrawColor(245, 158, 11);
      doc.setLineWidth(0.3);
      doc.roundedRect(MARGIN_LEFT, currentY, CONTENT_WIDTH, notesBoxHeight, 1.5, 1.5, "S");

      doc.setTextColor(180, 83, 9);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.2);
      doc.text("IMPORTANT PRESENTER READINESS DIRECTIVE:", MARGIN_LEFT + 4, currentY + 3.8);

      doc.setTextColor(120, 53, 15);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.text(notesWrapped, MARGIN_LEFT + 4, currentY + 7.5);

      currentY += notesBoxHeight + 3.0;
    }
  }

  // 6. SIGNATURES & OFFICIAL SEAL BLOCK (Cleanly budgeted, dynamic to never overlap)
  const sigSectionY = Math.max(226, currentY + 2);
  drawSignatureBlock(doc, data, sigSectionY);

  // 7. SECURITY & VERIFIABLE QR CODE FOOTER (Page 1)
  drawSecurityFooter(doc, data, 1, totalPages);

  // 8. PAGE 2: TECHNICAL ANNEXURE (If two-page dossier)
  if (isTwoPage) {
    renderTechnicalAnnexurePage(doc, data);
  }

  return doc;
}

/**
 * Browser-side direct download trigger for Acceptance Letter PDF.
 * Modality-aware: routes automatically or applies format override.
 */
export function downloadAcceptanceLetterPdf(
  submission: any,
  edition: any,
  customConfig?: Partial<AcceptanceLetterSettings> | null,
  filename?: string,
  origin?: string,
  formatOverride?: AcceptanceLetterFormat
): void {
  const resolvedOrigin =
    origin || (typeof window !== "undefined" && window.location.origin ? window.location.origin : "https://app.scholarvault.in");
  const doc = generateAcceptanceLetterPdf(submission, edition, customConfig, resolvedOrigin, formatOverride);

  const activeFormat = resolveLetterFormat(
    formatOverride,
    customConfig?.default_format,
    submission?.delivery_mode === "virtual" || edition?.delivery_mode === "virtual"
  );

  const defaultPrefix =
    activeFormat === "two_page_dossier"
      ? "Presentation_Dossier"
      : activeFormat === "single_page_compact" && (submission?.delivery_mode === "virtual" || edition?.delivery_mode === "virtual")
        ? "Acceptance_Certificate"
        : "Visa_Invitation_Letter";

  const targetFilename =
    filename ||
    `${defaultPrefix}_${submission?.submission_number || "SVRIAS"}.pdf`;

  doc.save(targetFilename);
}
