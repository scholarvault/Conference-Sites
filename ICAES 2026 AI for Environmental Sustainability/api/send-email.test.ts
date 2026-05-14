import { expect, test, describe } from "bun:test";
import { getCorsHeaders, ALLOWED_ORIGINS } from "./send-email";

describe("getCorsHeaders", () => {
  test("should allow origins in ALLOWED_ORIGINS", () => {
    for (const origin of ALLOWED_ORIGINS) {
      const req = new Request("https://example.com", {
        headers: { Origin: origin },
      });
      const headers = getCorsHeaders(req);
      expect(headers["Access-Control-Allow-Origin"]).toBe(origin);
    }
  });

  test("should fallback to default origin for disallowed origins", () => {
    const disallowedOrigin = "https://malicious.com";
    const req = new Request("https://example.com", {
      headers: { Origin: disallowedOrigin },
    });
    const headers = getCorsHeaders(req);
    expect(headers["Access-Control-Allow-Origin"]).toBe("https://isiaisgs2026.scholarvault.in");
    expect(headers["Access-Control-Allow-Origin"]).not.toBe(disallowedOrigin);
  });

  test("should fallback to default origin when Origin header is missing", () => {
    const req = new Request("https://example.com");
    const headers = getCorsHeaders(req);
    expect(headers["Access-Control-Allow-Origin"]).toBe("https://isiaisgs2026.scholarvault.in");
  });

  test("should include required CORS headers", () => {
    const req = new Request("https://example.com");
    const headers = getCorsHeaders(req);
    expect(headers["Access-Control-Allow-Headers"]).toBe("Content-Type, Authorization");
    expect(headers["Access-Control-Allow-Methods"]).toBe("POST, OPTIONS");
    expect(headers["Vary"]).toBe("Origin");
  });
});
