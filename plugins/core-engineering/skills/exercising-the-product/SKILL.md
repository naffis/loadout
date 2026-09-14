---
name: exercising-the-product
description: >
  Dogfood the running product end-to-end and fix confirmed defects. Use for "exercise the product" or "dogfood". One known bug → root-cause-fix.
disable-model-invocation: true
---

# Exercising the product

This skill **is** an `agentic-loop`; fixes go through `root-cause-fix`.
Inherited: contract first, ground-truth verify, fail-on-revert, maker ≠
checker, edits unstaged, never commit unasked.

## Durable state

Read first, write constantly. Default `_local/quality-loop-STATE.md`
(`references/session-state.md`). Ledger, append-only, one line per issue:

`ID · severity · surface · symptom · evidence · root cause · fix · status`

Resume if the file exists: do not re-run finished scenarios or re-fix
closed issues. Check known-fixed / known-open before filing. `git status`
before editing; note files another session owns.

## Contract (before first scenario)

- **End state:** N different scenario types + mutation matrix; every
  high-severity issue class-killed with a fail-on-revert test; gates green.
- **Budget:** max N scenarios (default 3) · max 3 edit→verify cycles per
  fix · a silent stall is dead — diagnose, don't wait.
- **Constraints:** unstaged; no swallowed errors; no symptom patches;
  **no live CMS / prod writes** or real customer notifications (list
  forbidden ops in the state file).

## Workflow

**0 Preflight.** One healthy listener per port. Baseline gates green.
Evidence map in the state file. UI: `reviewing-ui/references/ui-evidence.md`.

**1–3 Create → observe → analyze.** Rotate different scenario types.
Submit through the real entry point; record trace ids. File silent /
premature / swallowed-gate failures — don't wait them out. Judge via
`references/quality-rubric.md`. A product gate that contradicts the
artifact is itself high-severity.

**4 Mutation matrix.** Every editing tool/endpoint, one probe each, ✓/✗
with evidence: NL edit, scoped edit, add, delete/reorder, undo/revert,
stale-version conflict (must reject usefully), special-character input.
**Re-fetch** the real output — never trust "Done!".

**5 Fix** (`root-cause-fix`, highest severity first). Class-kill at the
root. Fail-on-revert: revert the fix in the working tree or assert the
prior failure — **never `git stash`** (`no-stash`). Gates on edited files.
Restart what doesn't hot-reload. Ledger → FIXED.

**6 Iterate / stop.** Re-run the live operation that exposed each fix.
Stop when budget is spent **or** a full scenario + matrix yields zero new
high-severity findings. Then full gates; hand shippable fixes to a
fresh-context `reviewer` (diff + contract); write the closing summary.
Append new failure modes to the matrix and rubric.

**Model-variance vs structural defect:** merely mediocre generative
output → log, don't brittle-post-process. Structurally wrong or lost
output → code defect, fix it. Real spend is real — a handful of
generations, not dozens.

## Pairs with

- skills: `agentic-loop` (loop discipline), `root-cause-fix` (the fix engine),
  `reviewing-ui` (UI findings surfaced here get logged there, not fixed ad hoc),
  `writing-tests`
- rules: `regression-test`, `no-shortcuts`, `definition-of-done`, `ui-evidence`
- agents: `reviewer` (maker-checker on the fix diff), `explorer`
- workflows: `run-quality-loop`
- templates: `state-file`
