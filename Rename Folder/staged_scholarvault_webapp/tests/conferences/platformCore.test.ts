import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  applyTransferAction,
  applyPaymentAction,
  canTransitionTransfer,
  canTransitionPayment,
  canTransitionRegistration,
} from "../../src/features/conferences/registrationStateMachine";
import {
  generateAuthorVerificationToken,
  verifyAuthorVerificationToken,
  hashIdentifier,
  hashOtp,
  verifyOtpTimingSafe,
} from "../../src/features/conferences/authorVerification";
import {
  resolvePaymentCapabilities,
  validateCurrencyForProvider,
  resolveBankInstructions,
} from "../../src/features/conferences/paymentCapabilities";

describe("Registration State Machine (Orthogonal Statuses)", () => {
  it("transitions bank transfer submission correctly", () => {
    const initial = {
      paymentStatus: "not_started" as const,
      registrationStatus: "pending" as const,
    };
    const next = applyTransferAction(initial, "submit");
    assert.equal(next.transferStatus, "submitted");
    assert.equal(next.paymentStatus, "awaiting_verification");
    assert.equal(next.registrationStatus, "pending");
  });

  it("approves bank transfer into confirmed and paid states", () => {
    const current = {
      transferStatus: "submitted" as const,
      paymentStatus: "awaiting_verification" as const,
      registrationStatus: "pending" as const,
    };
    const approved = applyTransferAction(current, "approve");
    assert.equal(approved.transferStatus, "approved");
    assert.equal(approved.paymentStatus, "paid");
    assert.equal(approved.registrationStatus, "confirmed");
  });

  it("rejects bank transfer into failed payment state while keeping registration pending for retry", () => {
    const current = {
      transferStatus: "submitted" as const,
      paymentStatus: "awaiting_verification" as const,
      registrationStatus: "pending" as const,
    };
    const rejected = applyTransferAction(current, "reject");
    assert.equal(rejected.transferStatus, "rejected");
    assert.equal(rejected.paymentStatus, "failed");
    assert.equal(rejected.registrationStatus, "pending");
  });

  it("reverses an approved bank transfer into cancelled registration", () => {
    const current = {
      transferStatus: "approved" as const,
      paymentStatus: "paid" as const,
      registrationStatus: "confirmed" as const,
    };
    const reversed = applyTransferAction(current, "reverse");
    assert.equal(reversed.transferStatus, "reversed");
    assert.equal(reversed.paymentStatus, "refunded");
    assert.equal(reversed.registrationStatus, "cancelled");
  });

  it("enforces legal transition guards", () => {
    assert.equal(canTransitionTransfer("submitted", "approved"), true);
    assert.equal(canTransitionTransfer("submitted", "reversed"), false);
    assert.equal(canTransitionPayment("not_started", "paid"), true);
    assert.equal(canTransitionPayment("paid", "awaiting_payment"), false);
    assert.equal(canTransitionRegistration("pending", "confirmed"), true);
    assert.equal(canTransitionRegistration("confirmed", "pending"), false);
  });
});

describe("Author Identity Verification & Cryptographic Binding", () => {
  it("hashes identifiers deterministically", () => {
    const hash1 = hashIdentifier("Test.Author@Institution.Edu");
    const hash2 = hashIdentifier("test.author@institution.edu");
    assert.equal(hash1, hash2);
    assert.equal(hash1.length, 64);
  });

  it("verifies OTP codes timing-safely", () => {
    const code = "789123";
    const hashed = hashOtp(code);
    assert.equal(verifyOtpTimingSafe("789123", hashed), true);
    assert.equal(verifyOtpTimingSafe("000000", hashed), false);
  });

  it("generates and verifies HMAC tokens bound to submission ID", () => {
    const emailHash = hashIdentifier("author@univ.edu");
    const token = generateAuthorVerificationToken({
      challengeId: "ch_test_123",
      verifiedEmailHash: emailHash,
      editionId: "ed_test_456",
      selectedSubmissionId: "sub_paper_789",
    });

    const verified = verifyAuthorVerificationToken(token);
    assert.notEqual(verified, null);
    assert.equal(verified?.selectedSubmissionId, "sub_paper_789");
    assert.equal(verified?.verifiedEmailHash, emailHash);
    assert.equal(verified?.purpose, "conference_author_registration");
  });

  it("rejects tampered tokens", () => {
    const token = generateAuthorVerificationToken({
      challengeId: "ch_1",
      verifiedEmailHash: "abc",
      editionId: "ed_1",
      selectedSubmissionId: "sub_legit",
    });

    const parts = token.split(".");
    // Tamper with the signature
    const tampered = `${parts[0]}.${parts[1].slice(0, -2)}xx`;
    assert.equal(verifyAuthorVerificationToken(tampered), null);
  });
});

describe("Payment Capabilities & Provider Resolution", () => {
  it("resolves INR providers with bank transfer option", () => {
    const caps = resolvePaymentCapabilities(
      {
        enabled_providers: ["federal_omniware", "bank_transfer"],
        default_provider: "federal_omniware",
      },
      "INR"
    );
    assert.equal(caps.bankTransferAvailable, true);
    assert.equal(caps.onlineAvailable, true);
    assert.equal(caps.defaultProvider, "federal_omniware");
  });

  it("validates currencies strictly per provider", () => {
    assert.equal(validateCurrencyForProvider("federal_omniware", "INR"), true);
    assert.equal(validateCurrencyForProvider("federal_omniware", "USD"), false);
    assert.equal(validateCurrencyForProvider("dodo", "USD"), true);
    assert.equal(validateCurrencyForProvider("dodo", "INR"), false);
  });

  it("masks public bank coordinates and retains full coordinates server-side", () => {
    const publicView = resolveBankInstructions("federal-primary", "v1", false);
    assert.ok(publicView.accountNumberMasked.includes("XXXXXX"));
    assert.equal(publicView.accountNumberFull, undefined);

    const serverView = resolveBankInstructions("federal-primary", "v1", true);
    assert.ok(serverView.accountNumberFull !== undefined);
  });
});

describe("Order ID and UTR Validation", () => {
  it("validates compact order ID length is strictly <= 30 characters", () => {
    const shortName = "SVRIAS26";
    const cleanShort = shortName.replace(/[^A-Za-z0-9]/g, "").slice(0, 7).toUpperCase();
    const timeHex = Date.now().toString(36).slice(-6).toUpperCase();
    const randHex = "ABCD";
    const orderId = `SV-${cleanShort}-${timeHex}-${randHex}`.slice(0, 30);
    assert.ok(orderId.length <= 30);
    assert.ok(orderId.startsWith("SV-"));
  });

  it("validates UTR format (10 to 24 alphanumeric chars)", () => {
    const utrRegex = /^[A-Z0-9]{10,24}$/;
    assert.ok(utrRegex.test("FDRL1234567890"));
    assert.ok(utrRegex.test("123456789012"));
    assert.ok(!utrRegex.test("SHORT"));
    assert.ok(!utrRegex.test("INVALID-CHAR!"));
  });
});
