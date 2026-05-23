## 2025-02-20 - Missing ARIA labels on dynamic icon-only buttons
**Learning:** Dynamically generated icon-only buttons (like Share and LinkedIn links) injected via JS often miss critical accessibility attributes because they aren't part of the static HTML linting.
**Action:** Always verify accessibility attributes like `aria-label` when generating HTML strings for interactive elements in JavaScript (e.g. `aihealth/js/people-loader.js`).

## 2023-10-27 - Custom FAQ Accordion Accessibility
**Learning:** Custom accordion implementations using `max-height` transitions often use `<button>` tags without proper ARIA attributes to indicate state.
**Action:** Always ensure accordion buttons have `aria-expanded` reflecting their open/closed state, and `aria-controls` pointing to the `id` of the content panel they toggle. Update these attributes via JavaScript during state changes.
