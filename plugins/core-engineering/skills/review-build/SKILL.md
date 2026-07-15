---
name: review-build
description: >
  Review implemented work as a skeptical staff engineer seeing it for the first
  time. Use when the user says "Review the build", "review this build",
  "review-build", "review the implementation", "did we build what we planned",
  or asks to verify a finished change against a plan or original request.
  Evidence over assertion: git diff, plan/requirement trace, shortcut sweep,
  gate commands with pasted output, fix blockers/majors, final report.
  Anti-triggers: review a plan before coding → review-plan; wrap up and ship →
  reviewing-and-shipping; ordinary code-quality audit → reviewing-code-quality.
---

# Review a build

## Trigger

Implementation is claimed done (or nearly done) and needs an adversarial,
evidence-first check before shipping — especially after `plan-then-build`, or
when the stakes are high enough that the author re-reading themselves is not
enough. Prefer a fresh chat when possible (maker ≠ checker).

## Immediate action

1. Read the `review-build` rule (`rules/review-build.mdc`) end-to-end — it is
   the full standard.
2. Execute every step. **Fix blockers and majors in the code** — chat-only
   critique without repairs is a failure for those severities.
3. Do **not** commit/push/PR unless the user explicitly asks.

## Workflow

### 1. Ground truth first

Run against the base branch (or the user's named base) and review the actual
diff, not your memory of making it:

```bash
git status
git diff <base>...HEAD
# also unstaged / uncommitted work:
git diff
```

Re-open any file you are unsure about. Cite paths (and lines when it matters).

### 2. Trace the plan or original request

Map every requirement and every plan step to where it is implemented (file and
line). List every deviation from the plan; fix it or justify it in the report.

If there is no written plan, trace against the original user request and any
acceptance criteria stated in-session.

### 3. Shortcut sweep

Search the changed files for:

- `TODO`, `FIXME`, `HACK`, `XXX`, placeholder / stub / "handle later" text
- Stubbed or mocked logic outside tests
- Hardcoded values that belong in config
- Commented-out code; empty or swallowed catch blocks
- Type suppressions (`any`, `as unknown as`, `@ts-ignore`, `# type: ignore`)
- Disabled tests or lint rules; leftover debug logging

Report every hit with file and line; fix it or justify it (`no-shortcuts`).

### 4. Run the verification gate

Run every verification the project documents (typecheck, lint, tests, build —
whatever `AGENTS.md` / CI / the plan's test plan names). Paste the actual
output. If anything fails, fix it and re-run until clean. A pass you did not
paste does not count.

### 5. Correctness pass

On each changed file, check:

- Error handling on new paths
- Edge cases: empty/null input, concurrency, partial failure, idempotency
- Security on any new input, endpoint, or query
- Behavior changes outside the task's scope (cut or justify)

### 6. Findings → fix → re-verify

List findings numbered with severity:

| Severity | Meaning | Action |
| --- | --- | --- |
| **blocker** | Wrong, unsafe, or unverified | Fix now; re-run step 4 |
| **major** | Likely bug or plan miss | Fix now; re-run step 4 |
| **minor** | Quality / clarity | Fix if cheap; else leave with reason |

Do not invent findings to appear thorough, and do not skip checks to appear
done. Both are failures.

### 7. Final report

```markdown
# Build review: <change name>

## Verdict
PASS | PASS WITH NOTES | FAIL

## Requirement / plan trace
| Requirement or plan step | Implemented at | Status |
| --- | --- | --- |

## Deviations from plan
## Shortcut sweep hits → fixed or justified
## Commands run
| Command | Outcome |
| --- | --- |
## Findings found → fixed
## Left open (with reason) — or "none"
```

## What "done" means

- Diff reviewed from ground truth; plan/request fully traced
- Shortcut sweep complete; blockers and majors fixed
- Gate commands run with pasted evidence
- Verdict explicit; report in the reply
- Edits left unstaged unless the user asked to commit

## Never do

- Rubber-stamp from memory of writing the code
- Claim green without pasting command output
- Skip the shortcut sweep or the plan trace
- Ship with unresolved blockers/majors
- Commit/push/PR unless explicitly asked

## Pairs with

- skills: `review-plan`, `create-plan`, `reviewing-and-shipping`, `deslopping`,
  `writing-tests`, `reviewing-code-quality`
- rules: `review-build-rule`, `no-shortcuts`, `definition-of-done`,
  `regression-test`, `testing-conventions`
- agents: `reviewer`, `security-reviewer`
- commands: `plan` (`/plan`), `review-plan-cmd` (`/review-plan`),
  `review-build-cmd` (`/review-build`)
- workflows: `plan-then-build`, `ship-a-feature`, `run-autonomous-loop`
