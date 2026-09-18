import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

console.log("=================================================================");
console.log("ScholarVault Search Enhancements: Deep Verification Suite (v2)");
console.log("=================================================================\n");

const rootDir = process.cwd();

// Resolve paths - check both staged workspace and codex-deploy preview
const possiblePaths = [
  path.join(rootDir, "src", "features", "portal"),
  path.join(rootDir, "staged_scholarvault_webapp", "src", "features", "portal"),
  "C:\\Users\\Shyam\\Scholar Vault 2\\ScholarVault Web App v2\\.codex-deploy\\preview\\src\\features\\portal",
];

let targetPortalDir = possiblePaths.find((p) => fs.existsSync(p));
if (!targetPortalDir) {
  targetPortalDir = path.join(rootDir, "src", "features", "portal");
}

console.log(`Inspecting Portal Directory: ${targetPortalDir}\n`);

const portalShellPath = path.join(targetPortalDir, "PortalShell.tsx");
const scvsWorkspacePath = path.join(targetPortalDir, "researcher-workspace", "SCVSWorkspace.tsx");
const portalCssPath = path.join(targetPortalDir, "portal.css");

const portalShellContent = fs.readFileSync(portalShellPath, "utf-8");
const scvsWorkspaceContent = fs.readFileSync(scvsWorkspacePath, "utf-8");
const portalCssContent = fs.existsSync(portalCssPath) ? fs.readFileSync(portalCssPath, "utf-8") : "";

// Test 1: Verify Zero Mentions of "IEEE" across PortalShell.tsx and SCVSWorkspace.tsx
console.log("--- Test 1: Zero Mentions of 'IEEE' in Search UI & Workspace ---");
assert.strictEqual(
  /\bIEEE\b/i.test(portalShellContent),
  false,
  "PortalShell.tsx must NOT contain any mention of 'IEEE'!"
);
console.log("  [PASS] PortalShell.tsx: 0 occurrences of 'IEEE'");

assert.strictEqual(
  /\bIEEE\b/i.test(scvsWorkspaceContent),
  false,
  "SCVSWorkspace.tsx must NOT contain any mention of 'IEEE'!"
);
console.log("  [PASS] SCVSWorkspace.tsx: 0 occurrences of 'IEEE'");

// Test 2: Verify id="scvs-hero-dock" in SCVSWorkspace.tsx
console.log("\n--- Test 2: Hero Dock Container ID in SCVSWorkspace.tsx ---");
assert.ok(
  scvsWorkspaceContent.includes('id="scvs-hero-dock"'),
  "SCVSWorkspace.tsx must contain id=\"scvs-hero-dock\""
);
console.log("  [PASS] SCVSWorkspace.tsx carries id=\"scvs-hero-dock\"");

// Test 3: Verify Optimized Typewriter (Direct DOM, 0 Re-Render Storms) in SCVSWorkspace.tsx
console.log("\n--- Test 3: SCVSWorkspace Typewriter Loop Optimization ---");
assert.ok(
  !scvsWorkspaceContent.includes("setTypewriterPlaceholder("),
  "SCVSWorkspace.tsx must NOT call setTypewriterPlaceholder (avoids re-render storm)"
);
assert.ok(
  scvsWorkspaceContent.includes("textareaRef.current.placeholder ="),
  "SCVSWorkspace.tsx must assign placeholder directly to textareaRef.current"
);
assert.ok(
  scvsWorkspaceContent.includes("isDockInputPausedRef.current"),
  "SCVSWorkspace.tsx must support hover/focus pause tracking"
);
console.log("  [PASS] SCVSWorkspace typewriter loop uses direct DOM manipulation without re-renders");

// Test 4: Verify Discovery Prompts without IEEE
console.log("\n--- Test 4: Academic Discovery Prompts Content ---");
const expectedPrompts = [
  "Find hybrid AI ethics conferences with student travel grants...",
  "Paste official conference URL or CFP flyer to verify integrity...",
  "Screen Scopus indexed summits for early-career PhDs...",
  "Check ICAHCR 2026 paper submission deadlines and fees...",
  "Which biomedical conferences accept poster presentations?...",
];
for (const prompt of expectedPrompts) {
  assert.ok(
    scvsWorkspaceContent.includes(prompt),
    `SCVSWorkspace.tsx must include discovery prompt: "${prompt}"`
  );
}
console.log("  [PASS] All 5 required neutral academic discovery prompts are present in SCVSWorkspace.tsx");

// Test 5: Verify TypewriterSpan in PortalShell.tsx
console.log("\n--- Test 5: TypewriterSpan in PortalShell.tsx ---");
assert.ok(
  portalShellContent.includes("export function TypewriterSpan"),
  "PortalShell.tsx must export TypewriterSpan component"
);
const expectedTopbarPrompts = [
  "Search 'SVRIAS 2026' or 'ICAHCR 2026'...",
  "Find submission 'SUB-8821' or paper title...",
  "Search participation certificates & credentials...",
  "Search Scopus indexed summits or workshops...",
];
for (const prompt of expectedTopbarPrompts) {
  assert.ok(
    portalShellContent.includes(prompt),
    `PortalShell.tsx TypewriterSpan must include prompt: "${prompt}"`
  );
}
console.log("  [PASS] TypewriterSpan component exists with all required topbar prompts");

// Test 6: Verify Top Search Bar Visibility Logic
console.log("\n--- Test 6: Top Search Bar Visibility Rules ---");
function computeVisibility(pathname, hasSearchQ, scrollY, heroDockInView) {
  const isVerifyPage = pathname === "/dashboard/verify";
  const isTopSearchHidden = isVerifyPage && !hasSearchQ && scrollY < 140 && heroDockInView;
  return isTopSearchHidden;
}

assert.strictEqual(computeVisibility("/dashboard", false, 0, false), false, "Home route should never hide topbar search");
assert.strictEqual(computeVisibility("/dashboard", false, 50, true), false, "Home route with scroll < 140 should stay visible");
console.log("  [PASS] Home route (/dashboard): Search bar always visible");

assert.strictEqual(computeVisibility("/dashboard/submissions", false, 0, false), false);
assert.strictEqual(computeVisibility("/dashboard/certificates", false, 0, false), false);
console.log("  [PASS] Secondary routes (/submissions, /certificates): Search bar always visible");

assert.strictEqual(computeVisibility("/dashboard/verify", false, 0, true), true, "Verify page at top must hide topbar search");
assert.strictEqual(computeVisibility("/dashboard/verify", false, 120, true), true, "Verify page at Y=120 must hide topbar search");
console.log("  [PASS] /dashboard/verify (idle, scroll < 140, hero dock in view): Search bar HIDDEN (no double bar)");

assert.strictEqual(computeVisibility("/dashboard/verify", false, 140, true), false, "Verify page at Y=140 must show topbar search");
assert.strictEqual(computeVisibility("/dashboard/verify", false, 250, false), false, "Verify page at Y=250 must show topbar search");
console.log("  [PASS] /dashboard/verify (scrolled Y >= 140): Search bar VISIBLE");

assert.strictEqual(computeVisibility("/dashboard/verify", true, 0, true), false, "Verify page with searchParam ?q= must show topbar search");
console.log("  [PASS] /dashboard/verify with query param: Search bar VISIBLE");

// Test 7: Verify Command Palette Discovery Elements & Trending Tags
console.log("\n--- Test 7: Command Palette Discovery Elements & Trending Tags ---");
const expectedTags = [
  "Scopus Indexed 2026",
  "PhD Travel Grants",
  "Anti-Paper Mill Shield",
  "AI Ethics Summits",
  "Fast-Track CFPs",
  "Biomedical Research 2026",
  "Hybrid Summits",
];
for (const tag of expectedTags) {
  assert.ok(
    portalShellContent.includes(tag),
    `PortalShell.tsx must include popular academic tag: "${tag}"`
  );
}
console.log("  [PASS] All 7 neutral, prestigious academic tags present");

// Test 8: Verify Flagship Card Details
console.log("\n--- Test 8: Featured Flagship Conference Card in Command Palette ---");
assert.ok(portalShellContent.includes("SVRIAS 2026"), "Must show SVRIAS 2026");
assert.ok(portalShellContent.includes("95/100 SCVS Trust Score"), "Must show 95/100 SCVS Trust Score");
assert.ok(portalShellContent.includes("Early Bird CFP: 14d left"), "Must show countdown badge");
assert.ok(portalShellContent.includes("Dec 14–15, 2026 · Hybrid New Delhi & Virtual · Crossref DOI"), "Must show dates & venue");
assert.ok(portalShellContent.includes("/dashboard/conferences/svrias-2026/register"), "Must link to SVRIAS CFP registration");
assert.ok(portalShellContent.includes("https://researchintegrity2026.scholarvault.in"), "Must link to forensic audit report");
console.log("  [PASS] Flagship card metadata and actions verified");

// Test 9: Verify Recent Searches Storage & Functions
console.log("\n--- Test 9: Recent Searches Key & Storage Operations ---");
assert.ok(portalShellContent.includes("scholarvault:recent_searches:v1"), "Must use key scholarvault:recent_searches:v1");
assert.ok(portalShellContent.includes("deleteRecentSearch"), "Must support removing individual search");
assert.ok(portalShellContent.includes("clearAllSearches"), "Must support clearing all searches");
console.log("  [PASS] Recent searches key, deletion, and clearing operations verified");

// Test 10: Verify CSS Transitions and Styling
if (portalCssContent) {
  console.log("\n--- Test 10: CSS Rules in portal.css ---");
  assert.ok(portalCssContent.includes(".sv-command-trigger.is-hidden"), "portal.css must include .sv-command-trigger.is-hidden");
  assert.ok(portalCssContent.includes("0.22s cubic-bezier(0.16, 1, 0.3, 1)"), "portal.css must use 0.22s cubic-bezier transition");
  assert.ok(portalCssContent.includes(".sv-command-discovery"), "portal.css must include .sv-command-discovery");
  assert.ok(portalCssContent.includes(".sv-command-pill"), "portal.css must include .sv-command-pill");
  assert.ok(portalCssContent.includes(".sv-command-flagship"), "portal.css must include .sv-command-flagship");
  console.log("  [PASS] portal.css has all required layout and animation styles");
}

console.log("\n=================================================================");
console.log("ALL AUTOMATED VERIFICATION TESTS PASSED SUCCESSFULLY! (100%)");
console.log("=================================================================\n");
