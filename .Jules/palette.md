## 2024-05-13 - [Initial Setup]
**Learning:** Initialized Palette journal for UX/a11y insights.
**Action:** Use this file to record critical UX/a11y learnings.

## 2024-05-14 - [Mobile Menu Dynamic ARIA Attributes]
**Learning:** Hamburger menu toggle buttons need more than just `aria-label="Menu"`—screen readers need state context via `aria-expanded` to know if the menu is actively open or closed.
**Action:** When creating or modifying mobile navigation toggles across ScholarVault sub-projects, always pair the static `aria-label` with a dynamic `aria-expanded` attribute that is updated via JavaScript alongside CSS class changes.

## 2026-04-26 - Missing `aria-hidden` and `aria-label` on floating action icon buttons
**Learning:** Found floating action buttons (like scroll to top) missing `aria-label` and `aria-hidden="true"` on their inner SVGs. While they might have a `title` attribute, an explicit `aria-label` on the button and `aria-hidden="true"` on the SVG ensures screen readers provide clear context without verbose/confusing output about the SVG structure itself.
**Action:** When working with floating action buttons or icon-only buttons in the UI, consistently apply `aria-hidden="true"` on their inner SVGs and ensure the button element has a clear, descriptive `aria-label`.
