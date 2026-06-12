## 2026-05-27 - DOM XSS via Inline Event Handlers
**Vulnerability:** User-controlled data (e.g., `person.name`, `p.id`) from the database was being injected directly into JavaScript function calls within HTML event handler attributes (e.g., `onclick="deletePerson('...')"`). The variables were either unescaped entirely or only passed through an HTML entity encoder (which the browser decodes *before* JS execution), allowing an attacker to break out of the string literal and execute arbitrary code by injecting quotes or backslashes.
**Learning:** HTML entities (`&#039;`, `&quot;`) inside HTML attributes are decoded by the parser before the attribute's content is evaluated as JavaScript. Thus, merely using `escapeHtml()` provides no protection against DOM XSS in this specific context.
**Prevention:** To safely inject dynamic data into inline JS event attributes, apply a strict two-stage escape: first escape all JavaScript context-breaking characters (`\`, `'`, `"`, `\n`, `\r`), and *then* escape the resulting string for HTML using `escapeHtml()` before interpolating it into the attribute.

## 2026-05-30 - DOM XSS via innerHTML
**Vulnerability:** User-controlled data (e.g., `utr`) from a form input was directly injected into the DOM via `innerHTML` without sanitization.
**Learning:** Even when interpolating variables into template literals that represent HTML blocks, all user input must be sanitized before assignment to `innerHTML`. The `escapeHtml` helper in this repository works well for this since it isn't an inline event attribute context.
**Prevention:** Use `escapeHtml()` on all user input variables before inserting them into an HTML string assigned to `innerHTML` or use safer DOM manipulation methods (e.g., `textContent`).

## 2026-06-03 - DOM XSS via Error Messages
**Vulnerability:** Supabase error messages (`error.message`) were directly injected into the DOM via `innerHTML` without sanitization when database operations failed (e.g., loading speakers, committee, or papers).
**Learning:** Even internal system errors or API responses can be a source of XSS if they reflect user input or are somehow manipulated to include HTML tags. Any data that is going to be assigned to `innerHTML` must be treated as untrusted and sanitized.
**Prevention:** Always use `escapeHtml()` (or equivalent sanitization) when injecting error messages into HTML strings, or alternatively use `textContent` to safely display error text.
