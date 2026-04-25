## 2024-05-13 - [Initial Setup]
**Learning:** Initialized Palette journal for UX/a11y insights.
**Action:** Use this file to record critical UX/a11y learnings.

## 2024-05-14 - [Mobile Menu Dynamic ARIA Attributes]
**Learning:** Hamburger menu toggle buttons need more than just `aria-label="Menu"`—screen readers need state context via `aria-expanded` to know if the menu is actively open or closed.
**Action:** When creating or modifying mobile navigation toggles across ScholarVault sub-projects, always pair the static `aria-label` with a dynamic `aria-expanded` attribute that is updated via JavaScript alongside CSS class changes.
