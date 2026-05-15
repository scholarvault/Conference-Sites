## 2025-02-20 - Missing ARIA labels on dynamic icon-only buttons
**Learning:** Dynamically generated icon-only buttons (like Share and LinkedIn links) injected via JS often miss critical accessibility attributes because they aren't part of the static HTML linting.
**Action:** Always verify accessibility attributes like `aria-label` when generating HTML strings for interactive elements in JavaScript (e.g. `aihealth/js/people-loader.js`).

## 2024-05-18 - Accessibility on Inline Newsletter Inputs
**Learning:** Found multiple instances of inline newsletter subscription forms that relied solely on `placeholder` text for input identification. Screen reader users rely on `aria-label` when standard explicit `<label>` elements are omitted for visual brevity.
**Action:** Always verify that input fields inside inline forms (such as `newsletter-strip` components) have an explicit `aria-label` corresponding to the expected data, even when `placeholder` text is visually present.
