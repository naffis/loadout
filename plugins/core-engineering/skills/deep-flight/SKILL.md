---
name: deep-flight
icon: shield
color: cyan
description: >
  Mid-session quality gate after substantial edits. Use for "deep-flight" or "are we still doing this right". Not session wrap (post-flight).
---

# Deep-flight — in-flight course-correct

You are **mid-build**. Prove the work is still on the class-kill path and
**fix drift now** before anyone claims done.

Not `deep-dive` (recommend only). Not `post-flight` (full wrap + sibling hunt).
Routing: `_shared/flight-family.md`.

## Immediate action

1. Read `_shared/flight-family.md` if routing is unclear.
2. Do **not** declare ON-COURSE from memory.
3. Do not commit/push/PR unless the user explicitly asks.

## Workflow

### 1. Frame

- **Ask** — verbatim user outcome still in force.
- **Chosen layer** — file:symbol you said you would change. None → stop and
  run `do-it-right`.
- **In-flight diff** — `git status --porcelain` + `git diff --stat`. Session
  paths only on a shared dirty tree.

### 2. Layer still correct?

For each behavioral intent: name the class; confirm the edit is at the owning
layer. Heuristic carve-out / threshold nudge / satisfy-the-audit waiver →
**P0**. Escalate to `do-it-right` or `root-cause-fix`. Do not polish the
bandaid.

### 3. Mechanical sweep

```bash
.cursor/skills/_shared/scripts/shortcut-sweep.sh
```

(Loadout checkout: `plugins/core-engineering/skills/_shared/scripts/shortcut-sweep.sh`.)
Quote the `RECEIPT`. Session-introduced hits → fix now.

### 4. Verification evidence

Run the project's documented gates (`AGENTS.md` / CI / plan test plan) for
packages the diff touches. **Paste closing lines.** "Will verify later" is
drift.

### 5. Isolated checker

Launch **`flight-checker`** (`readonly: true`, no `resume`, omit `model`).
Give verbatim asks, session paths, Chosen layer, RECEIPT, quoted gates.
No private rationale. Native `/review` may run in addition.

FAIL → fix P0/P1, re-run steps 3–4, **one** recheck. Still failing →
**OFF-COURSE**. Same-session degrade cannot yield ON-COURSE.

### 6. Course-correct

P0/P1 now. No sibling-surface hunt (that is `post-flight`). If wrapping the
session, hand off to `post-flight` after ON-COURSE.

## Report

Write `_shared/plain-english-brief.md`. Verdict in **What's going on**
(on course / corrected / off course). Keep the RECEIPT and gate dump off
the page unless they ask.

## Never do

- Treat this as `deep-dive` or skip it because post-flight will catch it
- Self-grade ON-COURSE without `flight-checker` PASS
- Claim a sweep without a RECEIPT
- Add features or hunt unrelated siblings

## Pairs with

- skills: `do-it-right`, `post-flight`, `root-cause-fix`, `debugging-an-issue`,
  `review-build`, `agentic-loop`
- rules: `deep-flight-rule`, `do-it-right-rule`, `no-shortcuts`,
  `definition-of-done`
- agents: `flight-checker`, `reviewer`
- commands: `deep-flight-cmd` (`/deep-flight`), `do-it-right-cmd`
  (`/do-it-right`), `post-flight-cmd` (`/post-flight`)
- refs: `_shared/flight-family.md`, `_shared/plain-english-brief.md`,
  `_shared/scripts/shortcut-sweep.sh`
