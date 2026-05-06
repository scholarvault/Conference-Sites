## 2024-05-02 - Proper State Restoration on Form Buttons
**Learning:** The generic `setFormLoading` helper manages loading states by replacing button text with a spinner, but it requires the original text to be explicitly stored via a `data-default-text` attribute. Without it, buttons silently fall back to a generic "Submit", losing their original contextual CTA (e.g. "Send Message →" or "Submit Paper →").
**Action:** When working with forms across these static pages, ensure all form submit buttons explicitly declare `data-default-text="Original CTA"` to maintain consistency during state transitions.
## 2026-05-03 - Added ARIA labels to notify modal in conf-hub
**Learning:** Found inputs in the `notifyForm` that lacked `label` elements and `aria-label` attributes, relying solely on `placeholder` attributes. This is a common accessibility issue for screen readers. The modal close button was also just an "X" character without an `aria-label`.
**Action:** Always ensure that icon-only buttons and input fields (especially in modals or forms without explicit `<label>` tags) have descriptive `aria-label` attributes to ensure they are properly announced by screen readers.
## 2026-05-06 - Added ARIA expanded to custom FAQ accordions
**Learning:** Found custom FAQ accordion elements built with `<button>` and `<div>` tags instead of native `<details>`/`<summary>`. While visually functional, these custom toggles lacked `aria-expanded` attributes, making it impossible for screen readers to know if the accordion was open or closed.
**Action:** When working with custom accordion or toggle components (not native `<details>`), always initialize them with `aria-expanded="false"` in the HTML and dynamically update the attribute to `"true"` or `"false"` in the JavaScript click handler.
