---
name: getting-started
description: >
  Route a new goal to the lightest loadout path and emit a kickoff prompt. Use when new to a project or asking how to start.
---

# Getting started

## Trigger

Goal but no plan: "I want to build X", "how do I start?", "which workflow
applies?", or loadout just loaded into an unfamiliar repo.

## Workflow

1. **Orient if new.** Unknown codebase → `onboard-to-codebase` (`explorer`)
   before committing to an approach. If the request is vague: one short round
   on outcome, done-condition, and out-of-scope — then proceed.
2. **Classify the work and route:**
   - Mid-session "what's next" / recap + leftover dive → **`recommending-next-steps`** (`/next-steps`). Not this skill.
   - Seed thought / "deep dive:" / "dig in:" / "what's the best way to X" (not yet a plan or a fix) → **`deep-dive`**.
   - Ordinary well-understood feature → **`ship-a-feature`**.
   - High-stakes / unfamiliar / multi-file trade-offs → **`plan-then-build`**
     (`/plan` → `/review-plan` → implement → `/complete-the-build` when open →
     `/review-build`).
   - Red CI / failing build → **`fix-ci-until-green`**.
   - Staging/prod failure, no local repro → **`debug-production`** (evidence first).
   - Immediate outage (rollback / flag / hotfix) → **`hotfix-and-rollback`**, then class-fix via `debug-production` / `root-cause-fix`.
   - Security review of a diff/surface → **`security-pass`**.
   - Several independent tickets → **`clear-the-queue`**.
   - One task that may split into file-bounded units → **`build-as-graph`** /
     `task-topology` (default single-loop; not a ticket queue).
   - Behavior-preserving cleanup → **`safe-refactor`**.
   - Schema/data migration → **`ship-a-migration`**.
   - Dependency upgrade / bump PR → **`dependency-bump`**.
   - Promote / release → **`cut-a-release`**.
   - Learn a codebase → **`onboard-to-codebase`**.
   - "use/install/update loadout" → **`equipping-loadout`** (`INSTALL.md` / `doc-install`); do not improvise.
   - Unequipped repo → **`equipping-loadout`** / `INSTALL.md`, or **`bootstrap-project`**.
   - Attended research→plan→build→verify→docs → **`running-a-dev-cycle`**.
   - Unattended until-contract-met (passed `loop-preflight`) → **`run-autonomous-loop`**.
   - Already implemented; evidence-first check → **`review-build`** (`/review-build`), fresh chat preferred — or full **`plan-then-build`** if plan review is still owed.
   - Mid-session course-correct → **`deep-flight`** (`/deep-flight`). Not `deep-dive`.
   - One named claim (baseline vs treatment) → **`verifying-a-claim`** (`/verify-claim`). Not session inventory, not Cursor `/review`.
   - Prove live surfaces work → **`verifying-session-surfaces`** (`/verify-surfaces`). Prefer when the ask is "test all the surfaces / ensure it works."
   - Diff / PR review → Cursor-native **`/review`**, **`/review-bugbot`**,
     **`/review-security`**. Do not invent loadout skills with those names.
   - Recurring interval → Cursor **`/loop`**. Unattended cloud → **`/autopilot`**. Visual artifact → **`/canvas`**.
   - Merge/rebase conflict markers → **`resolving-merge-conflicts`**. Not a stash.
   - Session wrap + sibling fix → **`post-flight`** (`/post-flight`). Run `/verify-surfaces` first if user-visible surfaces landed.
   - Large named package, no single bug → **`hunting-defects`** (`/hunt-defects`). Not a merge review. Workflow: `defect-hunt`.
   - Open plan Partial/Missing/Punted → **`complete-the-build`** (`/complete-the-build`) before review-build.
   - Context dying / switching chats → **`session-handoff`** (`/session-handoff`).
   - Approved a shallow fix / "do it correctly" → **`do-it-right`** (`/do-it-right`).
   - Strict test-first → **`test-driven`** (`/tdd`).
   - Large agent diff feels overbuilt → **`simplifying-code`** (`/simplify`) then review-build.
   - Changelog / docs / UI strings sound like ChatGPT → **`cleaning-ai-copy`** (`/deslop-copy`). Not `deslopping`, not `/review`.
   - Public-page SEO / AIO / GEO / "get cited" → **`search-visibility`**
     (`loadout add search-visibility`): `auditing-search-visibility` (`/audit-search`)
     then `writing-citable-content` and/or `optimizing-for-discovery`
     (`/optimize-discovery`). Named URLs need a live HTML RECEIPT. Not a ranking promise.
   - Dogfood / review UI / find-and-fix end to end → **`run-quality-loop`**
     (`exercising-the-product` for behavior, `reviewing-ui` for UX;
     `recreating-a-design` when matching a visual target).
   - No single workflow fits → compose (`planning-a-change` or `create-plan` first), and say so.
3. **Manual vs autonomous.** `loop-preflight` (repeats? automated verification?
   budget? tools?). Pass **and** they want unattended → `run-autonomous-loop`
   (or `automation-loop` + `STATE.md`). Else attended (`ship-a-feature` /
   `plan-then-build` / `running-a-dev-cycle`). Manual-reliable before scheduling.
4. **Kickoff prompt.** Names workflow, objective, **gate**, **done-condition**,
   key constraints. Paste-ready.

## Output

Short recommendation (workflow + skills/rules, manual vs loop), then:

```
Plan: ship-a-feature (manual; doesn't pass the loop test yet).
Kickoff prompt:
  Use the ship-a-feature workflow to add <X>. Explore first and write a short plan
  (planning-a-change). Implement the smallest safe change, add tests for the new
  behavior and error paths, update docs in the same change. Gate: `npm test && npm run lint`.
  Done when: <verifiable condition>. Then dispatch the reviewer subagent. Commit
  the whole tree on trunk if asked (`committing-on-shared-trunk`). PR only if asked.
```

## Guardrails

- Thin orchestrator: sequence and hand off; don't redo their work.
- Write the done-condition before kickoff — a goal without a verifiable end is not ready to run, especially as a loop.
- Don't recommend a loop for one-off, unverifiable, or high-stakes work (`loop-preflight`).
- Diff review is Cursor `/review` / `/review-bugbot` / `/review-security` — do not invent loadout skills with those names.

## Pairs with

- workflows: `ship-a-feature`, `plan-then-build`, `onboard-to-codebase`, `fix-ci-until-green`, `debug-production`, `security-pass`, `clear-the-queue`, `build-as-graph`, `safe-refactor`, `ship-a-migration`, `dependency-bump`, `cut-a-release`, `run-quality-loop`, `run-autonomous-loop`, `defect-hunt`, `search-visibility`
- skills: `planning-a-change`, `create-plan`, `review-plan`, `complete-the-build`, `review-build`, `deep-flight`, `post-flight`, `verifying-session-surfaces`, `verifying-a-claim`, `resolving-merge-conflicts`, `session-handoff`, `recommending-next-steps`, `do-it-right`, `deep-dive`, `test-driven`, `simplifying-code`, `running-a-dev-cycle`, `agentic-loop`, `task-topology`, `equipping-loadout`, `hunting-defects`, `auditing-search-visibility`, `writing-citable-content`, `optimizing-for-discovery`
- commands: `start` (`/start`), `plan` (`/plan`), `build-as-graph-cmd` (`/build-as-graph`), `review-plan-cmd` (`/review-plan`), `complete-the-build-cmd` (`/complete-the-build`), `deep-flight-cmd` (`/deep-flight`), `review-build-cmd` (`/review-build`), `post-flight-cmd` (`/post-flight`), `verifying-session-surfaces-cmd` (`/verify-surfaces`), `verify-claim-cmd` (`/verify-claim`), `session-handoff-cmd` (`/session-handoff`), `next-steps-cmd` (`/next-steps`), `do-it-right-cmd` (`/do-it-right`), `tdd-cmd` (`/tdd`), `simplify-cmd` (`/simplify`), `hunt-defects-cmd` (`/hunt-defects`), `audit-search-cmd` (`/audit-search`), `optimize-discovery-cmd` (`/optimize-discovery`)
- runbooks: `loop-preflight`, `harness-setup`, `bootstrap-project`, `hotfix-and-rollback`
- templates: `automation-loop`, `state-file`
- docs: `catalog` (the menu of everything available), `doc-install` (`INSTALL.md`)
