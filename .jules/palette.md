## 2025-02-20 - Missing ARIA labels on dynamic icon-only buttons
**Learning:** Dynamically generated icon-only buttons (like Share and LinkedIn links) injected via JS often miss critical accessibility attributes because they aren't part of the static HTML linting.
**Action:** Always verify accessibility attributes like `aria-label` when generating HTML strings for interactive elements in JavaScript (e.g. `aihealth/js/people-loader.js`).
## 2025-05-27 - Missing ARIA labels on inline forms using placeholders
**Learning:** Inline forms (like newsletter subscriptions) often use `placeholder` text as the only visual label for brevity, omitting an explicit `<label>` element. While visually clean, screen readers may not read placeholders reliably, making the input inaccessible.
**Action:** Always add a descriptive `aria-label` attribute (e.g., `aria-label="Your email address"`) to inputs in inline forms that rely solely on visual placeholders.
## 2025-06-01 - Missing ARIA labels on FAQ accordions
**Learning:** Custom interactive UI elements like FAQ accordions built without native `<details>` elements often lack `aria-expanded` attributes. This prevents screen readers from announcing whether the content is currently visible or hidden.
**Action:** Always ensure that custom toggle buttons explicitly set and dynamically update the `aria-expanded` attribute based on the content's visibility state.
