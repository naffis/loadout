---
name: optimizing-for-discovery
icon: globe
color: green
description: >
  Implement discovery fixes (metadata, schema, robots). Use for "add schema" or /optimize-discovery. Audit only → auditing-search-visibility.
---

# Optimizing for discovery

## Trigger

Named public pages need metadata, HTML, robots, sitemap, or structured
data changes. Read `../_shared/evidence.md` first.

## Workflow

1. **Baseline.** Run

   `node ../auditing-search-visibility/scripts/scan-search-visibility.mjs [paths-or-urls…]`

   Quote the RECEIPT. Named URLs must appear as `source: url`. Framework
   sources without first-response HTML are blockers. If you only have
   this skill vendored, copy the script from the plugin or run
   `auditing-search-visibility` first.
2. **Blockers first.** Indexing and crawl (robots, `noindex`, 404,
   client-only body, `Disallow: /`). Then title/H1/canonical. Then
   schema. Then optional agent files.
3. **Implement** against `search-technical` and `no-search-spam`:
   - Framework metadata matches the rendered H1 and description
   - Canonical + Open Graph only if the page is real and public
   - JSON-LD: `references/structured-data.md`. Types that fit. Facts
     already visible.
   - Server-render the text crawlers must see
   - `robots.txt` / crawlers: `../_shared/crawlers.md`. Do not block a
     search/cite bot unless the user asked.
   - `llms.txt` only if the user asked or the site is docs/agents. Say
     it is not a Google ranking file.
4. **Other engines.** If they named ChatGPT / Perplexity / Copilot, read
   `references/engines.md`. Do not apply those extras as Google
   requirements.
5. **Re-scan.** Quote the second RECEIPT. Blockers must be 0 on scoped
   files you claimed to fix.
6. Close with `../_shared/plain-english-brief.md`. No citation promise.
   Isolated check: `reviewer` or `/review` on the metadata/schema diff.

## Suggested Checks

- Both RECEIPTs quoted when a scan ran.
- Schema validates as JSON and matches visible copy.
- No new thin URL was created to chase a fan-out query.

## Guardrails

- Do not add FAQ/Review schema for content that is not on the page.
- Do not require stacked Article+FAQ+HowTo+ItemList on every URL.
- Do not date-bump.
- Do not commit/push/PR unless asked.

## Pairs with

- rules: `search-technical`, `no-search-spam`, `people-first-content`
- skills: `auditing-search-visibility`, `writing-citable-content`
- commands: `optimize-discovery` (`/optimize-discovery`); registry id
  `optimize-discovery-cmd`
- refs: `../_shared/evidence.md`, `../_shared/crawlers.md`,
  `references/structured-data.md`, `references/engines.md`
- workflow: `search-visibility`
