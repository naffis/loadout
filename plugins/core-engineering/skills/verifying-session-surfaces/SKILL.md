---
name: verifying-session-surfaces
description: >
  Exercise every surface this session created or changed, with pasted evidence. Use for "test all the surfaces" or /verify-surfaces.
---

# Verifying session surfaces

Prove this conversation's live surfaces work, then fix what the proof
turns up. Same-pass unit tests are circular — the oracle is the running
product. `agentic-loop`: contract, evidence over recall, maker ≠ checker,
budget **3**, edits unstaged. **Empty dirty tree ≠ empty session**
(`references/session-scope.md`). Prefer this for "does it work?";
`post-flight` for ask-vs-ship + shortcuts + siblings.

## Neighbors

| Ask                                            | Use instead                                   |
| ---------------------------------------------- | --------------------------------------------- |
| Ask-vs-ship + sibling sweep + shortcuts        | `post-flight`                                 |
| Diff vs a written plan                         | `review-build`                                |
| Dogfood the whole product / compounding rubric | `exercising-the-product`                      |
| UX heuristics / first-time user                | `reviewing-ui`                                |
| One framed bug, no session inventory           | `root-cause-fix`                              |
| Mid-build "are we still on the right layer?"   | `deep-flight`                                 |
| One named claim (baseline vs treatment)        | `verifying-a-claim` (`/verify-claim`)         |

## Contract (after inventory, before exercise)

- **End state:** every session surface **and** ask-implied function has a
  falsifiable claim + live verdict; every BROKEN is class-killed or escalated.
- **Evidence:** inventory `RECEIPT` + per-claim command/screenshot/HTTP
  (not "✅ works"). Redact secrets.
- **Constraints:** no interface bypass; no toast-as-proof; no prod URL;
  no bandaid; no commit/push unless asked (`git-safety`).
- **Budget:** 3 edit→verify cycles per finding. At the ceiling, STOP.

## Workflow

### 0. Reconstruct

Read `references/session-scope.md`. Quote the asks. Number implied
surfaces **and** file-less functions. List files this chat edited.
Dirty-only inventory after a commit is a miss.

### 1. Inventory (mechanical RECEIPT)

```bash
.cursor/skills/verifying-session-surfaces/scripts/session-inventory.sh
# committed mid-session / clean tree:
.cursor/skills/verifying-session-surfaces/scripts/session-inventory.sh --since origin/dev
# shared trunk — this chat's paths only:
.cursor/skills/verifying-session-surfaces/scripts/session-inventory.sh path/a path/b
```

Loadout checkout: `plugins/core-engineering/skills/verifying-session-surfaces/scripts/session-inventory.sh`.

Quote `RECEIPT` through `END`. Collapse files → surfaces
(`references/surface-matrix.md`), then **UNION** ask-implied functions.
Zero files + implied work → `--since` or explicit paths; do not CLEAN.

### 2. Claims

`When I <action> under <preconditions>, I observe <result>.`

Happy path always. Added validation → one fail-closed claim. Smallest
exercise that could **disprove** it. Two composing layers (UI→new API,
CLI→new MCP) → **one composed-path claim**; isolated WORKS rows do not
close the join. Optional baseline-vs-treatment claim when a SHA exists.

### 3–4. Preflight + exercise

Start the documented dev command if a claim needs it; wait for health;
one listener per port. Probe-only `BLOCKED` without a start is a skip.
No production. No billable/GPU/paid-partner work unasked.

Read `references/exercise-playbook.md`. UI → markup then screenshot then
click (`ui-evidence`); API → real HTTP; CLI → transcript; MCP → actual
tool call; job/flag/realtime → the local trigger. Verdict: `WORKS` |
`BROKEN` | `BLOCKED` | `N/A`. `BLOCKED` is a finding. Same-session tests
are **not the oracle**. Independent claims may run in parallel; composed
paths stay serial.

### 5–7. Fix, checker, report

`root-cause-fix` every BROKEN (Loop A → class-kill → fail-on-revert).
Re-exercise the **same** claim. Stale isolate → restart, then re-hit.
P0 before P1. Env `BLOCKED` is not a code fix.

`flight-checker` (readonly, fresh, no `resume`) with the report +
`RECEIPT` + session paths. FAIL → one fix+recheck. Same-session
self-grade cannot be CLEAN. Routing: `_shared/flight-family.md`.

Write `references/report.md`. A `WORKS` row without quoted command,
status, or screenshot is FAIL. **CLEAN is illegal on an empty RECEIPT**
unless reconstruction shows no session work.

## Guardrails

Never CLEAN from an empty dirty tree without reconstruction. Never bypass
the surface. Never trust the app's success toast. Never paste tokens /
cookies / PII. Never exercise production or unbounded paid work unasked.
Never turn this into `exercising-the-product` or `post-flight`. Leave
edits unstaged.

## Pairs with

- skills: `root-cause-fix`, `agentic-loop`, `post-flight`, `deep-flight`,
  `review-build`, `reviewing-and-shipping`, `exercising-the-product`,
  `reviewing-ui`, `writing-tests`
- rules: `no-shortcuts`, `definition-of-done`, `regression-test`,
  `git-safety`, `ui-evidence`
- agents: `flight-checker`, `reviewer`
- commands: `verifying-session-surfaces-cmd` (`/verify-surfaces`)
- workflows: `ship-a-feature`, `plan-then-build`, `run-autonomous-loop`
- references: `session-scope.md`, `surface-matrix.md`, `exercise-playbook.md`,
  `report.md`
