## 2025-02-20 - Missing ARIA labels on dynamic icon-only buttons
**Learning:** Dynamically generated icon-only buttons (like Share and LinkedIn links) injected via JS often miss critical accessibility attributes because they aren't part of the static HTML linting.
**Action:** Always verify accessibility attributes like `aria-label` when generating HTML strings for interactive elements in JavaScript (e.g. `aihealth/js/people-loader.js`).
