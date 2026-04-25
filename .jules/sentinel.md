## 2024-04-24 - HTML Injection Vulnerability in Email Templates
**Vulnerability:** Unsanitized user input was being directly injected into email templates across multiple Vercel Edge functions (`send-email.ts`), leading to potential HTML injection and Cross-Site Scripting (XSS) via email clients.
**Learning:** Directly passing unvalidated API request data (e.g., user names) into string-templated HTML emails risks execution of malicious payload, impacting both users receiving emails and admins if reviewing these inputs.
**Prevention:** Always ensure an `escapeHtml` function is used for string properties in payload data before feeding them into email rendering functions.

## 2026-04-25 - XSS Payload Bypass via Non-String Inputs
**Vulnerability:** XSS sanitization in email templates was checking `typeof data[key] === "string"`. By providing an array instead of a string (e.g., `["<script>alert(1)</script>"]`), an attacker could bypass the `escapeHtml` function, leading to direct interpolation and HTML injection.
**Learning:** Checking for string types allows objects/arrays to slip past sanitization checks when these inputs are implicitly stringified during template interpolation.
**Prevention:** Always convert inputs to strings explicitly (e.g., `String(val)`) before applying sanitization, or strictly validate input types at the entry boundary.
