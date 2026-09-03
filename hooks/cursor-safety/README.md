# Cursor safety hooks

Shipped kit for Cursor project hooks. Bind the bans that a rule can only advise:
no stash, no whole-tree restore, no live `.env` in model context.

Do **not** bind a `stop` `followup_message`. Cursor submits that field as a
user turn, which impersonates the operator after diagnose / next-steps.

## Install

```bash
npx github:naffis/loadout add cursor-safety-hooks
```

That copies this directory into `.cursor/hooks/`. Then **merge**
`hooks.fragment.json` into `.cursor/hooks.json`. Do not replace an existing
`afterFileEdit` format hook. Do not attach `mark-gate-needed` or `remind-gate`
as a `followup_message` loop.

Gitignore `.cursor/hooks/state/`. Reload Cursor Settings → Hooks.

```bash
node --test .cursor/hooks/hooks.test.mjs
```

## Events

| Event                                  | Script                     | Why                                                                                                    |
| -------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------ |
| `beforeShellExecution`                 | `deny-destructive-git.mjs` | Block stash / `reset --hard` / `clean -f` / `checkout`·`restore` of `.` / dumping `.env` / `printenv`. |
| `beforeReadFile` / `beforeTabFileRead` | `redact-env-read.mjs`      | Deny live secret files; allow `*.example`.                                                             |

`remind-gate.mjs` stays in the kit as a no-op (`{}` only) so a re-added `stop`
entry cannot impersonate the user. `mark-gate-needed.mjs` is unused.

Claude Code: use `PreToolUse` / `Stop` equivalents from `harness-hooks.md`; this
kit's event names are Cursor's.
