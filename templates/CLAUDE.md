# CLAUDE.md (template)

Loaded at the start of every Claude Code session. Keep it short — a bloated CLAUDE.md
causes Claude to ignore instructions. Put situational knowledge in skills instead.

## Git safety (highest priority)

Read-only git is always allowed (`status`, `diff`, `log`, `show`, `branch --list`).
Do NOT stage, commit, branch, push, stash, discard WIP, or open/merge PRs unless the user
explicitly asks in their message. A request to MAKE a change is not permission to commit it.
Leave edits as unstaged changes; when git work would follow, state the exact commands and let
the user run them. If `shared-working-tree` / `no-stash` are installed: stay on one trunk
checkout; never stash; when asked to commit, land the whole eligible tree
(`committing-on-shared-trunk`).

## Project conventions

See @AGENTS.md for stack, commands, architecture, and conventions.

## Definition of done

Claude Code does not load `.cursor/rules/`, so the always-on hygiene contract is restated
here: a change that adds or alters behavior ships in the same change with tests + typecheck
green, a changelog entry when users/operators would notice, and a doc update when behavior,
API, config, or a procedure changed. Verify with the project's check and show the evidence.

<!-- loadout:managed:cursor-rules:start -->
<!-- Projected Cursor rules appear here when vendored into a Claude-only project. -->
<!-- loadout:managed:cursor-rules:end -->
