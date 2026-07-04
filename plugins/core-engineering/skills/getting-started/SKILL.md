---
name: getting-started
description: Recommend how to proceed on a goal and produce a ready-to-run kickoff prompt. Use when you're new to a project or unsure where to begin — "I want to build X, what should I do?", "how do I start?", "which workflow applies?". Routes the goal to the right loadout workflow, skills, and rules, and decides manual vs autonomous loop.
---

# Getting started

## Trigger

You have a goal but not a plan: "I want to build X", "what should I do?", "how do I start?", or you just loaded loadout into an unfamiliar repo and don't know which workflow to run.

## Workflow

1. **Get the goal clear.** If the request is vague or large, interview briefly (one short round): what's the outcome, the constraints, the **done-condition**, and what's explicitly out of scope. Don't over-ask — one or two sharp questions, then proceed. (Anthropic's "let the agent interview you" pattern.)
2. **Orient if new to the repo.** If you don't know the codebase yet, run the `onboard-to-codebase` workflow (it uses the `explorer` agent) to learn the stack, the change pattern, and the test/build commands before committing to an approach.
3. **Classify the work and route to a workflow:**
   - Build/change a feature → **`ship-a-feature`** (plan → implement → test → docs → review → PR).
   - Red CI / failing build → **`fix-ci-until-green`**.
   - Promote / release → **`cut-a-release`**.
   - Learn a codebase → **`onboard-to-codebase`**.
   - Full autonomous end-to-end build across phases (research→plan→build→verify→docs) →
     **`running-a-dev-cycle`** (it classifies the task and runs each phase as an `agentic-loop`).
   - Improve product quality by using it ("dogfood it", "review the UI", "find and fix
     issues end to end") → **`run-quality-loop`** (`exercising-the-product` for behavior,
     `reviewing-ui` for UX; `recreating-a-design` when matching a specific visual target).
   - No single workflow fits → compose from skills (`planning-a-change` first), and say so.
4. **Decide manual vs autonomous loop.** Run the `loop-preflight` 4-condition test (repeats? automated verification? budget? agent has tools?). If it passes, set up a loop with the `automation-loop` template + a `STATE.md`; otherwise recommend a single attended run. Respect the execution-order law: get a manual run reliable before scheduling anything.
5. **Emit a kickoff prompt.** Output a concrete, paste-ready prompt that names the workflow, the objective, the **gate** (the project's test/lint command), the **done-condition**, and the key constraints/rules. This is the thing the user runs to actually start.

## Output

A short recommendation (which workflow + supporting skills/rules, and manual vs loop), then the kickoff prompt in a fenced block. Keep it to the point. Example shape:

```
Plan: ship-a-feature (manual; doesn't pass the loop test yet).
Kickoff prompt:
  Use the ship-a-feature workflow to add <X>. Explore first and write a short plan
  (planning-a-change). Implement the smallest safe change, add tests for the new
  behavior and error paths, update docs in the same change. Gate: `npm test && npm run lint`.
  Done when: <verifiable condition>. Then dispatch the reviewer subagent and open a PR.
```

## Guardrails

- Be a thin orchestrator: sequence and hand off to the workflow/skills; don't redo their work here.
- Write the done-condition before recommending a kickoff — a goal without a verifiable end is not ready to run, especially as a loop.
- Don't recommend a loop for one-off, unverifiable, or high-stakes work (see `loop-preflight`).

## Pairs with

- workflows: `ship-a-feature`, `onboard-to-codebase`, `fix-ci-until-green`, `cut-a-release`, `run-quality-loop`
- skills: `planning-a-change`, `running-a-dev-cycle`, `agentic-loop`
- runbooks: `loop-preflight`, `harness-setup`
- templates: `automation-loop`, `state-file`
- docs: `catalog` (the menu of everything available)
