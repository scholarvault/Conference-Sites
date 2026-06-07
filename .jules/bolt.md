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
## 2025-05-18 - requestAnimationFrame State Synchronization
**Learning:** When throttling high-frequency event listeners (like `mousemove` or `scroll`) using `requestAnimationFrame`, closing over the initial event object (`e`) and reading its values inside the callback will result in stale data processing. The render frame will compute logic based on the state when the frame was *requested*, rather than the state when the frame *executes*.
**Action:** When implementing an rAF throttle, always store the most recent event data (like `clientX`/`clientY`) in variables outside the `requestAnimationFrame` block, and read from those variables inside the callback to ensure the render uses the freshest data.
## 2026-05-27 - requestAnimationFrame Reset Race Condition
**Learning:** When using `requestAnimationFrame` to throttle mousemove events, queued frames can execute AFTER a `mouseleave` event has already reset the visual state (like rotation variables). This race condition causes the UI to incorrectly jump back to the hovered state instead of remaining reset.
**Action:** Always store the returned request ID from `requestAnimationFrame` and explicitly call `cancelAnimationFrame` inside the corresponding `mouseleave` (or cancel) handler to ensure no queued renders overwrite the reset state.
## 2026-08-22 - Layout Thrashing with getBoundingClientRect
**Learning:** Invoking `getBoundingClientRect()` repeatedly inside a `requestAnimationFrame` loop (like during high-frequency mouse moves) combined with style writes forces synchronous layout recalculation, leading to severe layout thrashing.
**Action:** Cache the bounding rects on events like `mouseenter` using absolute coordinates (`rect.left + window.scrollX`), and use `e.pageX/e.pageY` against this cache during the render loop instead of calculating the layout live.
## 2026-08-22 - Global Mousemove Tracking Anti-Pattern
**Learning:** Attaching high-frequency event listeners like `mousemove` directly to `document` or `window` for a localized UI effect (like a hero spotlight) means the browser continuously fires events and processes callbacks even when the user is interacting with completely unrelated parts of the page, wasting CPU and battery.
**Action:** Always scope high-frequency pointer/mouse event listeners to the specific container element where the effect is visible or active, and ensure proper cleanup (e.g., `cancelAnimationFrame` on `mouseleave`) when the cursor exits that container.
