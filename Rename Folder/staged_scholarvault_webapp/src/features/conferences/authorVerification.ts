import { createHmac, createHash, randomInt, timingSafeEqual } from "node:crypto";
import type { AuthorVerificationTokenPayload } from "./types";

function getAuthSecret(): string {
  return (
    process.env.CONFERENCE_AUTH_SECRET ||
    process.env.CLERK_SECRET_KEY ||
    "scholarvault_author_verification_secret_safe_default"
  );
}

/**
 * Normalizes and hashes an email or IP address using SHA-256 for privacy protection.
 */
export function hashIdentifier(input: string): string {
  const normalized = input.trim().toLowerCase();
  return createHash("sha256").update(normalized).digest("hex");
}

/**
 * Generates a cryptographically strong 6-digit numeric OTP.
 */
export function generateSecureOtp(): string {
  return randomInt(100000, 1000000).toString();
}

/**
 * Hashes a 6-digit OTP code before database persistence.
 */
export function hashOtp(code: string): string {
  return createHash("sha256").update(code.trim()).digest("hex");
}

/**
 * Verifies a candidate OTP against a stored hash using timing-safe comparison.
 */
export function verifyOtpTimingSafe(userCode: string, storedHash: string): boolean {
  try {
    const candidateHash = hashOtp(userCode);
    const bufA = Buffer.from(candidateHash, "hex");
    const bufB = Buffer.from(storedHash, "hex");
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/**
 * Generates a signed, tamper-proof verification token cryptographically binding the author to the submission.
 */
export function generateAuthorVerificationToken(
  payload: Omit<AuthorVerificationTokenPayload, "exp" | "purpose"> & { expMs?: number }
): string {
  const secret = getAuthSecret();
  const tokenPayload: AuthorVerificationTokenPayload = {
    challengeId: payload.challengeId,
    verifiedEmailHash: payload.verifiedEmailHash,
    editionId: payload.editionId,
    selectedSubmissionId: payload.selectedSubmissionId,
    purpose: "conference_author_registration",
    exp: Date.now() + (payload.expMs || 60 * 60 * 1000), // 1 hour validity
  };

  const encodedPayload = Buffer.from(JSON.stringify(tokenPayload)).toString("base64url");
  const signature = createHmac("sha256", secret).update(encodedPayload).digest("base64url");

  return `${encodedPayload}.${signature}`;
}

/**
 * Verifies and decodes an author verification token.
 * Rejects expired tokens or signatures tampered with in transit.
 */
export function verifyAuthorVerificationToken(token: string): AuthorVerificationTokenPayload | null {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const secret = getAuthSecret();
  const expectedSig = createHmac("sha256", secret).update(encodedPayload).digest("base64url");

  const sigBuf = Buffer.from(signature);
  const expectedSigBuf = Buffer.from(expectedSig);

  if (sigBuf.length !== expectedSigBuf.length) return null;
  if (!timingSafeEqual(sigBuf, expectedSigBuf)) return null;

  try {
    const jsonStr = Buffer.from(encodedPayload, "base64url").toString("utf8");
    const payload = JSON.parse(jsonStr) as AuthorVerificationTokenPayload;

    if (payload.purpose !== "conference_author_registration") return null;
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    if (!payload.selectedSubmissionId || !payload.verifiedEmailHash) return null;

    return payload;
  } catch {
    return null;
  }
}
