# AGENTS.md (template)

Cross-tool baseline. This file is an **index**, not a manual. Vercel evals: a
compressed index that points at retrievable files beat unused skills. Keep it
THIN — commands, gotchas, pointers. Situational procedures belong in a skill.
Litmus per line: "would removing this cause a mistake?" If not, cut it.
Do not say "read architecture.md before every edit" (OpenAI Astra) — point at
the file **when that task happens**. Do not paste skill bodies here.

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

- Diagnose / review / plan replies: what's going on, what to do, any decision (`_shared/plain-english-brief.md`). Details only if asked.
- Integration trunk: `<dev|main|…>`. Optional shared-tree kit: parallel agents share one local
  trunk checkout — no per-agent branches/worktrees/stashes; when asked to commit, land all
  eligible dirty files (`committing-on-shared-trunk`).
- Branch/PR etiquette: <branch naming> · PRs only when explicitly asked · target `<integration branch>` · conventional commits.

## Index (pointers, not essays)

- House docs: `<path>` — read when <task>, not before every edit
- Plan / research notes: `docs/plans/`
- Prefer retrieval over training-data guesses for <framework APIs not in the model>

## Do not

- Commit secrets or PII; read them from env / secret store.
- `git stash`, create a feature branch, or selectively stage "only my files" when the shared-tree kit is installed.
- <project-specific footgun>

> Nested `AGENTS.md` files in subdirectories override these for that area.
