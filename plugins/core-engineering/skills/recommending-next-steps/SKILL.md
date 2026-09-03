---
name: recommending-next-steps
description: >
  Recap this chat from evidence, deep-dive the leftover work, and emit one
  paste-ready next-steps prompt. Use mid-session when the user says "what's
  next", "next steps", "where are we", "what should we do next", "recommend
  next", "session next", "recap and next", or runs /next-steps or
  /recommending-next-steps. Reconstructs asks + git, runs deep-dive or
  debugging-an-issue on the leftover (do-it-right if they already approved a
  shallow fix), then `_shared/next-prompt.md`. Does not implement.
  Anti-triggers: no work yet → getting-started; context dying / write a packet
  → session-handoff; claiming done / sibling fix → post-flight; standup →
  summarizing-my-work; seed only, no session recap → deep-dive; framed symptom
  only → debugging-an-issue; mid-build layer check → deep-flight; open plan
  phases → complete-the-build.
---

# Recommending next steps

You are **mid-session**. Reconstruct what this chat actually did, deep-dive
the leftover, emit **one** paste-ready first message for the next turn or
chat. Do not implement.

This is not `getting-started` (no work yet), not `session-handoff` (durable
packet), not `post-flight` (wrap + fix), not a bare `deep-dive` (no recap).

Routing: `_shared/flight-family.md`. Last output: `_shared/next-prompt.md`.

## Trigger

- "what's next", "next steps", "where are we", "what should we do next",
  "recommend next", "session next", "recap and next", `/next-steps`,
  `/recommending-next-steps`
- A regular session has piled up work and the user wants an unambiguous
  next prompt, not a menu

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

Quote the status/stat. Then write:

1. **Asks** — verbatim user outcomes still in force (this chat).
2. **Accomplished** — only rows with a path, command, or quoted receipt.
   Conversation memory without that evidence is not accomplished.
3. **Leftover** — one sentence: the **underlying remaining problem**, not
   the next button. If the leftover is wrong, say so before diving.
4. **Failed attempts** — commands/errors so the next prompt does not repeat
   them.

No secrets, tokens, signed URLs, `.env` values.

### 2. Route the leftover (run the owning skill — do not re-derive)

Read the owning skill and run it on the leftover seed:

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

Scale LIGHT / STANDARD / FULL with the owning dive. LIGHT only when the
leftover is already a one-line proven cause or a one-line pick.

`getting-started` names the **next skill**. It does not replace the dive.

### 3. Commit the next step

1. One next skill. Not a menu.
2. Kill criteria — what would change this pick.
3. Out of scope — resist expanding the session into a rewrite.
4. Flag user choices as `DECISION:` (they go first in the fence).

### 4. Self-review (exactly one pass)

Would a skeptical engineer say this leftover is the **first remaining
job**, not the loudest? If the critique lands, revise. Skip on LIGHT.

### 5. Output

Terse recap, then the required fence. Incomplete without the fence.

```
## Session so far
Asks: …
Accomplished: <path or receipt per row>
Leftover: <one sentence>
Ran: deep-dive | debugging-an-issue | do-it-right 0–2 | skip (<why>)

## Recommendation
<the pick, one short paragraph>
Kill criteria: …
Out of scope: …
DECISION: <or none>
```

Then **this block is required** (nothing after):

````markdown
## Next prompt

```text
<root-skill>: <committed leftover + enough context to act>

Specimen: <plan path / issue id — omit if none>
Root node: <file:symbol or layer — omit if a plan>
Class / slice: <siblings or smallest validating slice>
Out of scope: …
Do not implement a proximate patch. Follow the named skill in full.
```
````

## Suggested Checks

```bash
git status --porcelain
git diff --stat
git log -5 --oneline
```

## Guardrails

- Evidence over recall. No accomplished row without a path or receipt.
- Run the owning dive. Do not invent a third diagnosis process.
- Do not implement. Do not write a handoff file unless they asked.
- One prompt, ≤20 lines. Not "Want me to…?"
- Leave edits unstaged. No commit/push/PR unless asked.

## Never do

- Recap from chat memory while `git status` is clean of those claims
- Skip the dive because "we already talked about it"
- End on `## Next` prose without a fenced `text` block
- Emit two alternative prompts
- Start `post-flight` or `session-handoff` unless the leftover table says so

## Pairs with

- skills: `deep-dive`, `debugging-an-issue`, `do-it-right`, `getting-started`,
  `session-handoff`, `post-flight`, `complete-the-build`, `create-plan`,
  `root-cause-fix`, `deep-flight`
- rules: `no-shortcuts`, `git-safety`, `deep-dive-rule`,
  `recommending-next-steps-rule`
- refs: `_shared/next-prompt.md`, `_shared/flight-family.md`
- commands: `next-steps-cmd` (`/next-steps`), `recommending-next-steps-cmd`
  (`/recommending-next-steps`)
