---
name: create-plan
icon: book-open
color: blue
description: >
  Write a complete implementation plan before coding. Use for "create-plan", "/plan", or "write a plan for X". Not a seed investigation (deep-dive).
---

# Create a plan

Delivery is **CreatePlan** (Build UI), not a `Write` to `.cursor/plans/` alone. Routing: `_shared/plan-build-family.md`.

Not this skill: implement/build now · planning.mdc LIGHT tiny enhancement · Q&A with no plan asked · `deep dive:` → `deep-dive` · existing-plan stress-test → `review-plan`.

## Immediate action

1. Read `.cursor/rules/create-plan.mdc` and `references/cursor-native-plan.md`.
2. If not in **Plan mode**, `SwitchMode` → `plan` (`Shift+Tab`). CreatePlan / Build require it.
3. Do **not** claim done after only a workspace markdown file.
4. Do not implement unless the user clicks **Build** or explicitly asks. Research finished ≠ implement.

## Workflow

1. **Clarify** — one batch of numbered questions if the answer changes design; then stop. Else labeled assumption. Do not invent product choices.
2. **Perceive** — this repo first. Live code > owning docs > AGENTS.md > labeled assumption.
3. **Research externally (mandatory)** — 3–6 search questions; primary sources; citations (title + URL + takeaway). SOTA vs invariants → choose explicitly. Skip because "we know the codebase" is a plan failure.
4. **Specify + decompose** — every `T-0N` has files, AC, verifier, wiring; tests/DoD are tasks **in this plan**.
5. **Deliver + prove**
   1. **CreatePlan** — `name`, `overview`, `plan`, non-empty `todos` (one per `T-0N`). See `references/cursor-native-plan.md`. Empty `todos` banned.
   2. **Research doc** — `Write` `references/plan-template.md` to `.cursor/plans/YYYY-MM-DD-<slug>.md`. Link it from the CreatePlan body.
   3. **plan-ban-sweep** — quote RECEIPT:

```bash
.cursor/skills/_shared/scripts/plan-ban-sweep.sh .cursor/plans/YYYY-MM-DD-<slug>.md
```

   4. Isolated **`plan-checker`** (`readonly`, no `resume`). Same-session self-grade cannot close. FAIL → fix the plan, one recheck. Never same-session APPROVED.

Prefer `/review-plan` before Build on non-trivial work. After review, refresh CreatePlan so Build matches. Chat reply: `_shared/plain-english-brief.md`. Do not paste the research doc.

If a later build misses intent: **revert, refine this plan, rebuild**.

## Never do

- Finish with only `Write` to `.cursor/plans/*.md` (no CreatePlan / no Build UI)
- Ship `TBD` / stubs / "figure out during implementation"
- Claim "best practice" without a citation
- Skip external research or skip CreatePlan because the phrase was buried
- Call CreatePlan with empty `todos`
- Implement because research finished

## Pairs with

- skills: `review-plan`, `complete-the-build`, `review-build`, `deep-dive`,
  `planning-a-change`, `agentic-loop`, `running-a-dev-cycle`, `writing-tests`,
  `writing-an-adr`, `researching-a-dependency`, `task-topology`, `decompose`,
  `integrate`
- agents: `plan-checker`
- rules: `create-plan-rule`, `no-shortcuts`, `definition-of-done`,
  `regression-test`, `testing-conventions`, `implement-node-rule`
- refs: `references/cursor-native-plan.md`, `references/plan-template.md`,
  `_shared/plan-build-family.md`, `_shared/scripts/plan-ban-sweep.sh`,
  `_shared/plain-english-brief.md`
- commands: `plan` (`/plan`), `review-plan-cmd`, `review-build-cmd`
- workflows: `plan-then-build`, `build-as-graph`
- docs: `docs/plan-build-family.md`
