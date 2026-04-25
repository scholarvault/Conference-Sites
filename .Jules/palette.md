## 2024-05-13 - [Initial Setup]
**Learning:** Initialized Palette journal for UX/a11y insights.
**Action:** Use this file to record critical UX/a11y learnings.

## 2024-06-25 - [Scroll to Top Accessibility]
**Learning:** Icon-only floating action buttons like "Scroll to Top" often lack `aria-label` and `aria-hidden` on inner SVGs, causing screen readers to misinterpret them.
**Action:** Always verify floating action buttons and icon-only buttons include an `aria-label` to provide context and an `aria-hidden="true"` on inner SVGs to prevent verbose, confusing output.
