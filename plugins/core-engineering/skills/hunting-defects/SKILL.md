---
name: hunting-defects
description: >
  Exhaustive defect hunt of a named surface with no single known bug. Use for "hunt defects" or /hunt-defects. Known symptom → debugging-an-issue.
---

# Hunting defects

Census of `review:` files plus a wave log. Named package/directory/feature —
not a merge review. Routing: [`references/family.md`](references/family.md).
Overlay: [`references/overlay-template.md`](references/overlay-template.md) →
[`references/project-overlay.md`](references/project-overlay.md).

## When to use vs neighbours

| Situation                    | Use                              |
| ---------------------------- | -------------------------------- |
| Large surface, no single bug | **This skill**                   |
| Diff vs trunk / wrap to ship | `reviewing-and-shipping`         |
| Size / nesting / naming      | `reviewing-code-quality`         |
| "Why is this failing"        | `debugging-an-issue`             |
| Leaks only                   | `auditing-resource-lifecycle`    |
| Error/empty/cancel only      | `walking-failure-paths`          |
| Fix the findings             | `do-it-right` → `root-cause-fix` |

## Workflow

### 1. Frame

Exact paths; classes (default = all eight in
[`references/hunt-classes.md`](references/hunt-classes.md)); out of scope;
**REPORT** vs **FIX** (FIX only if they said "and fix"). No file reads until
census. Read `references/project-overlay.md` if present; else the eight generic
classes only — do not invent a stack.

### 2. Census (required receipt)

```bash
.cursor/skills/hunting-defects/scripts/census.sh <path...>
# loadout checkout:
plugins/core-engineering/skills/hunting-defects/scripts/census.sh <path...>
```

Quote `RECEIPT`. Completeness = every `review:` line. `test:` optional
(failure-path wave). `docs:` / `style:` not hunted unless asked.

`review_files` > 200: do not sample. Narrow **or** run every wave
`waves_needed` says. Stopping because "enough findings" → **INCOMPLETE**.

### 3. Waves

[`references/wave-protocol.md`](references/wave-protocol.md). Print the file
list for wave W/K **before** reading. After each wave: refute, partial findings,
continue. Wave ≥ 15: `explorer` (Task `explore`) with
[`references/hunter-brief.md`](references/hunter-brief.md) and only that list.
Parent refutes; hunter severity is discarded.

### 4. Hunt

Follow [`references/hunt-classes.md`](references/hunt-classes.md). Quote
lifecycle + failure-path RECEIPTs when those classes run. Race: fill
[`references/concurrency-slice.md`](references/concurrency-slice.md) for every
shared-mutable seed. Classes 3–8:

```bash
.cursor/skills/hunting-defects/scripts/class-seed-sweep.sh <path...>
.cursor/skills/_shared/scripts/shortcut-sweep.sh <path...>
```

Quote both RECEIPTs. Hits are candidates. Missing shortcut-sweep → say so;
still hunt swallowed `catch` via the failure-path sweep. Read the **enclosing
function**, not ±3 lines.

### 5. Refute-or-promote

[`references/refute-protocol.md`](references/refute-protocol.md). Cannot name
the missing path in one sentence → **speculative**. Speculative is never Critical.

### 6. Sibling sweep

Each **promoted** finding is a seed. Callers and entry points **first**, then
clones. New hits are re-refuted (they do not inherit severity).

### 7. Report + checker

`_shared/plain-english-brief.md`. Shape: [`references/report-template.md`](references/report-template.md).
Wave log lists every `review:` file.

**`reviewer` (readonly) or `/review` is required** before `SURFACE CLEAN` or any
Critical/High. Same-session self-grade cannot raise speculative → proven and
cannot certify CLEAN.

If `FIX`: `do-it-right` on Critical/High **one class at a time**. No Medium/Low drive-by.

## Guardrails

- No census RECEIPT + wave log covering every `review:` file → INCOMPLETE.
- Never implement during the hunt unless `FIX` was explicit.
- Leave edits unstaged. No commit/push/PR unless asked.
- Do not sample, count markdown/CSS as product code, dump the package into one explorer prompt, treat grep/imbalance hits as bugs without pairing, or bake overlay-unnamed product names.

## Pairs with

- skills: `auditing-resource-lifecycle`, `walking-failure-paths`, `reviewing-and-shipping`, `reviewing-code-quality`, `do-it-right`, `root-cause-fix`, `post-flight`, `debugging-an-issue`
- rules: `no-shortcuts`, `observability-first`
- agents: `explorer`, `reviewer`
- commands: `hunt-defects-cmd` (`/hunt-defects`)
- workflows: `defect-hunt`
- docs: `doc-defect-hunt-family`
- refs: `_shared/plain-english-brief.md`
