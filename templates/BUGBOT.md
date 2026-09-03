# Bugbot

Project rules (`.cursor/rules/*.mdc`) do **not** apply to Bugbot. This file is
the review contract for PR comments. Add repo-specific hard bans below the
general list; do not paste product narrative here.

## Hard bans

- Do not suggest `git stash`, `git reset --hard`, `git clean -f`, restoring the
  whole tree, or moving WIP to `/tmp`.
- Do not suggest a feature branch, worktree, or PR “for cleanliness.” Default
  ship path is the shared local trunk named in `AGENTS.md`. Isolation only if
  the author asked.
- Do not introduce `any`, `as any`, or `@ts-ignore` in application `src/`.
- Do not print, commit, or quote `.env*` values, tokens, or PII.
- Do not bind port `8787` (Cursor MCP OAuth loopback). Pick another port.

## Correctness

- Prefer a class-kill at the owning gate over a proximate patch (regex
  carve-out, exception, threshold nudge, satisfy-the-audit waiver).
- A bug fix needs a regression test that fails on the old behavior.
- New behavior ships tests + the owning-doc update in the same change.
- Do not treat a stub, swallowed catch, or silent empty fallback as done.

## Size

Do not grow an already-over-cap file. Split instead of appending. Prefer
extracting a `switch` case body over converting the switch to a lookup table.

## What not to nits

- Prettier / import-order / quote style — format hooks and commit hooks own layout.
- Restating `AGENTS.md` narrative. Point at the owning doc if an invariant is wrong.
