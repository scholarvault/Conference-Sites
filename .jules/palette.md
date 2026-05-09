## 2024-05-02 - Proper State Restoration on Form Buttons
**Learning:** The generic `setFormLoading` helper manages loading states by replacing button text with a spinner, but it requires the original text to be explicitly stored via a `data-default-text` attribute. Without it, buttons silently fall back to a generic "Submit", losing their original contextual CTA (e.g. "Send Message →" or "Submit Paper →").
**Action:** When working with forms across these static pages, ensure all form submit buttons explicitly declare `data-default-text="Original CTA"` to maintain consistency during state transitions.
## 2026-05-03 - Added ARIA labels to notify modal in conf-hub
**Learning:** Found inputs in the `notifyForm` that lacked `label` elements and `aria-label` attributes, relying solely on `placeholder` attributes. This is a common accessibility issue for screen readers. The modal close button was also just an "X" character without an `aria-label`.
**Action:** Always ensure that icon-only buttons and input fields (especially in modals or forms without explicit `<label>` tags) have descriptive `aria-label` attributes to ensure they are properly announced by screen readers.

## 2025-02-23 - Dynamic ARIA Initialization for Accordions
**Learning:** When working with FAQ accordions in the ScholarVault sub-projects (like ICAES 2026), manual HTML modifications for ARIA attributes (`aria-expanded`, `aria-controls`) risk being overwritten by static site generators.
**Action:** Inject ARIA attributes dynamically within the components' initialization scripts (e.g., `initFaq()` in `js/main.js`) to ensure accessibility states are robust and avoid generator conflicts.
