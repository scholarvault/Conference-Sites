## 2025-05-18 - Lazy Loading Navbar Logo Anti-Pattern
**Learning:** Adding `loading="lazy"` to above-the-fold elements (like the main navbar logo or hero images) can actually delay the Largest Contentful Paint (LCP) and cause a slight perceived performance regression for the initial viewport.
**Action:** When implementing lazy loading for images across a codebase, ensure that it's only applied to elements that are below the fold (e.g. footers, payment logos, QR codes, lower-page content) and exclude main above-the-fold assets.
## 2026-08-22 - Unoptimized Render Loops
**Learning:** Continuous `requestAnimationFrame` loops on canvas elements and 3D UI elements run even when out of view or not interacting with them. This causes unnecessary continuous CPU/GPU usage, draining battery and affecting scroll performance on slower devices.
**Action:** Always use `IntersectionObserver` to pause off-screen animations, and make sure that interaction-driven animations only render when interacting and settling to the final position.
## 2026-08-22 - Throttled Scroll Events
**Learning:** Continuous unthrottled `scroll` event listeners block the main thread by firing too often during smooth scrolling, potentially delaying the next frame calculation.
**Action:** When implementing scroll listeners for visual updates like navbar styling or progress bars, use a `requestAnimationFrame` ticking pattern to ensure the DOM is updated synchronously with the browser's render cycle at most once per frame.
## 2025-05-18 - Math.sqrt in Animation Loops
**Learning:** Calculating `Math.sqrt` for Euclidean distance inside nested `O(n^2)` render loops (like particle connections) creates significant CPU overhead per frame.
**Action:** When evaluating distance thresholds, compare squared distances (`dx*dx + dy*dy`) against the squared threshold first. Only invoke `Math.sqrt` if the threshold is met and the precise distance value is needed for visual rendering.
## 2026-08-22 - Pointermove Throttling
**Learning:** Continuous unthrottled `pointermove` or `mousemove` event listeners block the main thread by firing too often during mouse movement, potentially delaying the next frame calculation and causing layout thrashing when triggering reflows.
**Action:** When implementing pointer listeners for visual updates like spotlight effects, use a `requestAnimationFrame` ticking pattern to ensure the DOM is updated synchronously with the browser's render cycle at most once per frame, just like with scroll events.
