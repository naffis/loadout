---
description: Review implemented work against the plan or original request. Evidence over assertion; fix blockers and majors.
---

Run the `review-build` skill in full. Review the work as a skeptical staff engineer seeing it for the first time.

Evidence over assertion: nothing counts as verified without the command output or file reference that proves it. Prefer a fresh chat when the stakes are high.

## Process (do not skip)

1. Ground truth — `git status` and `git diff` vs base; re-open unsure files.
2. Trace the plan or original request — every requirement/step → file:line; list deviations.
3. Shortcut sweep — TODO/FIXME/HACK, stubs, placeholders, swallowed errors, type suppressions, disabled tests/lint, debug leftovers. Report file:line; fix or justify.
4. Run the project gate (typecheck, lint, tests, build). Paste actual output. Fix failures; re-run until clean.
5. Correctness pass — error handling, edges, security on new surfaces, out-of-scope changes.
6. Findings numbered with severity (blocker / major / minor). Fix all blockers and majors; re-run step 4.
7. Final report — requirement trace, commands + outcomes, findings fixed, anything left open, verdict.
8. Last — emit this fence and nothing after it. A `## Next` sentence is
   incomplete:

```text
verifying-session-surfaces: <PASS + unharvested user-visible change + enough context>

Specimen: <plan path / issue id — omit if none>
Root node: <file:symbol or layer — omit if a plan>
Class / slice: <siblings or smallest validating slice>
Out of scope: …
Do not implement a proximate patch. Follow the named skill in full.
```

Do not invent findings to appear thorough, and do not skip checks to appear done. Both are failures. Do not commit/push/PR unless explicitly asked.

Focus / plan path: $ARGUMENTS
