## 2025-02-20 - Missing ARIA labels on dynamic icon-only buttons
**Learning:** Dynamically generated icon-only buttons (like Share and LinkedIn links) injected via JS often miss critical accessibility attributes because they aren't part of the static HTML linting.
**Action:** Always verify accessibility attributes like `aria-label` when generating HTML strings for interactive elements in JavaScript (e.g. `aihealth/js/people-loader.js`).

## 2026-04-26 - Missing `aria-label` on inline forms
**Learning:** Found inline forms (like newsletter subscriptions) that use `placeholder` text visually, but completely lack an explicit `<label>` tag or `aria-label` attribute. This is an accessibility issue because screen readers do not always read placeholders reliably as the primary accessible name.
**Action:** Always add an explicit `aria-label` to form inputs that do not have a programmatic `<label>` associated with them via the `id`/`for` attribute (e.g. inline inputs like `<input type="email" placeholder="..." />`).
