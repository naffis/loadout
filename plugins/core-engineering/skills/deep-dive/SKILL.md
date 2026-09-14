---
name: deep-dive
description: >
  Investigate a brief seed to one recommendation. Use for "deep dive:" or "dig in:". Do not implement. "dig deeper" after a shallow fix → do-it-right.
---

# Deep dive

Seed, not a spec. Commit to the **underlying problem**. Do not implement. No commit/push/PR unless asked.

`deep dive:` / `dig in:` / "what's the best way to" / "think through this". `dig in:` is this skill. `dig deeper` is `do-it-right`.

| Situation | Use instead |
| --- | --- |
| "Create a plan for X" / `/plan` | `create-plan` |
| "dig deeper" / "do it correctly" after a shallow fix | `do-it-right` |
| Mid-build "are we still doing this right?" | `deep-flight` |
| Everyday red test already framed | `debugging-an-issue` |
| Proven class root, implement the fix | `root-cause-fix` |
| Unfamiliar API/library to adopt | `researching-a-dependency` |
| "What workflow should I run?" | `getting-started` |
| Mid-session "what's next" / recap then dive leftover | `recommending-next-steps` |

## Workflow

### 0. Classify and scale

**Class** (one): **idea** (job-to-be-done first) · **feature** (repo then options) · **bug** (root cause before any solution) · **problem** (name it, then feature or bug).

**Mode** (lightest fit; keep off the reply):

| Mode | When | How far |
| --- | --- | --- |
| **LIGHT** | typo, rename, one-line, no fork | Skip steps 3–6. Bugs still name the cause. |
| **STANDARD** | typical feature or bug | 2 approaches, all three forcing functions, short self-review |
| **FULL** | new capability / architecture / ambiguous | 2–4 approaches, all three forcing functions, full self-review |

Do not expand LIGHT. STANDARD/FULL run the creativity bar in full. Repo before the web. Evidence: live code > docs > AGENTS.md > labeled assumption.

### 3–6 (STANDARD/FULL; LIGHT skips)

**3 External:** skip only if purely internal (say so). Cite title + URL + takeaway. Dependency adoption → `researching-a-dependency`; recommendation stays here.

**4 Forcing functions (all three):** 2–4 genuinely different approaches, not decorations of one idea.
- **Other domain:** how a different industry solves the analog.
- **Inversion:** remove or bypass the thing instead of fixing/building it.
- **10x simpler:** what if it were far smaller? Include "do less" / "don't build" when defensible.

For each: optimizes / trades / effort / failure modes / second-order effects. Steelman the ones you are not picking.

**5 Recommend:** pick one. Kill criteria. Smallest validating slice — do not implement. Feature/idea → `create-plan`. Bug → `root-cause-fix` or `do-it-right`. **Out of scope** explicit. Flag every user choice as `DECISION:`.

**6 Self-review (exactly one pass):** skeptical objection, 10x/weird/partial-failure, strongest case this is wrong. Revise if it lands; otherwise note why survivable. Do not iterate until every objection dies.

### 7. Output

Write `_shared/plain-english-brief.md` only. No Mode/Class line, no alternatives table, no Self-review in the reply. LIGHT: What's going on (two lines) + What we need to do (the pick). STANDARD/FULL: same; choices under **Decision**.

Then **last** — `_shared/next-prompt.md`. A `## Next` sentence is incomplete:

````markdown
## Next prompt

```text
create-plan: <committed recommendation + enough context to act>

Specimen: <plan path / issue id — omit if none>
Root node: <file:symbol or layer — omit if a plan>
Class / slice: <smallest validating slice>
Out of scope: …
Do not implement a proximate patch. Follow the named skill in full.
```
````

## Pairs with

- rules: `deep-dive-rule`, `no-shortcuts`, `definition-of-done`, `regression-test`
- skills: `getting-started`, `recommending-next-steps`, `create-plan`, `planning-a-change`, `review-plan`,
  `do-it-right`, `root-cause-fix`, `debugging-an-issue`,
  `researching-a-dependency`, `writing-an-adr`, `running-a-dev-cycle`
- agents: `explorer`
- commands: `deep-dive-cmd` (`/deep-dive`)
- workflows: `plan-then-build`, `ship-a-feature`, `debug-production`
- refs: `_shared/plain-english-brief.md`, `_shared/next-prompt.md`
