# Cursor safety hooks

Shipped kit for Cursor project hooks. Bind the bans that a rule can only advise:
no stash, no whole-tree restore, no live `.env` in model context, one stop
reminder when **this** conversation wrote source.

## Install

```bash
npx github:naffis/loadout add cursor-safety-hooks
```

That copies this directory into `.cursor/hooks/`. Then **merge**
`hooks.fragment.json` into `.cursor/hooks.json`. Do not replace an existing
`afterFileEdit` format hook. Do not attach `mark-gate-needed` to
`afterFileEdit` or `afterTabFileEdit` — those fire for every workspace writer
on a shared tree.

Gitignore `.cursor/hooks/state/` (per-conversation gate flags). Reload Cursor
Settings → Hooks.

```bash
node --test .cursor/hooks/hooks.test.mjs
```

## Events

| Event                                  | Script                     | Why                                                                                                    |
| -------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------ |
| `beforeShellExecution`                 | `deny-destructive-git.mjs` | Block stash / `reset --hard` / `clean -f` / `checkout`·`restore` of `.` / dumping `.env` / `printenv`. |
| `beforeReadFile` / `beforeTabFileRead` | `redact-env-read.mjs`      | Deny live secret files; allow `*.example`.                                                             |
| `postToolUse` `Write\|StrReplace`      | `mark-gate-needed.mjs`     | Flag this conversation + generation only.                                                              |
| `stop` `loop_limit: 1`                 | `remind-gate.mjs`          | At most one follow-up; ignore leftover `gate-needed.json` and sibling chats.                           |

Tests set `CURSOR_GATE_STATE_DIR` so they never write the project's state dir.

Claude Code: use `PreToolUse` / `Stop` equivalents from `harness-hooks.md`; this
kit's event names are Cursor's.
