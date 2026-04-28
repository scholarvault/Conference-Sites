1. **Analyze:** There are several unthrottled `scroll` event listeners attached to the `window` object in `ICAES 2026 AI for Environmental Sustainability/js/main.js`. These are in `initNavbar`, `initScrollTop`, and `initParallax`.
2. **Optimize:** I will update these functions to use a `requestAnimationFrame` (rAF) throttle tick variable to prevent layout thrashing and high CPU usage by only executing scroll handlers at most once per frame. This aligns with Bolt's "Throttled Scroll Events" guideline in `.jules/bolt.md`.
3. **Verify:** Use `node -c` to verify the modified javascript file's syntax.
4. **Pre-commit:** Run the `pre_commit_instructions` tool to run checking tools.
5. **Submit:** Submit the PR as `⚡ Bolt: [performance improvement]`.
