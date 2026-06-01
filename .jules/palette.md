## 2025-02-20 - Missing ARIA labels on dynamic icon-only buttons
**Learning:** Dynamically generated icon-only buttons (like Share and LinkedIn links) injected via JS often miss critical accessibility attributes because they aren't part of the static HTML linting.
**Action:** Always verify accessibility attributes like `aria-label` when generating HTML strings for interactive elements in JavaScript (e.g. `aihealth/js/people-loader.js`).
## 2025-05-27 - Missing ARIA labels on inline forms using placeholders
**Learning:** Inline forms (like newsletter subscriptions) often use `placeholder` text as the only visual label for brevity, omitting an explicit `<label>` element. While visually clean, screen readers may not read placeholders reliably, making the input inaccessible.
**Action:** Always add a descriptive `aria-label` attribute (e.g., `aria-label="Your email address"`) to inputs in inline forms that rely solely on visual placeholders.
## 2025-05-30 - Missing aria-expanded on script-initialized accordions
**Learning:** FAQ accordions initialized via JavaScript often miss the critical `aria-expanded` attribute, leaving screen reader users unaware of the accordion's state (open vs. closed). While the visual state is updated via CSS classes, the accessibility state must be explicitly mirrored in the DOM.
**Action:** Always verify that custom JavaScript-based accordions dynamically toggle `aria-expanded` on the trigger button, initializing it to `"false"` and updating it to `"true"` when opened.
