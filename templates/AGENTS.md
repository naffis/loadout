# AGENTS.md (template)

Cross-tool baseline conventions, read by Cursor and other agents. Keep it THIN — only what
applies broadly. Situational knowledge belongs in a skill (loaded on demand), not here.
Litmus test per line: "would removing this cause an agent to make a mistake?" If not, cut it.
Do not paste procedures or skill bodies into this file — that is a skill. When the chat
itself is rotting (task change, two failed corrections), use `context-hygiene` / a new
conversation, not more lines here.

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
- Integration trunk: `<dev|main|…>`. Optional shared-tree kit: parallel agents share one local
  trunk checkout — no per-agent branches/worktrees/stashes; when asked to commit, land all
  eligible dirty files (`committing-on-shared-trunk`).
- Branch/PR etiquette: <branch naming> · PRs only when explicitly asked · target `<integration branch>` · conventional commits.

## Do not

- Commit secrets or PII; read them from env / secret store.
- `git stash`, create a feature branch, or selectively stage "only my files" when the shared-tree kit is installed.
- <project-specific footgun>

> Nested `AGENTS.md` files in subdirectories override these for that area.
