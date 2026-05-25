## 2025-02-20 - Missing ARIA labels on dynamic icon-only buttons
**Learning:** Dynamically generated icon-only buttons (like Share and LinkedIn links) injected via JS often miss critical accessibility attributes because they aren't part of the static HTML linting.
**Action:** Always verify accessibility attributes like `aria-label` when generating HTML strings for interactive elements in JavaScript (e.g. `aihealth/js/people-loader.js`).
## 2024-05-25 - Dynamic Element Accessibility
**Learning:** When injecting dynamically generated interactive elements via JavaScript (like the people-loader cards), static HTML linting won't catch missing accessibility attributes.
**Action:** Always verify ARIA attributes on JavaScript templates and ensure icon-only buttons receive `aria-label`s and `aria-hidden="true"` on their SVGs during string interpolation.
