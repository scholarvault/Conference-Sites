## 2024-04-24 - HTML Injection Vulnerability in Email Templates
**Vulnerability:** Unsanitized user input was being directly injected into email templates across multiple Vercel Edge functions (`send-email.ts`), leading to potential HTML injection and Cross-Site Scripting (XSS) via email clients.
**Learning:** Directly passing unvalidated API request data (e.g., user names) into string-templated HTML emails risks execution of malicious payload, impacting both users receiving emails and admins if reviewing these inputs.
**Prevention:** Always ensure an `escapeHtml` function is used for string properties in payload data before feeding them into email rendering functions.

## 2026-04-25 - XSS Payload Bypass via Non-String Inputs
**Vulnerability:** XSS sanitization in email templates was checking `typeof data[key] === "string"`. By providing an array instead of a string (e.g., `["<script>alert(1)</script>"]`), an attacker could bypass the `escapeHtml` function, leading to direct interpolation and HTML injection.
**Learning:** Checking for string types allows objects/arrays to slip past sanitization checks when these inputs are implicitly stringified during template interpolation.
**Prevention:** Always convert inputs to strings explicitly (e.g., `String(val)`) before applying sanitization, or strictly validate input types at the entry boundary.

## 2026-04-26 - DOM XSS in Toast Notifications
**Vulnerability:** Unsanitized user input was being directly injected into the DOM via `innerHTML` within the shared `showToast` UI function. For example, subscribing with `<script>alert(1)</script>` or displaying an error message containing unsanitized input would execute malicious code.
**Learning:** Using template literals with `innerHTML` to display dynamic user feedback exposes the client to DOM-based Cross-Site Scripting (XSS).
**Prevention:** When creating UI elements dynamically, define the HTML structure safely and inject dynamic values using `textContent` (e.g., `element.querySelector('.toast-msg').textContent = message`) to ensure the input is treated strictly as text.

## 2026-04-27 - DOM XSS in Content Rendering (innerHTML)
**Vulnerability:** Unsanitized user data from Supabase was being directly mapped into HTML strings and injected into the DOM via `innerHTML` in `speakers.html` and `committee.html`.
**Learning:** Even though the data is fetched securely from a database, it represents user-supplied content (applications). Rendering it dynamically using template literals inside `innerHTML` without escaping leads to Stored Cross-Site Scripting (XSS).
**Prevention:** Always use a global `escapeHtml` utility when interpolating dynamic data into `innerHTML` strings, or use `textContent` where applicable to avoid HTML parsing.
