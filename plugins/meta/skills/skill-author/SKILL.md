---
name: skill-author
description: >
  Scaffold a SKILL.md to loadout conventions, omitting what the model already knows. Use when creating or restructuring a skill.
---

# Skill author

## Trigger

Creating a new skill, or an artifact that might be a skill.

## Decision test first

A **skill** is a procedure you invoke to accomplish something, with a beginning and end. A **rule** is a persistent constraint with no steps to run. If it's a pure constraint, use `rule-author` instead. If it's both, split: constraint → rule, procedure → skill (a procedure-scoped "Never do" block may stay in the skill).

If a frontier model already completes the task without this skill, **do not create it**. Skills are additions to models, not replacements for them.

Vercel evals (Next.js 16): an unused skill scored **the same as no docs** and was worse on some tests. Skills pay rent only when they are **vertical, explicitly triggered house workflows**. Horizontal knowledge belongs in a thin `AGENTS.md` **index** (pointers, not essays).

## Omit what the model knows (write this first)

Frontier models (2026) need **less prescription**, not more. Anthropic: start from a minimal prompt on the best model, then add only what failed. agentskills.io: *“Would the agent get this wrong without this instruction?”* If no, cut it. OpenAI (Astra): overly specific itineraries now **hinder**; make `SKILL.md` a **router** to references/scripts.

**Keep**

- House invariants the model will violate (`git-safety`, `no-stash`, ready-batch checkpoints, required independent review)
- Unique routing / anti-triggers between loadout skills
- Unique output formats (next-prompt fence, verdicts, RECEIPT quotes)
- Gotchas that defy reasonable assumptions
- Scripts for mechanical receipts the agent can fake in prose

**Do not write**

- Generic TDD / git / debug / review / PR / coverage lectures
- “Why this matters” essays or restatements of public Anthropic/Cursor docs
- Edge-case menus the model’s judgment already covers
- Style guides a linter already enforces

A 200-line checklist the model already knows **hurts**: it burns attention and gets skimmed. Over-explaining is a failure mode on Opus-class models.

## Frontmatter contract (enforced by `loadout doctor`)

- `name`: gerund where natural (`processing-pdfs`), lowercase + hyphens, ≤64 chars, no `claude`/`anthropic`. Avoid `helper`/`utils`/`tools`.
- `description`: third person, **short and narrow**. Hard cap 1024; house target **≤280 chars** (doctor warns above 400). One clause of WHAT + a **narrow WHEN** (named phrases, slash name). At most **one** neighbor anti-trigger. Not "I can…"/"You can…".
- Do **not** dump synonym lists, completeness bars, or anti-trigger novels into the description. Those belong in the body (loaded only after the skill is chosen). Over-broad WHEN is how a 65-skill catalog false-triggers and then hurts (Vercel; OpenAI Astra).
- `user-invocable`: default true (shows in `/`). Set `false` only for background knowledge users should never slash.
- `disable-model-invocation: true` for generic how-to the model already knows (commit message, rebase, coverage). Those stay slash-only so they do not auto-load. Keep auto-invoke for unique house workflows (`create-plan`, `post-flight`, `committing-on-shared-trunk`) **and** house stops that look generic but still bind (`test-driven` paste-RED, `deslopping` as the code-slop neighbor of `cleaning-ai-copy`).

## Body conventions

- Write the **shortest contract that still binds**. Many skills should be 15–40 lines. Complex house procedures may reach 80–120. Hard cap **500 lines / ~5,000 tokens**. 150–250 is a ceiling, not a goal. Root `SKILL.md` is a **router**: house steps + when to open which `references/` file.
- Progressive disclosure: metadata always loaded → body on trigger → `references/` and `scripts/` on demand. References **one hop** from `SKILL.md`. Point at a ref; do not reprint it. Tell the agent *when* to open each file.
- **Scripts for fragile mechanical steps**: a grep/receipt the agent can fake in prose must be a script the report quotes.
- Optional Cursor fields: `paths` (file globs), `disable-model-invocation` (slash-only), `icon` / `color` (Custom Mode).
- **Domain-package skills** must set `paths`. Daily/process skills skip `paths`.
- Destructive or high-stakes skills set `disable-model-invocation: true`.
- House structure: `## Trigger`, `## Workflow` (numbered, house steps only), optional `## Guardrails` / `## Never do`, `## Pairs with`. Skip `## Suggested Checks` unless the check is a unique command.
- Diagnose / audit / review, and any skill that hands to a fresh chat: last output is `_shared/next-prompt.md`.
- Verification: name objective evidence. Require a **readonly checker** when the project,
  user, or specialized review contract requires it. Reuse a matching review; do not add
  another checker solely because one skill hands off to another.
- Human-facing reply: `_shared/plain-english-brief.md`. Run the procedure; do not dump it.

## Workflow

1. Run the decision test and the omit-what-it-knows filter. 2. Draft frontmatter. 3. Write only the house contract. 4. Add `## Pairs with`. 5. Add a `registry.json` entry and run `loadout doctor`.

## Pairs with

- skills: `rule-author`, `learning-from-chats`, `hardening-the-harness`
- docs: `external-practices`, `loop-engineering`
- refs: `_shared/plain-english-brief.md`
