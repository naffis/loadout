---
name: running-a-dev-cycle
description: >
  Route a substantial feature through the lightest end-to-end path. Use for "build this end to end". One loop → agentic-loop.
---

# Running a dev cycle

Classify, then run only the phases that type needs — each as an `agentic-loop`.
Executor. Kickoff-only → `getting-started`. One loop → `agentic-loop`. One
bounded feature → `ship-a-feature`. Many tickets → `orchestrating-parallel-agents`.
Split one task into units → `task-topology` / `build-as-graph`.

## Classify (lightest that fits)

| Type | Signals | Route |
| --- | --- | --- |
| **QUICK** | 1-3 files, no new patterns, "fix/change/rename/tweak" | READ -> IMPLEMENT -> gate -> done (no plan file) |
| **ENHANCEMENT** | known area, 3-10 files, "add feature/improve X" | PLAN(light) -> BUILD+TEST -> [VERIFY?] -> [DOCS?] |
| **INTEGRATION** | new tech/API/library/service | RESEARCH -> PLAN(full) -> REVIEW -> BUILD+TEST -> VERIFY -> DOCS |
| **INVESTIGATION** | "evaluate/compare/is it possible/explore" | RESEARCH -> FINDINGS -> decision (build or stop) |
| **ITERATION** | "improve quality/make it better", prior work exists | [RESEARCH?] -> PLAN(light) -> BUILD+TEST -> EVALUATE -> loop or ship |

Choose by risk and uncertainty, not file count alone. Skip a formal ledger for
straightforward work; new architectural decisions warrant more planning.

## Phases (each maps to a loadout asset)

Each phase uses relevant evidence. A phase transition does not require repeating a
passing check: use focused feedback during edits, then one coherent batch validation.
Preserve required review/release gates; read the adopted WORKFLOW.md/project.json when present.

| Phase | Loadout asset | Gate |
| --- | --- | --- |
| RESEARCH | `researching-a-dependency` | Every unknown resolved; each new dependency has a reference doc with auth/API/errors/gotchas |
| PLAN | `planning-a-change` (+ `reviewer` for a full-mode stress test) | A plan with phased tasks, acceptance criteria, and risks |
| BUILD + TEST | `agentic-loop` execution + `writing-tests` under `no-shortcuts`/`size-limits` | Phase code complete; tests (happy + failure + edge) pass |
| VERIFY | `reviewing-and-shipping` (+ `assessing-release-readiness` if promoting) | Applicable review satisfied; batch checks green (reuse matching evidence) |
| DEPLOY (if a live service) | `multi-plane-deploy` runbook | Deploy verified healthy; post-deploy checks pass |
| DOCS | `updating-docs` | Doc surfaces the change touched are updated in the same change |
| FIX (defects found) | `root-cause-fix` | Each defect has a proven root cause + a class fix + regression test |

## QUICK path

No plan file: Read → Implement → Verify (touched tests + lint/typecheck) → Done.
Leave unstaged. No plan/report artifacts.

## Ledger

```
Task type: <QUICK/ENHANCEMENT/INTEGRATION/INVESTIGATION/ITERATION>
Phase: <current phase>
Progress: <what's done in this phase>
Gate: <what's needed to proceed>
```

## Autonomy & circuit breaker

Run phases without pausing at every gate; show the ledger. **Stop and ask when:**
same error after 2 fixes; fix A keeps breaking B; architecture not in the plan;
unresolved security; irreversible data; ambiguous requirements.

**Git-safe:** never commit/branch/push/PR unless asked. Autonomy is edit-and-verify
only. ITERATION with a stated minimum: a clean early result does not skip it.

## Pairs with

- skills: `getting-started`, `agentic-loop`, `planning-a-change`, `researching-a-dependency`, `reviewing-and-shipping`, `root-cause-fix`, `writing-tests`, `updating-docs`, `task-topology`
- agents: `reviewer`
- workflows: `ship-a-feature`, `run-autonomous-loop`, `clear-the-queue`, `plan-then-build`, `build-as-graph`
- docs: `agentic-patterns`
