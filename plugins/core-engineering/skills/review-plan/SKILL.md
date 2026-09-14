---
name: review-plan
description: >
  Stress-test and rewrite an existing plan before coding. Use for "review the plan". Do not implement.
---

# Review a plan

**Rewrite the plan** until it meets the `create-plan` bar. Chat-only
critique is a failure. Do not implement until the user clicks **Build** or
asks after approval. Routing: `_shared/plan-build-family.md`.

Read `.cursor/rules/review-plan.mdc`. Edit the plan + workspace research
`.md` and refresh **CreatePlan** so **Build** matches
(`create-plan/references/cursor-native-plan.md`).

## Workflow

1. Locate the plan; re-read it, live code, and owning docs.
2. Spec-review (scope, binary ACs, contracts, named deps, rollback,
   surfaces, traceability, no stubs). Block coding when those are open.
3. Fresh external research aimed at **holes**. Adopt / adapt / reject with URLs.
4. Pre-mortem: 3–5 failure narratives + mitigations; name one unchosen alternative.
5. All **P0/P1 into the plan file**. Add a **Review changelog**.
6. Quote the `RECEIPT`, then isolated **`plan-checker`** (`readonly`, no
   `resume`). FAIL → fix P0/P1, one recheck. Same-session degrade cannot
   yield APPROVED.

```bash
.cursor/skills/_shared/scripts/plan-ban-sweep.sh .cursor/plans/<file>.md
```

Write `_shared/plain-english-brief.md`. Verdict in **What's going on**
(approved / blocked / still open).

## Pairs with

- skills: `create-plan`, `complete-the-build`, `review-build`,
  `planning-a-change`, `writing-an-adr`, `researching-a-dependency`,
  `task-topology`, `decompose`
- agents: `plan-checker`
- rules: `review-plan-rule`, `create-plan-rule`, `no-shortcuts`,
  `definition-of-done`, `implement-node-rule`
- refs: `_shared/plan-build-family.md`, `_shared/scripts/plan-ban-sweep.sh`,
  `_shared/plain-english-brief.md`
- commands: `plan` (`/plan`), `review-plan-cmd` (`/review-plan`),
  `review-build-cmd`
- workflows: `plan-then-build`, `build-as-graph`
- docs: `docs/plan-build-family.md`
