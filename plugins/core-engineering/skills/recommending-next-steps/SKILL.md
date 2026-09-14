---
name: recommending-next-steps
description: >
  Recap this chat and emit one next-steps prompt. Use for "what's next", "where are we", or /next-steps. Does not implement.
---

# Recommending next steps

Mid-session: reconstruct from evidence, run the leftover's owning skill, emit
**one** paste-ready next prompt. Do not implement. Routing:
`_shared/flight-family.md`. Last output: `_shared/next-prompt.md`.

## When to use vs neighbours

| Situation                                   | Use instead           |
| ------------------------------------------- | --------------------- |
| No work yet / which workflow                | `getting-started`     |
| Context dying / need a resume file          | `session-handoff`     |
| Claiming done / sibling hunt / fix wrap     | `post-flight`         |
| Standup / what did I ship                   | `summarizing-my-work` |
| Seed thought, no session recap              | `deep-dive`           |
| Framed symptom only, no session recap       | `debugging-an-issue`  |
| Mid-build "are we still on the class path?" | `deep-flight`         |
| Open plan Partial / Missing / Punted        | `complete-the-build`  |
| Approved a shallow fix already              | `do-it-right` (below) |

## Workflow

### 1. Reconstruct (evidence, not memory)

```bash
git status --porcelain
git diff --stat
git log -5 --oneline
```

Quote status/stat. Then:

1. **Asks** — verbatim user outcomes still in force.
2. **Accomplished** — only rows with a path, command, or quoted receipt.
3. **Leftover** — one sentence: the underlying remaining problem, not the next button.
4. **Failed attempts** — commands/errors so the next prompt does not repeat them.

No secrets, tokens, signed URLs, `.env` values.

### 2. Route the leftover (run the owning skill — do not re-derive)

| Leftover                                   | Run                                                   |
| ------------------------------------------ | ----------------------------------------------------- |
| Unexplained failure / wrong pixels         | `deep-dive` (bug class) or `debugging-an-issue`       |
| Feature / idea / "what's the best way"     | `deep-dive`                                           |
| User already said yes to a shallow fix     | `do-it-right` Phases 0–2 only (no edits)              |
| Cause already proven in this chat          | Skip re-dive; next is `root-cause-fix`                |
| Recommendation already committed this chat | Skip re-dive; next is `create-plan` / implement skill |
| Nothing left                               | Wrap prompt                                           |
| Claiming done / they asked to wrap         | Stop; hand to `post-flight`                           |
| Open plan gaps                             | Stop; hand to `complete-the-build`                    |

Scale LIGHT / STANDARD / FULL with the owning dive. LIGHT only when leftover is
a one-line proven cause or pick. `getting-started` names the next skill; it does
not replace the dive.

### 3. Commit + output

One next skill — not a menu. Kill criteria. Out of scope. `DECISION:` first in
the fence. One self-review pass (is this the **first remaining job**, not the
loudest? skip on LIGHT). Brief, then fence (≤20 lines, nothing after):

````markdown
## Next prompt

```text
DECISION: <user choices first — omit if none>
<root-skill>: <committed leftover + enough context to act>

Specimen: <plan path / issue id — omit if none>
Root node: <file:symbol or layer — omit if a plan>
Class / slice: <siblings or smallest validating slice>
Out of scope: …
Do not implement a proximate patch. Follow the named skill in full.
```
````

## Guardrails

- No accomplished row without a path or receipt. Do not recap from memory.
- Run the owning dive. Do not implement. One prompt, not two. Not "Want me to…?"
- Do not start `post-flight` or `session-handoff` unless the leftover table says so.
- Leave edits unstaged. No commit/push/PR unless asked.

## Pairs with

- skills: `deep-dive`, `debugging-an-issue`, `do-it-right`, `getting-started`, `session-handoff`, `post-flight`, `complete-the-build`, `create-plan`, `root-cause-fix`, `deep-flight`
- rules: `no-shortcuts`, `git-safety`, `deep-dive-rule`, `recommending-next-steps-rule`
- refs: `_shared/plain-english-brief.md`, `_shared/next-prompt.md`, `_shared/flight-family.md`
- commands: `next-steps-cmd` (`/next-steps`), `recommending-next-steps-cmd` (`/recommending-next-steps`)
