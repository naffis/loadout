---
name: hunting-defects
description: >
  Exhaustive no-shortcut defect hunt over a large named surface (package,
  directory, feature) when there is no single known bug. Censuses product code
  (not docs/css), partitions into waves with a written wave log, hunts
  leaks/races/error-paths/contracts/honesty, refutes candidates, sibling-sweeps
  callers first. Use to improve code at scale. Triggers: "hunt defects",
  "exhaustive review", "review this package thoroughly", "find all issues",
  "find leaks and edge cases", "never take shortcuts review", "audit this
  module", "/hunt-defects". Anti-triggers: merge/diff wrap → reviewing-and-shipping;
  maintainability only → reviewing-code-quality; known symptom →
  debugging-an-issue / root-cause-fix; runtime logs without a named surface →
  debugging-with-observability; session wrap → post-flight.
---

# Hunting defects

Review a **large surface** as if missing an issue is the failure. Completeness
is a census of `review:` files plus a wave log, not report length.

Routing: [`references/family.md`](references/family.md).
Project overlay (optional): copy [`references/overlay-template.md`](references/overlay-template.md)
to [`references/project-overlay.md`](references/project-overlay.md).

## Trigger

User names a package, directory, or feature and wants defects, leaks, edge
cases, or a thorough audit — **not** a merge review of the current diff.

## When to use vs neighbours

| Situation                       | Use                              |
| ------------------------------- | -------------------------------- |
| Large surface, no single bug    | **This skill**                   |
| Diff vs trunk / wrap to ship    | `reviewing-and-shipping`         |
| Size / nesting / naming         | `reviewing-code-quality`         |
| "Why is this failing"           | `debugging-an-issue`             |
| Leaks only                      | `auditing-resource-lifecycle`    |
| Error/empty/cancel only         | `walking-failure-paths`          |
| Fix the findings                | `do-it-right` → `root-cause-fix` |

## Workflow

### 1. Frame

Write: exact paths; classes (default = all eight in
[`references/hunt-classes.md`](references/hunt-classes.md)); out of scope
(generated, style, docs); **REPORT** vs **FIX** (FIX only if they said
"and fix"). Do not read files until the census runs.

If `references/project-overlay.md` exists in this skill directory, read it
before hunting. It names this repo's writers, latches, money, and authz.
If absent, hunt the eight generic classes only — do not invent a stack.

### 2. Census (required receipt)

```bash
.cursor/skills/hunting-defects/scripts/census.sh <path...>
# loadout checkout:
plugins/core-engineering/skills/hunting-defects/scripts/census.sh <path...>
```

Quote `RECEIPT`. Completeness = every `review:` line. `test:` is optional
(failure-path wave). `docs:` / `style:` are not hunted unless asked.

If `review_files` > 200, do not sample. Ask to narrow **or** run every wave
`waves_needed` says. Stopping because "enough findings" → **INCOMPLETE**.

### 3. Waves

Follow [`references/wave-protocol.md`](references/wave-protocol.md). Print the
file list for wave W/K **before** reading. After each wave, refute and emit a
partial findings block, then continue.

Wave ≥ 15: `explorer` (Cursor Task `explore`) with
[`references/hunter-brief.md`](references/hunter-brief.md) and only that list.
Parent refutes; hunter severity is discarded.

### 4. Hunt

Per class in [`references/hunt-classes.md`](references/hunt-classes.md):

- Lifecycle → `auditing-resource-lifecycle` (quote sweep + **explain every
  imbalance delta>0**)
- Failure paths → `walking-failure-paths`
- Race → fill [`references/concurrency-slice.md`](references/concurrency-slice.md)
  for every shared-mutable seed
- Classes 3–8 seeds:

```bash
.cursor/skills/hunting-defects/scripts/class-seed-sweep.sh <path...>
.cursor/skills/_shared/scripts/shortcut-sweep.sh <path...>
```

Quote both RECEIPTs. Hits are candidates. If shortcut-sweep is missing, say so
and still hunt swallowed `catch` via the failure-path sweep.

Read the **enclosing function**, not ±3 lines.

### 5. Refute-or-promote

[`references/refute-protocol.md`](references/refute-protocol.md). Cannot name
the missing path in one sentence → **speculative**. Speculative is never
Critical.

### 6. Sibling sweep

Each **promoted** finding is a seed. Search **callers and entry points first**,
then clones. New hits are re-refuted (they do not inherit severity).

### 7. Report + checker

[`references/report-template.md`](references/report-template.md). Wave log must
list every `review:` file.

**`reviewer` (readonly) or `/review` is required** before `SURFACE CLEAN` or
any Critical/High. Same-session self-grade cannot raise speculative → proven
and cannot certify CLEAN.

If `FIX`: `do-it-right` on Critical/High **one class at a time**. No Medium/Low
drive-by.

## Suggested Checks

```bash
.cursor/skills/hunting-defects/scripts/census.sh src
.cursor/skills/hunting-defects/scripts/class-seed-sweep.sh src
.cursor/skills/auditing-resource-lifecycle/scripts/lifecycle-sweep.sh src
.cursor/skills/walking-failure-paths/scripts/failure-path-sweep.sh src
.cursor/skills/_shared/scripts/shortcut-sweep.sh src
```

## Guardrails

- No census RECEIPT + wave log covering every `review:` file → INCOMPLETE.
- Never implement during the hunt unless `FIX` was explicit.
- Leave edits unstaged. No commit/push/PR unless asked.
- Do not bake product names into findings that the overlay did not name.

## Never do

- Sample 8 files and title the reply "full audit".
- Count markdown/CSS as reviewed product code.
- Dump the whole package into one explorer prompt.
- Treat grep hits or imbalance delta as bugs without pairing.

## Pairs with

- skills: `auditing-resource-lifecycle`, `walking-failure-paths`,
  `reviewing-and-shipping`, `reviewing-code-quality`, `do-it-right`,
  `root-cause-fix`, `post-flight`, `debugging-an-issue`
- rules: `no-shortcuts`, `observability-first`
- agents: `explorer`, `reviewer`
- commands: `hunt-defects-cmd` (`/hunt-defects`)
- workflows: `defect-hunt`
- docs: `doc-defect-hunt-family`
