---
name: integrate
description: >
  Fan-in implement-node units in declared order and re-run verifiers. Use when units report done. Multi-ticket landing → orchestrating-parallel-agents.
---

# Integrate

Fan-in for a pipeline or graph. On conflict: identify the violating unit and
**re-dispatch** — never hand-fix across boundaries here. Units still
implementing → wait. Topology incomplete → `task-topology` / `decompose`.
Single-loop → no integrate. Multi-ticket landing → `orchestrating-parallel-agents`.

Requires `.loadout/tasks/<slug>/TASK.md` with units, merge order, and a
full-suite verifier. Missing verifier → **stop**.

## Isolation mode

| Mode | When | How to merge |
| --- | --- | --- |
| **shared-trunk** | `shared-working-tree` installed, or units already edited the same checkout with disjoint allowlists | Units may already share the working tree. Accept in **merge order**: verify allowlist via `git diff`, run **full-suite** verifier, mark `integrated`, then accept the next. No stash. No new branches/worktrees unless the user asks. On mid-edit collision → stop, leave tree intact, ask (`shared-working-tree`). |
| **worktrees** | Shared-tree kit **not** installed, or user explicitly asked for worktrees | Merge/apply each unit's worktree in merge order onto the integration checkout; full-suite after each; remove worktree only after that unit is `integrated`. |

Do not invent worktrees when `shared-working-tree` applies. Stay on trunk.

Pipeline: stages were serial; still run the full suite after each accept.

## Workflow

### 1. Inventory

Merge order. Status `PASSED` with verifier evidence. `FAILED` / caveats →
do not merge; re-dispatch or stop. `git diff` paths ⊆ allowlist (contract
read-only). Paths outside → FAILED; re-dispatch.

### 2. Accept one unit at a time

1. Apply that unit only (worktrees) **or** accept shared-trunk edits after
   allowlist check.
2. Full-suite verifier from the task file (not only the unit verifier).
3. Green → `integrated`; proceed.
4. Red/conflict → attribute to **unit + contract clause**; re-dispatch that
   unit (`task-topology/references/dispatch-prompt.md`). Do not patch the
   other unit. Ambiguous contract → `decompose`, then re-dispatch.

### 3. Final full suite

After the last accept, run full-suite again. Paste evidence.

### 4. Spec review

Hunt units that each pass but disagree on the same interface: one meaning per
contract symbol; error/status enums agree; persistence shapes match readers;
cross-unit plan ACs hold end-to-end.

Dispatch `reviewer` on the full diff + original ACs when shippable. Prefer
fresh context (`review-build`).

### 5. Report

| Unit | Allowlist clean | Unit verifier | Status | Full suite after accept |
| --- | --- | --- | --- | --- |
| U-01 | yes | PASSED | integrated | PASSED |

Plus: re-dispatch count, decompose fallbacks, spec-review verdict.

## Never do

Hand-fix across boundaries. Skip the full suite because the unit passed. Merge
an allowlist breach. Proceed without a full-suite verifier. Commit unless asked.
Invent worktrees when `shared-working-tree` applies.

## Pairs with

- skills: `task-topology`, `decompose`, `review-build`, `agentic-loop`, `orchestrating-parallel-agents`, `rebasing-a-branch`, `committing-on-shared-trunk`
- rules: `implement-node-rule`, `shared-working-tree`, `no-stash`, `git-safety`, `definition-of-done`, `no-shortcuts`, `commit-and-pr-conventions`
- agents: `implement-node`, `reviewer`, `security-reviewer`
- workflows: `build-as-graph`
- refs: `../task-topology/references/dispatch-prompt.md`
- docs: `agentic-patterns`
