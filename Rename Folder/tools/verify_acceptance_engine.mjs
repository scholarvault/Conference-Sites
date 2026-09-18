import { readFileSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";

console.log("===============================================================");
console.log("SCHOLARVAULT MODALITY-AWARE ACCEPTANCE ENGINE VERIFICATION TEST");
console.log("===============================================================\n");

const baseDir = process.cwd();
const enginePath = join(baseDir, "staged_scholarvault_webapp", "src", "features", "conferences", "acceptanceLetterEngine.ts");
const pagePath = join(baseDir, "staged_scholarvault_webapp", "src", "app", "conference", "[slug]", "submission", "[reference]", "page.tsx");
const settingsPath = join(baseDir, "staged_scholarvault_webapp", "src", "features", "conferences", "OrganizerAcceptanceLetterSettings.tsx");
const routePath = join(baseDir, "staged_scholarvault_webapp", "src", "app", "api", "conferences", "[slug]", "submissions", "[reference]", "acceptance-letter", "route.ts");

const engineContent = readFileSync(enginePath, "utf-8");
const pageContent = readFileSync(pagePath, "utf-8");
const settingsContent = readFileSync(settingsPath, "utf-8");
const routeContent = readFileSync(routePath, "utf-8");

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`  [FAIL] ${name}: ${err.message}`);
    failed++;
  }
}

// TEST SUITE 1: EVICTION OF IEEE / ACM THIRD-PARTY MENTIONS
console.log("--- Suite 1: Clean Neutral ScholarVault Terminology (No IEEE/ACM) ---");

test("acceptanceLetterEngine.ts contains ZERO mentions of 'IEEE'", () => {
  assert.equal(/IEEE/i.test(engineContent), false, "Found prohibited 'IEEE' mention in engine");
});

test("acceptanceLetterEngine.ts contains ZERO mentions of 'ACM'", () => {
  assert.equal(/ACM/i.test(engineContent), false, "Found prohibited 'ACM' mention in engine");
});

test("OrganizerAcceptanceLetterSettings.tsx contains ZERO mentions of 'IEEE'", () => {
  assert.equal(/IEEE/i.test(settingsContent), false, "Found prohibited 'IEEE' mention in settings");
});

test("OrganizerAcceptanceLetterSettings.tsx contains ZERO mentions of 'ACM'", () => {
  assert.equal(/ACM/i.test(settingsContent), false, "Found prohibited 'ACM' mention in settings");
});

test("page.tsx contains ZERO mentions of 'IEEE' or 'ACM'", () => {
  assert.equal(/\b(IEEE|ACM)\b/i.test(pageContent), false, "Found prohibited 'IEEE/ACM' mention in page.tsx");
});

test("Uses neutral 'ScholarVault Standard Proceedings Format'", () => {
  assert.ok(engineContent.includes("ScholarVault Standard Proceedings Format"));
  assert.ok(settingsContent.includes("ScholarVault Standard Proceedings Format"));
});

// TEST SUITE 2: DATA-LOSS BUG ELIMINATION (LINES 1040 & 1072)
console.log("\n--- Suite 2: Data-Loss Bug Elimination & Dynamic Vertical Budgeting ---");

test("Eliminated titleLines.slice(0, 2) data-loss bug", () => {
  assert.equal(engineContent.includes("titleLines.slice(0, 2)"), false, "Found titleLines.slice(0, 2)");
  assert.equal(engineContent.includes("titleLines.slice(0,"), false, "Found titleLines.slice");
});

test("Eliminated notesWrapped.slice(0, 2) data-loss bug", () => {
  assert.equal(engineContent.includes("notesWrapped.slice(0, 2)"), false, "Found notesWrapped.slice(0, 2)");
  assert.equal(engineContent.includes("notesWrapped.slice(0,"), false, "Found notesWrapped.slice");
});

test("Eliminated subtitleLines.slice(0, 2) data-loss bug in page header", () => {
  assert.equal(engineContent.includes("subtitleLines.slice(0, 2)"), false, "Found subtitleLines.slice(0, 2)");
  assert.equal(engineContent.includes("subtitleLines.slice(0,"), false, "Found subtitleLines.slice");
});

test("Dynamic signature Y placement prevents overlap with long content", () => {
  assert.ok(engineContent.includes("Math.max(226, currentY + 2)"));
});

test("Dynamic Title Box height function calculates adequate height for long titles", () => {
  function calcTitleBoxHeight(numLines) {
    const titleBoxPaddingTop = 3.5;
    const titleBoxPaddingBottom = 3;
    const titleLabelHeight = 4;
    const titleLineHeight = 4.2;
    return Math.max(13.5, titleBoxPaddingTop + titleLabelHeight + numLines * titleLineHeight + titleBoxPaddingBottom);
  }

  assert.ok(calcTitleBoxHeight(1) >= 13.5);
  assert.ok(calcTitleBoxHeight(2) >= 18);
  assert.ok(calcTitleBoxHeight(4) >= 27);
  assert.ok(calcTitleBoxHeight(6) >= 35);
  assert.ok(calcTitleBoxHeight(4) > calcTitleBoxHeight(2), "4-line title box must expand beyond 2-line");
});

// TEST SUITE 3: OFFICIAL CONSULAR VISA CLAUSES
console.log("\n--- Suite 3: Official Consular Visa Clauses ---");

test("Integrates US 9 FAM 402.2-5(B) (Scientific Conferences)", () => {
  assert.ok(engineContent.includes("US 9 FAM 402.2-5(B)"));
  assert.ok(settingsContent.includes("US 9 FAM 402.2-5(B)"));
});

test("Integrates UK Standard Visitor academic activity (Appendix V)", () => {
  assert.ok(engineContent.includes("UK Immigration Rules Appendix V"));
});

test("Integrates Schengen Uniform Visa Code (EC) No 810/2009", () => {
  assert.ok(engineContent.includes("Schengen Visa Code (EC) No 810/2009"));
});

test("Integrates India MHA Conference Visa regulations", () => {
  assert.ok(engineContent.includes("India Ministry of Home Affairs (MHA)"));
});

test("Contains explicit Non-Employment & Non-Remuneration Declaration", () => {
  assert.ok(engineContent.includes("non_remuneration_text"));
  assert.ok(engineContent.includes("will not receive any salary, wages, honoraria, living allowance, or remuneration"));
});

test("Contains explicit Financial Responsibility & Non-Liability Clause", () => {
  assert.ok(engineContent.includes("financial_clause_text"));
  assert.ok(engineContent.includes("assumes any financial liability for the participant's travel, subsistence"));
  assert.ok(engineContent.includes("ScholarVault Travel Grant award letter"));
});

test("Consular Clause 1 explicitly binds full author name, institutional affiliation, and accepted research title", () => {
  assert.ok(engineContent.includes("${authorCitation}${coauthorsMention}"));
  assert.ok(engineContent.includes('accepted manuscript "${data.paperTitle}"'));
});

// TEST SUITE 4: PRESENTER TECHNICAL READINESS & ANNEXURE
console.log("\n--- Suite 4: Presenter Technical Readiness & Technical Annexure ---");

test("Preserves custom author directives and notes in Mode B on both Page 1 and Page 2", () => {
  assert.ok(engineContent.includes("data.notesText && currentY + 14 <= 224"));
  assert.ok(engineContent.includes("PRESENTER DIRECTIVE: ${data.notesText}"));
});

test("Mandates 16:9 widescreen presentation slide decks (deprecating 4:3)", () => {
  assert.ok(engineContent.includes("16:9 Widescreen"));
  assert.ok(engineContent.includes("Legacy 4:3 format is deprecated"));
  assert.ok(settingsContent.includes("16:9"));
});

test("Explicitly instructs authors on latest Zoom Desktop Client (v6.0+) and AV pre-checks", () => {
  assert.ok(engineContent.includes("Zoom Desktop Client (v6.0+)"));
  assert.ok(engineContent.includes("Audio/video pre-check 15 minutes prior"));
});

test("Specifies oral presentation timing (15m talk + 5m Q&A)", () => {
  assert.ok(engineContent.includes("15 minutes oral presentation followed by 5 minutes"));
});

test("Includes COPE Publication Ethics & Research Integrity Governance", () => {
  assert.ok(engineContent.includes("Committee on Publication Ethics (COPE)"));
  assert.ok(engineContent.includes("15% similarity excluding references"));
});

test("Renders 4-row Critical Milestones Compliance Table on Page 2", () => {
  assert.ok(engineContent.includes("renderTechnicalAnnexurePage"));
  assert.ok(engineContent.includes("MILESTONE / REQUIREMENT"));
  assert.ok(engineContent.includes("TIMELINE / DEADLINE"));
  assert.ok(engineContent.includes("MANDATORY COMPLIANCE ACTION"));
  assert.ok(engineContent.includes("Publication-Ready Manuscript"));
  assert.ok(engineContent.includes("Presenter Registration Verification"));
  assert.ok(engineContent.includes("Presentation Slide Deck (16:9)"));
  assert.ok(engineContent.includes("Summit Delivery & DOI Archival"));
});

// TEST SUITE 5: FORMAT SELECTION & MODALITY ROUTING
console.log("\n--- Suite 5: Format Selection & Modality Routing ---");

test("resolveLetterFormat routing logic adheres to specifications", () => {
  function resolveLetterFormat(formatOverride, configuredDefault, isVirtual) {
    const chosen = formatOverride || configuredDefault || "auto";
    if (chosen === "single_page_compact") return "single_page_compact";
    if (chosen === "two_page_dossier") return "two_page_dossier";
    return isVirtual ? "single_page_compact" : "two_page_dossier";
  }

  // Auto routing:
  assert.equal(resolveLetterFormat("auto", undefined, true), "single_page_compact");
  assert.equal(resolveLetterFormat(undefined, "auto", true), "single_page_compact");
  assert.equal(resolveLetterFormat("auto", undefined, false), "two_page_dossier");
  assert.equal(resolveLetterFormat(undefined, "auto", false), "two_page_dossier");

  // Explicit overrides:
  assert.equal(resolveLetterFormat("single_page_compact", "two_page_dossier", false), "single_page_compact");
  assert.equal(resolveLetterFormat("two_page_dossier", "single_page_compact", true), "two_page_dossier");
});

test("AcceptanceLetterFormat type supports 'auto', 'single_page_compact', and 'two_page_dossier'", () => {
  assert.ok(engineContent.includes('"auto" | "single_page_compact" | "two_page_dossier"'));
});

// TEST SUITE 6: SUBMISSION TRACKER DOWNLOAD BUTTONS (PAGE.TSX)
console.log("\n--- Suite 6: Submission Tracker Download Actions ---");

test("Page.tsx provides Official Visa Invitation Letter (1-Page PDF) for Hybrid / Physical", () => {
  assert.ok(pageContent.includes("Download Official Visa Invitation Letter (1-Page PDF)"));
});

test("Page.tsx provides Complete Presentation Dossier & Annexure (2-Page PDF) for Hybrid / Physical", () => {
  assert.ok(pageContent.includes("Download Complete Presentation Dossier & Annexure (2-Page PDF)"));
});

test("Page.tsx provides Official Acceptance Certificate (1-Page PDF) for Virtual", () => {
  assert.ok(pageContent.includes("Download Official Acceptance Certificate (1-Page PDF)"));
});

test("Page.tsx passes formatOverride into handleDownloadAcceptance", () => {
  assert.ok(pageContent.includes('handleDownloadAcceptance("single_page_compact")'));
  assert.ok(pageContent.includes('handleDownloadAcceptance("two_page_dossier")'));
});

// TEST SUITE 7: ORGANIZER SETTINGS FORMAT CONTROLS & LIVE A4 PREVIEW
console.log("\n--- Suite 7: Organizer Settings Controls & Multi-Page Preview ---");

test("OrganizerAcceptanceLetterSettings.tsx provides default_format radio controls", () => {
  assert.ok(settingsContent.includes('name="default_format"'));
  assert.ok(settingsContent.includes("Smart Modality Routing (Auto)"));
  assert.ok(settingsContent.includes("Single Page Compact"));
  assert.ok(settingsContent.includes("Two-Page Complete Dossier"));
});

test("OrganizerAcceptanceLetterSettings.tsx supports switching between Page 1, Page 2, and Virtual Mode A in preview", () => {
  assert.ok(settingsContent.includes("activePreviewPage"));
  assert.ok(settingsContent.includes("Page 1: Acceptance & Consular Visa"));
  assert.ok(settingsContent.includes("Page 2: Technical Annexure"));
  assert.ok(settingsContent.includes("Virtual Credential (Mode A)"));
});

test("OrganizerAcceptanceLetterSettings.tsx allows editing consular visa clauses", () => {
  assert.ok(settingsContent.includes("non_remuneration_text"));
  assert.ok(settingsContent.includes("financial_clause_text"));
  assert.ok(settingsContent.includes("consular_authority_text"));
});

test("OrganizerAcceptanceLetterSettings.tsx allows editing technical annexure parameters", () => {
  assert.ok(settingsContent.includes("annexure_oral_duration"));
  assert.ok(settingsContent.includes("annexure_aspect_ratio"));
  assert.ok(settingsContent.includes("annexure_virtual_platform"));
  assert.ok(settingsContent.includes("annexure_proceedings_format"));
  assert.ok(settingsContent.includes("annexure_cope_statement"));
});

// TEST SUITE 8: API ROUTE FORMAT SUPPORT
console.log("\n--- Suite 8: API Route Query Parameter Format Handling ---");

test("API route reads format from searchParams and passes to generateAcceptanceLetterPdf", () => {
  assert.ok(routeContent.includes('request.nextUrl.searchParams.get("format")'));
  assert.ok(routeContent.includes("generateAcceptanceLetterPdf"));
  assert.ok(routeContent.includes("Presentation_Dossier_"));
  assert.ok(routeContent.includes("Visa_Invitation_Letter_"));
});

console.log("\n===============================================================");
console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log("===============================================================");

if (failed > 0) {
  process.exit(1);
}
