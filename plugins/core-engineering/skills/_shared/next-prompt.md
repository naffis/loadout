# Next prompt — last output of diagnose / audit / review

The next chat has no memory of this one. After a diagnose, audit, review, or
any skill that hands to a **fresh chat**, the last thing the user sees must
be a **first message they can copy and paste**.

Applies when this run **ends without implementing**, or **leaves work for a
new chat** (plan → review, build → grade, residual after a fix pass). Do not
emit a second essay after the fence.

## Required last section

After the report (Self-review / DECISION / appendix included), emit exactly
this, and **nothing after the closing fence**:

````markdown
## Next prompt

```text
<root skill trigger>: <committed finding + enough context to act>
```
````

The inner fence is `text` so one click copies the prompt, not the heading.

Slash commands (`/deep-dive`, `/next-steps`, `/hunt-defects`, `/audit-lifecycle`, …)
inject the command file. That file's last process step **is** this fence. A
command that stops at "emit the report" will skip it — keep the literal
` ```text ` block in the command, not only a pointer.

## The prompt itself

- **One message.** Not a menu. Not "Want me to fix this?"
- **≤20 lines.** Distill. Do not paste the report.
- **First line = owning next skill trigger.**
- Open `DECISION:`s go first: `Confirm A or B. Then:` — otherwise assume the
  recommendation this run committed to.
- **Specimen ids** when the next skill needs them: issue id, plan path, PR,
  trace id, session id. Quote the id, never a token / JWT / signed URL /
  `.env` value / customer PII.
- Never say "see the report above" — the next chat has no above.
- LIGHT still emits one (short). Zero findings / CLEAN still emit one wrap
  prompt (see Shape — wrap).

## Default next trigger

| This skill ran                 | Default first line                                                                                |
| ------------------------------ | ------------------------------------------------------------------------------------------------- |
| `recommending-next-steps`      | whatever the leftover dive committed (`root-cause-fix:` / `create-plan:` / `do-it-right:` / wrap) |
| `deep-dive`                    | feature/idea → `create-plan:`; bug → `root-cause-fix:`                                            |
| `debugging-with-observability` | local repro ready → `debugging-an-issue:`; class root proven → `root-cause-fix:`                  |
| `auditing-resource-lifecycle`  | `do-it-right:` on promoted leaks                                                                  |
| `walking-failure-paths`        | `do-it-right:` on promoted exits                                                                  |
| `hunting-defects`              | `do-it-right:` on Critical/High, one class at a time                                              |
| `auditing-doc-freshness`       | `updating-docs:` on leftover stale items                                                          |
| `reviewing-code-quality`       | `refactoring-code:` on must-fix; taste-only → wrap                                                |
| `reviewing-dependencies`       | `dependency-bump` / `researching-a-dependency:` on the top-risk bump                              |
| `reviewing-ui`                 | leftover P0/P1 → continue from `UI-REVIEW.md`; stop → wrap                                        |
| `create-plan`                  | `review-plan:` + plan path (prefer fresh chat)                                                    |
| `review-plan`                  | APPROVED → `complete-the-build:` or Build; still open → stay on the plan                          |
| `complete-the-build`           | `review-build:` (prefer fresh chat)                                                               |
| `review-build`                 | PASS + user-visible unharvested → `verifying-session-surfaces:`; leftover → named skill           |
| `do-it-right`                  | residual / unproven → stay; non-trivial implement done → `deep-flight:`                           |
| `deep-flight`                  | ON-COURSE → `post-flight:` if wrapping; OFF-COURSE → `do-it-right:`                               |
| `post-flight`                  | CLEAN + user-visible unharvested → `verifying-session-surfaces:`; logged leftover → named         |
| `verifying-session-surfaces`   | leftover BROKEN → `root-cause-fix:`; all green → wrap                                             |

## Shape — class-kill (default)

```text
<root-skill>: <one-sentence committed finding>

Specimen: <issue / plan path / trace id — omit if none>
Root node: <file:symbol or layer>
Class: <sibling variations that must also become impossible>
Kill criteria: <what would overturn this>
Out of scope: <what not to expand into>
Do not implement a proximate patch. Class-kill + regression that fails on the old behavior.
```

## Shape — plan / slice

```text
create-plan: <underlying problem in one sentence>

Recommended: <the pick>
Smallest slice: <what validates the core assumption>
Out of scope: <what not to expand into>
```

## Shape — wrap (zero leftover)

```text
Nothing to implement. Residual: none. If wrapping: post-flight: <one line on what this session did>.
```

## Good vs bad

Good (self-contained):

```text
root-cause-fix: List view shows archived rows because preferVisibleRows treats a null folder_id as an extra folder.

Specimen: issue 142 / plan docs/plans/2026-09-02-library-list.md
Root node: src/files/visible-rows.ts preferVisibleRows
Class: every list filter that treats a missing parent id as a distinct folder
Kill criteria: a null folder_id row still appearing in All
Out of scope: list layout CSS
Do not implement a proximate filter on one session. Class-kill + regression that fails on the old behavior.
```

Bad: `root-cause-fix: fix the issues above` · two alternative prompts · a
dump of the report · a signed URL · `## Next` prose with no fence.

## Invalid

- Ending on `## Next` / "Want me to…?" without a fenced `text` block
- A prompt that only names a skill, or says "see above"
- Multiple alternative prompts (one prompt; DECISION first if needed)
- More than 20 lines inside the fence
