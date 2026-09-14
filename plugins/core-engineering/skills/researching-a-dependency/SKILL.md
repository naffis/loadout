---
name: researching-a-dependency
description: >
  Research a library or API from primary sources before integrating it. Use when adopting new tech. Bump audit → reviewing-dependencies.
---

# Researching a dependency

Primary sources → a versioned, cited reference. The artifact is the point.
Unknown API blocking a plan, or INTEGRATION/INVESTIGATION research in
`running-a-dev-cycle`. Audit/bump PR → `reviewing-dependencies`. Document our
code → `updating-docs`.

## Workflow

1. **Scope** — primary question; stack + versions from **this repo's** manifest
   (`package.json` / `requirements.txt` / `Cargo.toml` / equivalent); depth:
   `QUICK_REF` | `INTEGRATION_GUIDE` | `DEEP_DIVE`.
2. **Gather** — official docs first, then maintainer examples/changelogs.
   Prefer firecrawl if present. Record URL + access date. Flag >12 months
   `[STALE — verify]`. Conflicts → official wins; note the conflict.
3. **Write** the versioned artifact where the project keeps references
   (e.g. `docs/reference/…`). Pin **Version** to the manifest. Fields:
   Technology; one-liner; Official docs; Version; Last Verified (YYYY-MM-DD);
   Status (ACTIVE / EVALUATING / DEPRECATED); Quick start; Authentication
   (env var **names** only — no secrets); Core usage; Data models; Error
   handling; Rate limits; Gotchas; Testing; Sources (URL + date).
4. **Verify** — examples match this repo's stack/versions (not "works with X");
   auth names match `.env.example`; common errors have an action; at least one
   GOTCHA; `Last Verified` is today.

## Freshness

>90 days since `Last Verified` → re-verify versions, endpoints, and auth
before trusting. Update the date. Prefer updating an existing doc over a near-duplicate.

## Pairs with

- skills: `running-a-dev-cycle`, `updating-docs`, `writing-an-adr`, `reviewing-dependencies`
- rules: `documentation-updates`, `dependency-version-management`
- workflows: `dependency-bump`
- docs: `agentic-patterns`
