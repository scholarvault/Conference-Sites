## 2025-02-25 - HTML Injection in Email Templates
**Vulnerability:** The Edge Function handling email sending (`aihealth/api/send-email.ts`) directly interpolated user-provided JSON payload data into raw HTML templates (e.g., `${d.name}`, `${d.institution}`).
**Learning:** This exposes the platform to Server-Side HTML injection/Email XSS. An attacker could inject malicious links, images, or layout-breaking HTML into emails sent to themselves or, more critically, into notification emails sent to administrators or other users.
**Prevention:** Always sanitize/HTML-escape user input before interpolating it into HTML templates on the server-side.
