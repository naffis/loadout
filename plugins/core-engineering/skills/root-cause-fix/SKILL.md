---
name: root-cause-fix
description: >
  Prove one root cause, class-kill it, and lock a fail-then-pass regression. Use for "root cause fix" on a defined issue. Everyday red test → debugging-an-issue.
---

# Root cause -> correct fix

Prove the class root, pick a no-bandaid fix, **implement** it, lock it with a fail-on-revert regression. Loop discipline (contract, budget, maker ≠ checker) is `agentic-loop`.

**No production edit until Loop A is proven.** If implement evidence falsifies the root, return to Loop A. Budget ceiling without green → stop and escalate — never patch or delete an assertion to force green.

## Neighbours

| Use this skill                                                                      | Use instead                        |
| ----------------------------------------------------------------------------------- | ---------------------------------- |
| "Find the real root cause of this issue and fix it properly (for the whole class)." | —                                  |
| User said "yes / do it correctly" after a shallow proposal — dig-deeper gate first  | `do-it-right` (then hand off here) |
| A quick everyday bug (red test, typecheck failure, wrong value) — fast repro->fix   | `debugging-an-issue`               |
| A production/staging issue with no local repro — get runtime evidence first         | `debugging-with-observability`     |
| Structuring the whole task as a verified loop                                       | `agentic-loop`                     |

## Workflow

### Frame

Observed vs expected · trigger vs non-trigger · minimal repro (or what's missing) · ≥3 unverified hypotheses.

### Loop A — diagnosis

Run `references/root-cause-descent.md`. Do not inline it. Exit only when one cause (or a complete contributing set) explains **100%** of behavior and competitors are eliminated by evidence. Output: "The bug exists because **X**, which causes **Y**."

### Loop B — solution

Run `references/solution-selection.md`. Do not inline it. ≥3 distinct-mechanism candidates; Correctness + Bandaid test are pass/fail; candidate #1 is the smallest change at the exact root node.

### Crystallize (before any fix code)

1. **Root cause** — one sentence + the principle the fix establishes.
2. **The fix** — what changes, at what layer, why that layer.
3. **Why it generalizes** — the class it now covers.
4. **Validation** — original repro + sibling variations + the regression to add.
5. **Acceptance contract** — **End state** (observable corrected behavior) · **Evidence** (fail-on-revert regression + typecheck + affected suite) · **Constraints** (no `any`/ignore/swallow, no public-API break, no new always-on rule) · **Budget** default **3** edit→verify cycles.

### Implement gates

1. **Root node** — edit the exact file/function/branch Loop A named. Auto-reject ignore-comments, silence-casts, swallowed errors, threshold nudges, special-cases.
2. **Class + sibling regression** — fails on pre-fix, passes after; repro + ≥1 sibling (`regression-test.mdc`).
3. **DoD** — typecheck + affected tests; docs/changelog/surface registration in the **same** change (`definition-of-done.mdc`).
4. **Consumer-path 4b** — a green unit test of the changed function is necessary, not sufficient. Trace the consuming path; confirm the defect is impossible for the class.
5. **Isolated checker** — fresh `reviewer` / `security-reviewer` (or Cursor `bugbot` / `security-review`), readonly, diff + contract. Skip only for a trivially scoped fix whose regression + 4b already make the class impossible — and say why.
6. **Git-safety** — leave edits unstaged. No commit/push/branch/PR unless asked.

## Output

Write `_shared/plain-english-brief.md`. Causal chain and rejected alternatives stay off-page unless they ask. One line of proof (test path or checker verdict).

## Pairs with

- skills: `debugging-an-issue`, `do-it-right`, `agentic-loop`, `reviewing-and-shipping`,
  `post-flight`, `debugging-with-observability`
- rules: `regression-test`, `no-shortcuts`, `definition-of-done`
- refs: `_shared/plain-english-brief.md`
- agents: `reviewer`, `security-reviewer`
- workflows: `run-autonomous-loop`, `debug-production`, `security-pass`
- runbooks: `hotfix-and-rollback`
