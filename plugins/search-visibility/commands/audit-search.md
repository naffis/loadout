---
description: Audit named pages for SEO, AIO, and GEO. Report only. Quote the scanner RECEIPT.
---

Run the `auditing-search-visibility` skill in full. Scope to named paths,
live URLs, or the session public-page diff. Quote the scanner RECEIPT.
Do not invent a GEO score or promise a citation.

Default is **report only**. Implement only if the user said "and fix":
then `optimizing-for-discovery` or `writing-citable-content`.

## Process (do not skip)

1. Scope paths and URLs. Read `skills/_shared/evidence.md`.
2. Scan: `node scripts/scan-search-visibility.mjs` beside the skill
   (quote RECEIPT). A named URL needs a `source: url` line.
3. Judgment pass: people-first, spam, technical, extractability.
4. Findings table with a fix owner per row.
5. Last: emit this fence and nothing after it:

```text
optimizing-for-discovery: <blocker or major class + enough context to act>

Specimen: <path / URL>
Out of scope: …
Do not invent schema that is not on the page. Follow the named skill.
```

Do not commit/push/PR unless explicitly asked.

Focus / paths: $ARGUMENTS
