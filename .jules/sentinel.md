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

## 2026-04-28 - Stored DOM XSS from Unsanitized Database Output via innerHTML
**Vulnerability:** User-provided profiles (e.g., speakers and committee members) fetched from the database were being rendered onto the page by directly interpolating data properties into template literals assigned to `innerHTML`. This created a Stored DOM XSS vulnerability where malicious scripts saved in the database (e.g., via profile submission forms) could execute when the profile list was viewed.
**Learning:** Even if data is safely inserted into a database without executing (e.g., via an ORM or parameterized queries), rendering it dynamically to the DOM using `innerHTML` and template literals without prior HTML encoding re-introduces XSS risks on the client-side.
**Prevention:** When using `innerHTML` to construct UI elements from dynamic database content, always pass the string fields through an `escapeHtml()` utility function before interpolation to neutralize any HTML tags or event handlers.

## 2024-05-18 - Overly Permissive CORS Configuration in Edge Functions
**Vulnerability:** The Vercel Edge API functions (`api/send-email.ts`) across multiple sub-projects were using wildcard (`*`) for `Access-Control-Allow-Origin`, allowing any domain to send emails via the endpoints.
**Learning:** Developers often default to wildcard CORS for simplicity during initial setup or testing of serverless functions, leaving the endpoint open to abuse from unauthorized domains if it's not secured prior to production.
**Prevention:** Implement a standardized `ALLOWED_ORIGINS` array containing trusted domains and dynamically validate the `Origin` header returning either the matched allowed origin or a safe fallback default. Always include the `Vary: Origin` header.

## 2026-05-10 - Hardcoded Admin Credentials in Frontend
**Vulnerability:** A static HTML file (`aihealth/admin.html`) contained hardcoded plaintext credentials (`var ADMIN_USER = 'Shyam'; var ADMIN_PASS = '12345678';`) and implemented fake client-side authentication by setting a key in `sessionStorage`. Anyone inspecting the page source could bypass the login and access the admin dashboard to manage speakers and committee members.
**Learning:** Client-side "authentication" utilizing hardcoded plaintext strings and browser storage flags is fundamentally insecure, effectively exposing the protected endpoints and underlying database functions to any unauthenticated visitor.
**Prevention:** For authenticated sections within static HTML files (like admin dashboards), utilize the globally available Supabase client (`db` imported from `js/main.js`) via `db.auth.signInWithPassword` and `db.auth.getSession()` rather than using insecure client-side logic and `sessionStorage` bypasses.

## 2026-05-12 - DOM XSS via JS Event Handlers (onclick) Escaping Flaw
**Vulnerability:** When dynamically constructing HTML buttons with `onclick` handlers in `aihealth/js/people-loader.js` and `aihealth/admin.html`, the user-supplied data (e.g., speaker names, talk types) was only having single quotes naively escaped (`replace(/'/g, "\\'")`). This allowed an attacker to inject backslashes (e.g., submitting `name = "test\\"`), which escaped the backslash itself (`\\\'`), breaking the string literal and allowing arbitrary JavaScript execution.
**Learning:** To safely inject dynamic data into JavaScript string literals within HTML attributes, escaping only quotes is insufficient. Context-breaking characters like backslashes must be escaped first, and then the whole string should ideally be HTML-entity encoded to prevent both JS breakout and HTML markup injection.
**Prevention:** Create a robust escaping function for JS within HTML attributes: `str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r')`, and then wrap the output in `escapeHtml()`.
