---
name: rule-author
description: >
  Scaffold a .mdc rule and apply the rule-vs-skill test. Use when creating or restructuring a rule.
---

# Rule author

## Trigger

Capturing a persistent constraint or convention as a rule.

## Is it actually a rule?

A rule is a standing constraint that should color behavior with no steps to run ("never alter a column type in place"). If it's a procedure with a beginning and end, use `skill-author` instead. If it's genuinely cross-tool baseline behavior (stack, voice, naming), put it in `AGENTS.md`, not an `.mdc`.

## Choose the type (frontmatter)

| Want | `alwaysApply` | `description` | `globs` |
|---|---|---|---|
| Always on (use sparingly) | `true` | — | — |
| Auto-attach on matching files | `false` | — | `["glob"]` |
| Agent pulls in when relevant | `false` | required, specific | omitted |
| Manual via `@mention` | `false` | omitted | omitted |

`description` is required for agent-requested rules and drives selection — make it specific.
Always-on (`alwaysApply: true`) is the short universal set only. Language and
area constraints use globs (`alwaysApply: false`). Doctor requires `globs` to
be an array. `loadout add` / `update` project a rule into Claude `CLAUDE.md` only when
`alwaysApply` is true; `update` unprojects a leftover block otherwise.

## Body conventions

- Add a rule **only when the agent repeats a mistake** (Cursor). If the current model already honors it, do not add it — and prune it if an old rule is now unused (`hardening-the-harness`).
- Keep it under 50 lines when it only **routes** to a skill. Do not reprint a skill completeness bar. Hard cap 80 for a real constraint; 500 is a spec ceiling, not a goal.
- Reference canonical files (`@path`) instead of pasting code that will go stale.
- Don't: dump a style guide (use a linter), document common tools (`npm`, `git`, `pytest`), or add rare edge cases. Don't restate what `AGENTS.md` already says.
- Wortmann prune: failure-backed? tool-enforceable? decision-encoding? triggerable? If none, delete.

## Workflow

1. Confirm it's a rule (not a skill / AGENTS.md line). 2. Pick the type. 3. Write tight frontmatter + body. 4. Add a `cursor-rule` entry to `registry.json`. 5. Run `loadout doctor`.

## Pairs with

- skills: `skill-author`, `learning-from-chats`
- docs: `external-practices`
