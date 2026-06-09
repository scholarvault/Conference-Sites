## 2026-05-27 - DOM XSS via Inline Event Handlers
**Vulnerability:** User-controlled data (e.g., `person.name`, `p.id`) from the database was being injected directly into JavaScript function calls within HTML event handler attributes (e.g., `onclick="deletePerson('...')"`). The variables were either unescaped entirely or only passed through an HTML entity encoder (which the browser decodes *before* JS execution), allowing an attacker to break out of the string literal and execute arbitrary code by injecting quotes or backslashes.
**Learning:** HTML entities (`&#039;`, `&quot;`) inside HTML attributes are decoded by the parser before the attribute's content is evaluated as JavaScript. Thus, merely using `escapeHtml()` provides no protection against DOM XSS in this specific context.
**Prevention:** To safely inject dynamic data into inline JS event attributes, apply a strict two-stage escape: first escape all JavaScript context-breaking characters (`\`, `'`, `"`, `\n`, `\r`), and *then* escape the resulting string for HTML using `escapeHtml()` before interpolating it into the attribute.

## 2026-05-30 - DOM XSS via innerHTML
**Vulnerability:** User-controlled data (e.g., `utr`) from a form input was directly injected into the DOM via `innerHTML` without sanitization.
**Learning:** Even when interpolating variables into template literals that represent HTML blocks, all user input must be sanitized before assignment to `innerHTML`. The `escapeHtml` helper in this repository works well for this since it isn't an inline event attribute context.
**Prevention:** Use `escapeHtml()` on all user input variables before inserting them into an HTML string assigned to `innerHTML` or use safer DOM manipulation methods (e.g., `textContent`).
## 2026-06-09 - DOM XSS via innerHTML in Error Handling
**Vulnerability:** External error messages (e.g., from database queries) were being interpolated directly into `innerHTML` without sanitization.
**Learning:** When applying sanitization helpers like `escapeHtml()`, ensure the file injecting the code actually has access to the helper function (e.g., via a `<script>` tag). Also, always sanitize external error messages because they can be manipulated to reflect malicious payloads.
**Prevention:** Apply `escapeHtml()` to all externally sourced strings, including error messages, before interpolating them into HTML strings that will be assigned to `innerHTML`. Verify helper script inclusion before relying on custom functions.
