---
name: auditing-search-visibility
icon: search
color: blue
description: >
  Audit a page or site for SEO, AIO, and GEO readiness and emit a findings
  report. Use when the user says "SEO audit", "GEO audit", "AIO audit",
  "AEO audit", "AI visibility", "will this get cited", "Search Console",
  "AI Overviews", "audit this page for search", or "/audit-search". Quotes
  the scanner RECEIPT. Report only unless asked to fix. Anti-triggers:
  write the page → writing-citable-content; implement metadata/schema/robots
  → optimizing-for-discovery; classic code quality → reviewing-code-quality.
---

# Auditing search visibility

## Trigger

A named URL, route, or content file needs a discovery audit. No implement
unless the user said "and fix."

## Workflow

1. **Scope.** Named paths, live `http(s)` URLs, or the session diff of
   public pages. Do not glob the whole app.
2. **Evidence.** Read `../_shared/evidence.md`. Google surfaces use T1.
   Other engines: note T3 caveats. Do not score a fake /100.
3. **Scan.** Run the script beside this `SKILL.md`:

   `node scripts/scan-search-visibility.mjs [paths-or-urls…]`

   Vendored: `.cursor/skills/auditing-search-visibility/scripts/scan-search-visibility.mjs`.
   Quote the RECEIPT. No RECEIPT → not done. A named URL is not done
   without a `source: url` line. A `.tsx` / `.jsx` file without first-
   response HTML is a blocker (`not-first-html`), never a clean receipt.
   The scanner fetches raw HTML (no headless render) so empty client
   shells stay visible.
4. **Judgment pass** (LLM; the script cannot do this). For each page:
   - People-first: unique POV, complete answer, who/how/why (`people-first-content`)
   - Spam: scaled/thin/AI-for-ranking, schema lies (`no-search-spam`)
   - Technical: SSR text, crawlable links, one URL (`search-technical`)
   - Extractability: definition lead, answer before essay, tables if comparing
   - Engine extras only if the user named ChatGPT / Perplexity / Copilot:
     search/cite crawlers, optional `llms.txt` (see `../_shared/crawlers.md`)
5. **Findings table.** Pillar → finding → severity (blocker / major / note)
   → fix owner (`writing-citable-content` or `optimizing-for-discovery`).
   Never promise a citation or ranking.
6. Close with `../_shared/plain-english-brief.md`, then the next-prompt
   fence from core-engineering `_shared/next-prompt.md` (first line
   `optimizing-for-discovery:` or `writing-citable-content:`).

## Suggested Checks

- RECEIPT is in the reply.
- Every blocker cites a file or URL.
- T4 vendor tactics are absent from required fixes.
- Default next skill is named in the fence.

## Guardrails

- Report only unless the user said fix.
- Do not invent a GEO readiness score.
- Do not require `llms.txt` or stacked schema for Google.
- Isolated verify of a later implement: `reviewer` or `/review`, not a
  same-session self-grade.

## Pairs with

- rules: `people-first-content`, `no-search-spam`, `search-technical`
- skills: `optimizing-for-discovery`, `writing-citable-content`,
  `cleaning-ai-copy`, `reviewing-ui`
- commands: `audit-search` (`/audit-search`); registry id `audit-search-cmd`
- refs: `../_shared/evidence.md`, `../_shared/sources.md`,
  `../_shared/crawlers.md`, `references/checklists.md`
- workflow: `search-visibility`
