---
name: skill-author
description: Scaffold a new SKILL.md to loadout conventions and apply the rule-vs-skill test. Use when creating or restructuring a skill.
---

# Skill author

## Trigger

Creating a new skill, or an artifact that might be a skill.

## Decision test first

A **skill** is a procedure you invoke to accomplish something, with a beginning and end. A **rule** is a persistent constraint with no steps to run. If it's a pure constraint, use `rule-author` instead. If it's both, split: constraint → rule, procedure → skill (a procedure-scoped "Never do" block may stay in the skill).

## Frontmatter contract (enforced by `loadout doctor`)

- `name`: gerund where natural (`processing-pdfs`), lowercase + hyphens, ≤64 chars, no `claude`/`anthropic`. Avoid `helper`/`utils`/`tools`.
- `description`: third person, ≤1024 chars, states **what it does AND when to use it** with trigger terms (this drives auto-selection). Not "I can…"/"You can…".

## Body conventions

- Keep `SKILL.md` under 500 lines. Push detail into reference files (`references/*.md`), kept **one level deep**, with a table of contents if >100 lines.
- Progressive disclosure: the body is an overview that points to references/scripts loaded on demand. Prefer pre-made scripts over generated code for fragile steps.
- House structure: `## Trigger`, `## Workflow` (numbered), optional `## Guardrails` / `## Never do`, and a closing `## Pairs with` listing related rules/skills/agents and the workflows it serves.
- Be concise — assume the model is smart; only add what it doesn't already know.

## Workflow

1. Run the decision test. 2. Draft frontmatter. 3. Write a tight body in the house structure. 4. Add `## Pairs with`. 5. Add a `registry.json` entry (`layer`, `pairs_with`, `workflows`) and run `loadout doctor`.

## Pairs with

- skills: `rule-author`, `learning-from-chats`
- docs: `external-practices`, `loop-engineering`
