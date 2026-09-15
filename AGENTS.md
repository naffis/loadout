# Loadout project instructions

- Preserve asset IDs, CLI/install contracts, three-way merge behavior, and local-edit
  protection. This repository distributes instructions; changes affect downstream agents.
- Never expose secrets, stash, discard WIP, or change global agent settings. Leave
  edits unstaged; commits, branches, pushes, PRs, and releases need an explicit ask.
- Preserve required validation/release gates and security checks. A local pass is
  not a CI or release pass. Do not alter CI triggers or hooks during process adoption.
- For repository structure and distribution choices, read README.md and
  docs/agent-harness-engineering.md. For commands and validation, read docs/usage.md.
- When authoring assets, read the relevant skill-author or rule-author skill in
  plugins/meta/skills/; register assets in registry.json and verify with doctor.
- When adopting this workflow elsewhere, use the adopting-engineering skill in
  plugins/meta/skills/ and docs/adopt-portable-engineering-prompt.md.
- For the evidence behind process defaults, read docs/efficient-agent-development.md.
- Files under templates/, rules/, and plugins/ are distributed assets, not nested
  project instructions. Preserve task-specific security and explicitly requested reviews.


<!-- loadout:engineering:start -->
For the adopted engineering workflow, read .loadout/engineering/WORKFLOW.md
and .loadout/engineering/project.json. Preserve applicable project and nested
instructions; report conflicts instead of silently overriding them.
<!-- loadout:engineering:end -->
