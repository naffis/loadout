# AGENTS.md (template)

Cross-tool baseline conventions, read by Cursor and other agents. Keep it THIN — only what
applies broadly. Situational knowledge belongs in a skill (loaded on demand), not here.
Litmus test per line: "would removing this cause an agent to make a mistake?" If not, cut it.

## Stack

- <language / framework / runtime>
- <datastore> · <queue/jobs> · <build tool>

## Commands

- Install: `<cmd>`
- Dev: `<cmd>`
- Test: `<cmd>` (prefer running focused tests)
- Lint / typecheck: `<cmd>`

## Conventions

- <non-default code style that a linter doesn't already enforce>
- <architecture decision specific to this project>
- <naming / structure rule worth stating>

## Workflow

- Smallest safe change; follow existing patterns; verify with the test/build before claiming done.
- Branch/PR etiquette: <branch naming> · PRs target `<integration branch>` · conventional commits.

## Do not

- Commit secrets or PII; read them from env / secret store.
- <project-specific footgun>

> Nested `AGENTS.md` files in subdirectories override these for that area.
