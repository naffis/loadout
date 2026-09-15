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
| **shared-trunk** | `shared-working-tree` installed, or units already edited the same checkout with disjoint allowlists | Units may already share the working tree. Accept in **merge order**: verify allowlist via `git diff`, run affected/interface checks, keep status `PASSED` with batch validation pending, then accept the next. Validate the completed batch with the full-suite verifier before marking it `integrated`. No stash. No new branches/worktrees unless the user asks. On mid-edit collision → stop, leave tree intact, ask (`shared-working-tree`). |
| **worktrees** | User explicitly asked for worktree isolation | Merge/apply each unit's worktree in merge order onto the integration checkout; affected/interface checks after each; full-suite once for the completed batch. Remove worktrees only after validation and authorized cleanup. |

Do not invent worktrees when `shared-working-tree` applies. Stay on trunk.

Pipeline: verify affected behavior between stages; run the full suite at the completed
batch boundary. Existing project gates requiring earlier full runs still apply.

## Workflow

### 1. Inventory

Merge order. Status `PASSED` with verifier evidence. `FAILED` / caveats →
do not merge; re-dispatch or stop. `git diff` paths ⊆ allowlist (contract
read-only). Paths outside → FAILED; re-dispatch.

### 2. Accept one unit at a time

1. Apply that unit only (worktrees) **or** accept shared-trunk edits after
   allowlist check.
2. Affected and cross-unit interface checks; broaden if impact is unknown.
3. Green → retain `PASSED`, note acceptance and pending batch validation; proceed.
4. Red/conflict → attribute to **unit + contract clause**; re-dispatch that
   unit (`task-topology/references/dispatch-prompt.md`). Do not patch the
   other unit. Ambiguous contract → `decompose`, then re-dispatch.

### 3. Final full suite

After the last accept, run the task's full-suite verifier once for the completed batch
(or reuse matching evidence). Green → mark included units `integrated`. Red → assign
the failure to its owner; revalidate the affected checks and required suite after repair.
An authorized immutable candidate is required for authoritative release evidence; checks
on a moving tree are development feedback. Do not create commits without authorization.

### 4. Spec review

Hunt units that each pass but disagree on the same interface: one meaning per
contract symbol; error/status enums agree; persistence shapes match readers;
cross-unit plan ACs hold end-to-end.

Satisfy the task's independent review on the full diff + original ACs. Reuse an
existing matching review-build/checker verdict instead of dispatching another reviewer.

### 5. Report

| Unit | Allowlist clean | Unit verifier | Status | Batch evidence |
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
