---
name: working-agentically
description: >
  Apply an adopted loadout shared-checkout workflow across CLI agents. Use for
  engineering work in a project with .loadout/engineering/install.json, or when
  explicitly asked to adopt the portable engineering profile.
---

# Working agentically

## Trigger

The project adopted the portable engineering profile, or the user asks to adopt
it. Merely using Codex, Grok, Cursor, Claude, or Herdr does not activate adoption.

## Workflow

1. If `.loadout/engineering/install.json` is absent, inspect the repository's
   existing instructions. Use `loadout engineering plan` for a read-only adoption
   preview. Do not install or replace project instructions without adoption scope.
2. For an adopted project, read `.loadout/engineering/WORKFLOW.md` and its adjacent
   `project.json`. Use project architecture/development docs only when relevant.
3. Follow the selected process with existing project and nested constraints. A
   conflict needs a deliberate change at its source, not an invented precedence.
4. Keep one writing agent by default; use an identified coordinator and explicit
   file/resource ownership when authorized parallel sessions actually save time.
5. Use focused feedback and reuse applicable validation. Distinguish completed
   implementation from a verified batch or release. No scheduler, file lock, or
   native permission setting is created by this skill.

## Pairs with

- docs: `doc-portable-engineering`, `doc-adopt-portable-engineering-prompt`
- Existing project architecture and development guides; project-required checkers.
