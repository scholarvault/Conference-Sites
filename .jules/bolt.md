## 2025-05-18 - Lazy Loading Navbar Logo Anti-Pattern
**Learning:** Adding `loading="lazy"` to above-the-fold elements (like the main navbar logo or hero images) can actually delay the Largest Contentful Paint (LCP) and cause a slight perceived performance regression for the initial viewport.
**Action:** When implementing lazy loading for images across a codebase, ensure that it's only applied to elements that are below the fold (e.g. footers, payment logos, QR codes, lower-page content) and exclude main above-the-fold assets.
## 2026-08-22 - Unoptimized Render Loops
**Learning:** Continuous `requestAnimationFrame` loops on canvas elements and 3D UI elements run even when out of view or not interacting with them. This causes unnecessary continuous CPU/GPU usage, draining battery and affecting scroll performance on slower devices.
**Action:** Always use `IntersectionObserver` to pause off-screen animations, and make sure that interaction-driven animations only render when interacting and settling to the final position.
