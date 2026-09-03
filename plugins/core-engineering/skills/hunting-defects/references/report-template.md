# Hunt report template

Copy this shape. Completeness is a count, not a vibe.

```markdown
# Defect hunt — <surface>

Mode: REPORT | FIX
Classes: <list>
Census: review=N test=T docs=D (quote RECEIPT)
Waves: k / k — every `review:` file in the wave log below
Overlay: none | references/project-overlay.md

## Wave log

- W1: path/a.ts, path/b.ts, …
- W2: …

## Completeness

- Reviewed: N / N review files (wave log)
- Tests hunted: T / skip
- Unreviewed review files: **must be 0**

## Imbalances (lifecycle)

- addEventListener delta=… → paired in … | candidate | kill: …

## Shared mutable (concurrency)

| State | Writers | Serializing | Interleave? | Verdict |

## Findings

### [Critical] `path:line` (proven)

**Class:** lifecycle | failure-path | race | contract | trust | honesty | idempotency | latch
**Issue:** …
**Missing path:** <one sentence>
**Impact:** …
**Fix:** … (do not implement unless FIX)

### [High] …

## Killed candidates

- `path:line` — killed by <check>

## Speculative (not bugs yet)

- `path:line` — what would prove it

## Sibling sweep

- Seed → callers/entry points → extra promoted / none

## Receipts

<paste census + class-seed + lifecycle (incl. imbalance) + failure-path + shortcut>

## Checker

reviewer | /review — PASS/FAIL (required for CLEAN or Critical/High)

## Verdict

SURFACE CLEAN | ISSUES FOUND (C/H/M/L) | INCOMPLETE (unreviewed > 0 or skipped checker)

## Next

- FIX → `do-it-right` on Critical/High, one class at a time
- Else leave unstaged; no commit
```

**Severity:** Critical = data loss, unpaid work, authz hole, unbounded leak in a
long-lived surface (SSE, worker isolate, wallet). High = likely user-visible or
integrity. Medium = real but contained. Low = nit or speculative.

**SURFACE CLEAN** with no checker line is **INCOMPLETE**.
