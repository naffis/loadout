---
name: orchestrating-parallel-agents
description: >
  Run independent work items in parallel under house git constraints. Use for "do these in parallel" or a queue of tickets. Units of one task → task-topology.
---

# Orchestrating parallel agents

## Trigger

Independent items; "do these in parallel", "knock out the next N", "work the queue".

| Ask | Use instead |
| --- | --- |
| One task as a loop | `agentic-loop` |
| One feature end to end | `running-a-dev-cycle` / `ship-a-feature` |
| Spawn ONE sub-agent | `agentic-loop` subagents reference |
| Split ONE feature into file-bounded units | `task-topology` / `build-as-graph` |

## Shared-tree (check first)

If `shared-working-tree` (and usually `no-stash` / `git-safety`) is installed:

1. **Do not** create per-item worktrees or branches.
2. Keep every agent on the single local trunk checkout. Never stash.
3. When the user asks to commit: `committing-on-shared-trunk`.
4. Collision: **stop, leave the tree intact, ask.**

Overlapping files → **sequence** (`running-a-dev-cycle` / `ship-a-feature`). Unsure → sequence.

## Workflow

1. **Work set** — enumerate items + files each will touch. Confirm set and concurrency before launch.
2. **Cap 3** — 1 item → inline, no orchestration. 2–3 → parallel. More → waves of at most 3.
3. **Launch** — `Task` `generalPurpose`, `run_in_background: true`. Each prompt is self-contained: absolute checkout path; full task + acceptance; follow `running-a-dev-cycle` / `ship-a-feature` to a green gate + self-review; **stop before landing**; `no-shortcuts`; edits stay unstaged. Bookkeeping stays with you.
4. **Land serially, yourself (maker ≠ checker)** — sub-agents do not merge. One item at a time: independent checker (`reviewer` / `security-reviewer`, or `/review-bugbot` / `/review-security`) against that item's contract; finding → back to maker; don't land on fail. Re-verify the gate on the latest base (`rebasing-a-branch` if a branch exists). Commit/PR **only if asked**. Finish this item before the next. Shared-base CI red → stop new landings.
5. **Report**

| Item | Path/branch | Gate | Checker | Landed |
| --- | --- | --- | --- | --- |

For anything not landed: where it stopped, why, and what you need.

## Opt-in: worktrees

Only when `shared-working-tree` is **not** installed, or the user **explicitly** asks for worktree isolation:

```bash
git worktree add ../<repo>-<slug> -b <branch-name>
```

Each sub-agent works only in its worktree. After serial land: `git worktree remove <path>`.

## Never do

Invent worktrees when `shared-working-tree` is installed. Parallelize overlapping
files. Let sub-agents land. Land on a failing checker.

## Pairs with

- skills: `agentic-loop`, `running-a-dev-cycle`, `rebasing-a-branch`, `reviewing-and-shipping`,
  `committing-on-shared-trunk`, `task-topology`, `integrate`
- agents: `reviewer`, `security-reviewer`
- rules: `no-shortcuts`, `commit-and-pr-conventions`, `shared-working-tree`, `no-stash`, `git-safety`
- workflows: `clear-the-queue`, `build-as-graph` (different scope: units of one task, not a ticket queue)
- docs: `agentic-patterns`
