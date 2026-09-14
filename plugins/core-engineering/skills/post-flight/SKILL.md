---
name: post-flight
icon: flag
color: orange
description: >
  End-of-session ask-vs-ship review and fix, then an isolated checker. Use for "post-flight", "review everything we did", or "did we miss anything". Live surfaces → verifying-session-surfaces.
---

# Post-Flight — Session Review, Fix, and Improve

Prove the session against evidence and **fix** what turns up. Routing:
`_shared/flight-family.md`. Do not absorb sibling-agent WIP as your ask.
Prefer `review-build` for a fresh-chat plan grade; `do-it-right` before a
fix lands. Never skip Step 4 or 5 on behavioral work; never self-grade CLEAN.

## Workflow

### 0–1. Reconstruct + asked vs shipped

Re-read asks **verbatim**. Number deliverables. Dropped todos and
deferrals ("follow-up", pending todos, session `TODO`/`FIXME`, parking
lot, partials) are findings.

```bash
git status --porcelain && git diff --stat && git diff --stat --staged
```

```
| # | Asked | Shipped? | Where | Verified how |
|---|-------|----------|-------|--------------|
| 1 | ...   | ✅ / ⚠️ partial / ❌ | path:symbol | test / command / read |
```

Shipped-but-not-asked: justify or revert.

### 2–3. Per-file audit + shortcut sweep

Read each session-owned file; grep callers; walk empty/throw/async-reject.
Emit a **per-file audit table** (one row per file). Then:

```bash
.cursor/skills/_shared/scripts/shortcut-sweep.sh
```

Quote the `RECEIPT`. No RECEIPT = skipped.

### 4. Fix-correctness

Read `references/fix-correctness-audit.md`; emit the **fix-correctness
matrix**. Verdicts: `class-kill` · `correct-feature` · `bandaid` ·
`wrong-layer` · `unproven` · `n/a-docs` · `n/a-refactor`. `bandaid` /
`wrong-layer` / `unproven` is **P0** — `root-cause-fix`, then re-attest.

### 5. Sibling sweep

Read `references/sibling-surface-sweep.md` for every non-skipped Step 4
intent. Emit sibling artifacts **or a negative attestation** (tier +
validated path). Same-class / partial-port → fix now. Do not port a bandaid.

### 6–8. DoD, gates, fix

Walk `definition-of-done`; emit `triggered` / `not triggered`. Run
documented gates; **paste closing lines**. P0/P1: fix now; re-run 4–7.
Deferred work: **do it now**. Survivors need one of: (1) input only the
user can give, (2) genuine scope change needing approval, (3)
refactor-class item needing its own test net (`refactor-discipline`),
(4) external dependency. After fixes, re-run 2–7 (fresh 4 + 5).

### 9–11. Checker, stop, ticket

Read `references/independent-checker.md`. Launch **`flight-checker`**
(`readonly: true`, no `resume`). A `generalPurpose` Task fed the maker's
story is not a checker. FAIL → fix once + one recheck; still failing →
**BLOCKED**. Docs-only → N/A. Stop when: **two consecutive** maker passes
with zero new P0/P1; gates green; checker PASS. Write
`_shared/plain-english-brief.md`. Leave edits **unstaged** (`git-safety`).
Optional issue-tracker progress — never invent ticket IDs.

Missing named artifact = not done: per-file audit, shortcut RECEIPT,
fix-correctness matrix, sibling artifacts or negative attestation,
checker receipt, quoted command output, DoD row accounting.

## Pairs with

- skills: `do-it-right`, `deep-flight`, `root-cause-fix`, `agentic-loop`, `review-build`,
  `complete-the-build`, `reviewing-and-shipping`, `reviewing-code-quality`,
  `deslopping`, `simplifying-code`, `writing-tests`, `verifying-session-surfaces`,
  `hunting-defects`, `recommending-next-steps`
- rules: `no-shortcuts`, `definition-of-done`, `regression-test`,
  `refactor-discipline`, `git-safety`, `shared-working-tree`
- agents: `flight-checker`, `reviewer`
- commands: `post-flight-cmd` (`/post-flight`), `review-build-cmd` (`/review-build`),
  `do-it-right-cmd` (`/do-it-right`)
- workflows: `ship-a-feature`, `plan-then-build`, `run-autonomous-loop`,
  `debug-production`
- references: `fix-correctness-audit.md`, `sibling-surface-sweep.md`,
  `independent-checker.md`, `_shared/plain-english-brief.md`
