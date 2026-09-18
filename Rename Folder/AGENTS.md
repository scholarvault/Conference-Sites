# ScholarVault Workspace Rules & Guidelines

## 1. Plan First, Discuss First, Code Second
Before modifying any source file or running any modifying command:
- State the proposed action in clear, plain English using this exact 4-part structure:
  1. **What is the issue?** (The root cause and why it happens)
  2. **What is the current state?** (The current file, line, or database condition)
  3. **What will the fix do?** (The exact change and why it solves the problem)
  4. **Verification**: (How we will prove it works without breaking anything)
- Never rush to edit code or make ad-hoc file changes before confirming the plan with the user.

## 2. Gateway & Environment Purity
- Never introduce makeshift test-mode fallbacks, ad-hoc environment toggles, or sandbox auto-switching to payment routes (Dodo Payments, Federal Bank Omniware) unless explicitly instructed by the user.
- Respect configured keys and target release schedules. If a gateway returns 401 in preview because only live keys exist, explain the exact environment discrepancy rather than hacking the route to toggle environments.
- Preview and staging branches must remain clean, predictable, and faithful to production architecture.

## 3. Production Key Gate & Branch Discipline
- Live Federal Bank production keys will be issued on September 16. Until that date, NEVER push to the `main` branch.
- All testing, improvements, and fixes must strictly be committed, verified, and pushed to `preview` (Web App) and `codex/svrias-futuristic-intake` (Conference Site).
