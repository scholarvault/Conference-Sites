## 2025-02-20 - Missing ARIA labels on dynamic icon-only buttons
**Learning:** Dynamically generated icon-only buttons (like Share and LinkedIn links) injected via JS often miss critical accessibility attributes because they aren't part of the static HTML linting.
**Action:** Always verify accessibility attributes like `aria-label` when generating HTML strings for interactive elements in JavaScript (e.g. `aihealth/js/people-loader.js`).

## 2024-05-17 - Added aria-label to inputs without labels
**Learning:** Found several input fields, particularly inline email subscription forms and admin login inputs across `aihealth` and `ICAES` apps, that relied visually on `placeholder` attributes and had no explicitly associated `<label>` element, causing accessibility issues for screen readers.
**Action:** Added `aria-label` attributes to these inputs to ensure proper screen reader accessibility without changing the visual layout of inline forms.
