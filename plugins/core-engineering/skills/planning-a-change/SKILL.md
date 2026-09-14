---
name: planning-a-change
disable-model-invocation: true
description: >
  Write a short change plan before coding a bounded task. Use when asked to plan a small change. Full plan → create-plan.
---

# Planning a change

One-sentence diff → just do it. Plan-only → `create-plan` (`/plan`). Stress-test → `review-plan`. After a non-trivial build → `review-build`.

- Don't edit during explore.
- Two course-corrections → stop and re-plan.
- Don't weaken `create-plan` / `no-shortcuts` / `definition-of-done`.

## Pairs with

- rules: `create-plan-rule`, `no-shortcuts`, `size-limits`, `testing-conventions`, `definition-of-done`
- skills: `create-plan`, `review-plan`, `review-build`, `reviewing-and-shipping`, `debugging-an-issue`
- commands: `plan` (`/plan`), `review-plan-cmd` (`/review-plan`), `review-build-cmd` (`/review-build`)
- workflows: `ship-a-feature`, `plan-then-build`, `onboard-to-codebase`, `run-autonomous-loop`,
  `clear-the-queue`
