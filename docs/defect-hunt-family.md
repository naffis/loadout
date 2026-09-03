# Defect-hunt family — exhaustive review without a known bug

Owning doc for `hunting-defects`, `auditing-resource-lifecycle`, and
`walking-failure-paths`. Routing table consumed by skills:
`.cursor/skills/hunting-defects/references/family.md`.

## Problem

The debug family (`debugging-an-issue`, `root-cause-fix`,
`debugging-with-observability`) starts from a **symptom**.
`reviewing-and-shipping` starts from a **diff**. `reviewing-code-quality`
grades maintainability. None of those will exhaustively walk a package
looking for leaks, races, swallowed errors, and untested edge paths — and
agents routinely claim they "reviewed the module" after skimming a handful
of files.

The class root is **unmeasured completeness**.

## State of the art

| Source                                                   | Takeaway                                                                                                                         |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| BugScope (arxiv 2507.15671)                              | Do not dump the whole repo into one context. Seed suspicious operations, then expand call-graph context selectively.             |
| BugStone / "One Bug, Hundreds Behind" (arxiv 2510.14036) | Recurring Pattern Bugs: one proven finding is a seed. Scan the rest of the program for the same acquire/misuse shape.            |
| Refute-or-Promote (arxiv 2604.19049)                     | Stratified hunters (scope × class × wave) plus adversarial kill stages. Parent synthesizes; hunters do not grade their own work. |
| ConSynergy (Future Internet 2025)                        | Concurrency: identify shared state → slice concurrent region → reason data flow. Do not "look for races" as adjectives.          |
| Cursor Skills + Anthropic skill authoring                | Slim SKILL.md; scripts for mechanical receipts the agent cannot fake in prose; maker ≠ checker.                                  |

Adopted:

1. **Census receipt** — every in-scope file listed before any judgment.
2. **Waves, not one gulp** — 25–40 files per wave; never skip the tail because
   "enough findings."
3. **Refute-or-promote** — a candidate is speculative until a kill check fails.
4. **Sibling sweep** — promoted findings become pattern seeds (BugStone).
5. **Audit vs fix** — this family reports. Implement via `do-it-right` /
   `root-cause-fix` when the user asks.
6. **Generic core, project overlay** — loadout ships stack-agnostic classes
   and scripts. Product writers / money / tenancy live in consumer-owned
   `project-overlay.md` so `loadout update` does not clobber them.

Rejected:

- One 800-line "be thorough" mega-skill (models skim it).
- Wrap / ship skills absorbing whole-package hunts (those are diffs).
- Completeness claimed from conversation memory.
- Baking a specific product's SessionDO / ledger / DSP names into the
  generic skill (that is the overlay).

## Equip

```bash
npx github:naffis/loadout add defect-hunt
npx github:naffis/loadout update
```

`uses:` closes the three skills, three commands, `explorer`, and `reviewer`.
Then optionally copy the overlay template:

`.cursor/skills/hunting-defects/references/overlay-template.md`
→ `.cursor/skills/hunting-defects/references/project-overlay.md`

## Invoke

```
/hunt-defects src
/audit-lifecycle src/hooks
/walk-failure-paths src/billing.ts
```

Or: "hunt defects in `packages/api`" / "exhaustive review of the wallet."

## Definition of done

A hunt is complete only when:

1. The census RECEIPT is quoted (`review:` files, not docs/css).
2. A wave log lists every `review:` file; partial findings after **each** wave.
3. Every lifecycle `imbalance delta>0` is paired, killed, or a candidate.
4. Concurrency slice table is filled when Map/Set/lock seeds exist.
5. Every promoted finding survived refute (one-sentence missing path).
6. Sibling sweep ran on each promoted class (callers first).
7. Speculative items are labeled — they are not Critical.
8. `reviewer` or `/review` ran before `SURFACE CLEAN` or any Critical/High.

Fixing is out of band unless the user asked.
