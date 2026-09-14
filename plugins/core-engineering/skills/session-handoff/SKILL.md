---
name: session-handoff
description: >
  Write or resume a durable handoff packet for a fresh chat. Use for "write a handoff", "session handoff", "continue from handoff", or "pick up where we left off".
---

# Session handoff

Two modes: **write** a packet; **resume** from one. Write: "write a handoff",
context dying. Resume: "continue from handoff", "pick up where we left off".
Standup → `summarizing-my-work`. Weekly → `weekly-review`. Plan exhaustion →
`complete-the-build`. Session wrap → `reviewing-and-shipping`. Mid-session recap,
no packet → `recommending-next-steps`.

## Mode A — Write

`git status --porcelain`, `git diff --stat`, `git log -5 --oneline`.

Path: `.cursor/handoffs/<YYYY-MM-DD>-<short-slug>.md` (local; do not commit
unless asked). Shared alternate: `docs/dev/handoffs/` only if they want it
committed.

Required sections: `references/handoff-template.md`. Do not reprint it.

Reply with the path and the **Next step** line only.

## Mode B — Resume

1. Newest `.cursor/handoffs/*.md` (or user path / `docs/dev/handoffs/`).
2. Read it end-to-end.
3. **Drift check:** `git status --porcelain` and `git diff --stat`. Report:
   matches / diverged / blocked.
4. Restate Goal + Next step. **ASK — do not auto-execute** unless they say
   continue/implement.
5. On continue: `status: resumed` + timestamp, then do the Next step.

## Guardrails

Accomplished rows need a path or command. No secrets/PII. Do not invent remaining
work. Handoff ≠ commit — leave edits unstaged unless asked.

## Pairs with

- skills: `complete-the-build`, `agentic-loop`, `create-plan`, `summarizing-my-work` (different job), `recommending-next-steps`
- rules: `git-safety`, `no-shortcuts`, `shared-working-tree`
- commands: `session-handoff` (`/session-handoff`) — registry id `session-handoff-cmd`
- workflows: `plan-then-build`, `run-autonomous-loop`
