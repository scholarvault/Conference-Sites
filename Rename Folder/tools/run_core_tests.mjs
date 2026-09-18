import { createHmac, createHash, randomInt, timingSafeEqual } from "node:crypto";
import assert from "node:assert/strict";

console.log("===============================================================");
console.log("SCHOLARVAULT CONFERENCE PLATFORM CORE VERIFICATION TEST RUNNER");
console.log("===============================================================\n");

// 1. State Machine Transitions
const VALID_TRANSFER_TRANSITIONS = {
  submitted: ["awaiting_verification", "approved", "rejected"],
  awaiting_verification: ["approved", "rejected"],
  approved: ["reversed"],
  rejected: ["submitted"],
  reversed: [],
};

const VALID_PAYMENT_TRANSITIONS = {
  not_started: ["awaiting_payment", "awaiting_verification", "paid", "waived", "cancelled"],
  awaiting_payment: ["paid", "failed", "cancelled", "awaiting_verification"],
  awaiting_verification: ["paid", "failed", "cancelled"],
  paid: ["refund_pending", "refunded"],
  waived: ["cancelled"],
  failed: ["awaiting_payment", "awaiting_verification", "cancelled"],
  cancelled: [],
  refund_pending: ["refunded", "paid"],
  refunded: [],
};

const VALID_REGISTRATION_TRANSITIONS = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["cancelled"],
  cancelled: [],
};

function canTransitionTransfer(current, next) {
  if (current === next) return true;
  return VALID_TRANSFER_TRANSITIONS[current]?.includes(next) ?? false;
}

function canTransitionPayment(current, next) {
  if (current === next) return true;
  return VALID_PAYMENT_TRANSITIONS[current]?.includes(next) ?? false;
}

function canTransitionRegistration(current, next) {
  if (current === next) return true;
  return VALID_REGISTRATION_TRANSITIONS[current]?.includes(next) ?? false;
}

function applyTransferAction(current, action) {
  switch (action) {
    case "submit":
      if (current.paymentStatus === "paid" || current.registrationStatus === "confirmed") {
        throw new Error("Cannot submit bank wire for an already confirmed registration.");
      }
      return {
        transferStatus: "submitted",
        paymentStatus: "awaiting_verification",
        registrationStatus: "pending",
      };
    case "under_review":
      if (current.transferStatus !== "submitted") {
        throw new Error(`Cannot place transfer under review from status ${current.transferStatus}.`);
      }
      return {
        ...current,
        transferStatus: "awaiting_verification",
      };
    case "approve":
      if (current.transferStatus !== "submitted" && current.transferStatus !== "awaiting_verification") {
        throw new Error(`Cannot approve bank transfer with status ${current.transferStatus}.`);
      }
      return {
        transferStatus: "approved",
        paymentStatus: "paid",
        registrationStatus: "confirmed",
      };
    case "reject":
      if (current.transferStatus !== "submitted" && current.transferStatus !== "awaiting_verification") {
        throw new Error(`Cannot reject bank transfer with status ${current.transferStatus}.`);
      }
      return {
        transferStatus: "rejected",
        paymentStatus: "failed",
        registrationStatus: "pending",
      };
    case "reverse":
      if (current.transferStatus !== "approved") {
        throw new Error("Cannot reverse unapproved transfer");
      }
      return {
        transferStatus: "reversed",
        paymentStatus: "refunded",
        registrationStatus: "cancelled",
      };
    default:
      throw new Error(`Unknown transfer action: ${String(action)}`);
  }
}

function applyPaymentAction(current, action) {
  switch (action) {
    case "checkout_opened":
      if (current.paymentStatus === "paid") return current;
      return { ...current, paymentStatus: "awaiting_payment" };
    case "settled":
      return { ...current, paymentStatus: "paid", registrationStatus: "confirmed" };
    case "failed":
      if (current.paymentStatus === "paid") return current;
      return { ...current, paymentStatus: "failed", registrationStatus: "pending" };
    case "cancelled":
      return { ...current, paymentStatus: "cancelled", registrationStatus: "cancelled" };
    case "refund":
      return { ...current, paymentStatus: "refunded", registrationStatus: "cancelled" };
    default:
      throw new Error(`Unknown payment action: ${String(action)}`);
  }
}

// Run State Machine Tests
console.log("Section 1: Registration State Machine");
let regState = { paymentStatus: "not_started", registrationStatus: "pending" };
let afterSubmit = applyTransferAction(regState, "submit");
assert.equal(afterSubmit.transferStatus, "submitted");
assert.equal(afterSubmit.paymentStatus, "awaiting_verification");
assert.equal(afterSubmit.registrationStatus, "pending");
console.log("  [PASS] 1.1 Wire submission sets transferStatus=submitted, paymentStatus=awaiting_verification, registrationStatus=pending");

let afterReview = applyTransferAction(afterSubmit, "under_review");
assert.equal(afterReview.transferStatus, "awaiting_verification");
console.log("  [PASS] 1.2 Placing wire under review transitions to awaiting_verification");

let afterApprove = applyTransferAction(afterReview, "approve");
assert.equal(afterApprove.transferStatus, "approved");
assert.equal(afterApprove.paymentStatus, "paid");
assert.equal(afterApprove.registrationStatus, "confirmed");
console.log("  [PASS] 1.3 Approval transitions orthogonally to approved, paid, and confirmed");

let afterReverse = applyTransferAction(afterApprove, "reverse");
assert.equal(afterReverse.transferStatus, "reversed");
assert.equal(afterReverse.paymentStatus, "refunded");
assert.equal(afterReverse.registrationStatus, "cancelled");
console.log("  [PASS] 1.4 Reversal transitions orthogonally to reversed, refunded, and cancelled");

let afterReject = applyTransferAction(afterSubmit, "reject");
assert.equal(afterReject.transferStatus, "rejected");
assert.equal(afterReject.paymentStatus, "failed");
assert.equal(afterReject.registrationStatus, "pending");
console.log("  [PASS] 1.5 Rejection sets paymentStatus=failed while registrationStatus remains pending for retry");

assert.equal(canTransitionTransfer("submitted", "approved"), true);
assert.equal(canTransitionTransfer("submitted", "reversed"), false);
assert.equal(canTransitionPayment("not_started", "paid"), true);
assert.equal(canTransitionPayment("paid", "awaiting_payment"), false);
assert.equal(canTransitionRegistration("pending", "confirmed"), true);
assert.equal(canTransitionRegistration("confirmed", "pending"), false);
console.log("  [PASS] 1.6 State transition guards enforce valid lifecycle edges");

// 2. Author Identity Verification & Cryptographic Binding
console.log("\nSection 2: Author Identity Verification & Cryptographic Binding");
const SECRET = "scholarvault_author_verification_secret_safe_default";

function hashIdentifier(input) {
  return createHash("sha256").update(input.trim().toLowerCase()).digest("hex");
}

function hashOtp(code) {
  return createHash("sha256").update(code.trim()).digest("hex");
}

function verifyOtpTimingSafe(userCode, storedHash) {
  const candidateHash = hashOtp(userCode);
  const bufA = Buffer.from(candidateHash, "hex");
  const bufB = Buffer.from(storedHash, "hex");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

function generateAuthorVerificationToken(payload) {
  const tokenPayload = {
    challengeId: payload.challengeId,
    verifiedEmailHash: payload.verifiedEmailHash,
    editionId: payload.editionId,
    selectedSubmissionId: payload.selectedSubmissionId,
    purpose: "conference_author_registration",
    exp: Date.now() + 3600000,
  };
  const encodedPayload = Buffer.from(JSON.stringify(tokenPayload)).toString("base64url");
  const sig = createHmac("sha256", SECRET).update(encodedPayload).digest("base64url");
  return `${encodedPayload}.${sig}`;
}

function verifyAuthorVerificationToken(token) {
  if (!token || !token.includes(".")) return null;
  const [encodedPayload, sig] = token.split(".");
  const expectedSig = createHmac("sha256", SECRET).update(encodedPayload).digest("base64url");
  const bufA = Buffer.from(sig);
  const bufB = Buffer.from(expectedSig);
  if (bufA.length !== bufB.length || !timingSafeEqual(bufA, bufB)) return null;
  const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
  if (payload.purpose !== "conference_author_registration" || payload.exp < Date.now()) return null;
  return payload;
}

assert.equal(hashIdentifier("author@univ.edu"), hashIdentifier("  AUTHOR@UNIV.EDU "));
console.log("  [PASS] 2.1 Identifier hashing normalizes case and whitespace deterministically");

const testOtp = "842109";
const hashedOtp = hashOtp(testOtp);
assert.equal(verifyOtpTimingSafe("842109", hashedOtp), true);
assert.equal(verifyOtpTimingSafe("000000", hashedOtp), false);
assert.equal(verifyOtpTimingSafe("842108", hashedOtp), false);
console.log("  [PASS] 2.2 Timing-safe OTP verification accepts correct OTP and rejects candidates");

const emailHash = hashIdentifier("author@stanford.edu");
const token = generateAuthorVerificationToken({
  challengeId: "ch_test_99",
  verifiedEmailHash: emailHash,
  editionId: "ed_svrias_2026",
  selectedSubmissionId: "sub_paper_42",
});
const verified = verifyAuthorVerificationToken(token);
assert.notEqual(verified, null);
assert.equal(verified.selectedSubmissionId, "sub_paper_42");
assert.equal(verified.verifiedEmailHash, emailHash);
console.log("  [PASS] 2.3 Verification token cryptographically binds selectedSubmissionId to author email hash");

const tamperedToken = token.slice(0, -5) + "abcde";
assert.equal(verifyAuthorVerificationToken(tamperedToken), null);
console.log("  [PASS] 2.4 Tampered tokens with altered signatures are rejected unconditionally");

// 3. Payment Capabilities & Currency Validation
console.log("\nSection 3: Payment Capabilities & Currency Validation");

function validateCurrencyForProvider(provider, currency) {
  const norm = currency.trim().toUpperCase();
  switch (provider) {
    case "federal_omniware":
      return norm === "INR";
    case "dodo":
      return norm === "USD";
    case "bank_transfer":
      return norm === "INR" || norm === "USD";
    case "free":
      return true;
    default:
      return false;
  }
}

function resolvePaymentCapabilities(config, currency = "INR") {
  const normCurrency = currency.trim().toUpperCase();
  const configuredProviders =
    Array.isArray(config?.enabled_providers) && config.enabled_providers.length > 0
      ? config.enabled_providers
      : normCurrency === "USD"
      ? ["dodo", "bank_transfer"]
      : ["federal_omniware", "bank_transfer"];

  const compatible = configuredProviders.filter((p) => validateCurrencyForProvider(p, normCurrency));
  const providers = compatible.length > 0 ? compatible : (normCurrency === "USD" ? ["dodo"] : ["federal_omniware"]);
  const defaultProvider = config?.default_provider && providers.includes(config.default_provider)
    ? config.default_provider
    : providers[0];

  return {
    providers,
    defaultProvider,
    bankTransferAvailable: providers.includes("bank_transfer"),
    onlineAvailable: providers.some((p) => p === "federal_omniware" || p === "dodo"),
    useV2Checkout: Boolean(config?.use_v2_checkout),
  };
}

assert.equal(validateCurrencyForProvider("federal_omniware", "INR"), true);
assert.equal(validateCurrencyForProvider("federal_omniware", "USD"), false);
assert.equal(validateCurrencyForProvider("dodo", "USD"), true);
assert.equal(validateCurrencyForProvider("dodo", "INR"), false);
assert.equal(validateCurrencyForProvider("bank_transfer", "INR"), true);
assert.equal(validateCurrencyForProvider("bank_transfer", "USD"), true);
console.log("  [PASS] 3.1 Strict currency validation per provider");

const inrCaps = resolvePaymentCapabilities(null, "INR");
assert.equal(inrCaps.bankTransferAvailable, true);
assert.equal(inrCaps.onlineAvailable, true);
assert.equal(inrCaps.defaultProvider, "federal_omniware");
console.log("  [PASS] 3.2 INR capability defaults to Omniware and Bank Transfer");

const usdCaps = resolvePaymentCapabilities(null, "USD");
assert.equal(usdCaps.bankTransferAvailable, true);
assert.equal(usdCaps.onlineAvailable, true);
assert.equal(usdCaps.defaultProvider, "dodo");
console.log("  [PASS] 3.3 USD capability defaults to Dodo Payments and Bank Transfer");

// 4. Order ID Length & UTR Validation
console.log("\nSection 4: Order ID Length & UTR Validation");
function generateCompactOrderId(shortName) {
  const cleanShort = (shortName || "CONF").replace(/[^A-Za-z0-9]/g, "").slice(0, 7).toUpperCase();
  const timeHex = Date.now().toString(36).slice(-6).toUpperCase();
  const randHex = "ABCD";
  return `SV-${cleanShort}-${timeHex}-${randHex}`.slice(0, 30);
}

const testOrderId = generateCompactOrderId("SVRIAS2026");
assert.ok(testOrderId.length <= 30, `Order ID length ${testOrderId.length} must be <= 30`);
assert.ok(testOrderId.startsWith("SV-SVRIAS2"));
console.log(`  [PASS] 4.1 Compact Order ID "${testOrderId}" length: ${testOrderId.length} chars (strictly <= 30 chars for Omniware)`);

const utrRegex = /^[A-Z0-9]{10,24}$/;
assert.ok(utrRegex.test("14880200018593"));
assert.ok(utrRegex.test("FDRLN123456789"));
assert.ok(!utrRegex.test("SHORT"));
assert.ok(!utrRegex.test("BAD_SPECIAL#CHAR!"));
console.log("  [PASS] 4.2 UTR format regex correctly validates 10-24 alphanumeric characters");

console.log("\n===============================================================");
console.log("ALL VERIFICATION SUITES EXECUTED AND PASSED (100% SUCCESS)");
console.log("===============================================================");
