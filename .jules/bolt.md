## 2024-04-21 - Expensive calculations in O(n²) loops
**Learning:** Found a common performance bottleneck where expensive mathematical functions like `Math.sqrt()` are called inside O(n²) nested loops (like background particle animation frames checking distances).
**Action:** Always check if a cheaper comparative operation (like squared distance vs squared threshold) can be used to early-exit before performing the expensive calculation.
