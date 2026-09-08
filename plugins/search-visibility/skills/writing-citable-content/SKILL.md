---
name: writing-citable-content
icon: pencil
color: purple
description: >
  Write or rewrite public prose so people and answer engines can quote it.
  Use when the user says "write a blog post", "GEO content", "AEO",
  "definition lead", "make this citable", "AI Overview copy", "FAQ for
  search", or "people-first page". Not a metadata/schema implement
  (optimizing-for-discovery). Not an audit (auditing-search-visibility).
  Not code slop (deslopping) or AI-voice cleanup alone (cleaning-ai-copy).
---

# Writing citable content

## Trigger

A public page needs new or rewritten words. The job is meaning and
structure, not tags.

## Workflow

1. **Audience and why.** Who arrives, what they need to leave knowing.
   If the only why is "rank / get cited," stop and say so
   (`people-first-content`).
2. **One page, one topic.** Pick the question this URL owns. Related
   fan-out questions belong as sections, not thin extra URLs
   (`no-search-spam`).
3. **Outline.** H1 = the topic. H2/H3 = questions or tasks. First
   paragraph is a self-contained answer (definition or direct how/what).
   Then context, proof, examples. See `references/content-patterns.md`.
4. **Proof.** Named sources, dated statistics, first-hand detail. Use
   Princeton GEO as a *quality* reminder (cite, quantify, quote people
   who exist). Do not claim a +40% citation lift.
5. **Voice.** Plain, specific, no hype. After the draft, run
   `cleaning-ai-copy` on the prose files and quote both RECEIPTs.
6. **Hand off tags.** Titles, canonical, JSON-LD, robots →
   `optimizing-for-discovery`. Do not invent schema in this skill unless
   the user asked for the full page in one pass.

## Suggested Checks

- Opening answer stands alone if quoted.
- No second "AI version" of the same article.
- Who / how / why is on the page.
- `cleaning-ai-copy` RECEIPTs quoted when prose was edited.

## Guardrails

- Do not write scaled variants for every keyword or fan-out query.
- Do not keyword-stuff prompt language into headings.
- Do not promise the page will be cited.
- YMYL: refuse anonymous medical, legal, or financial advice.

## Pairs with

- rules: `people-first-content`, `no-search-spam`, `copy-voice`
- skills: `optimizing-for-discovery`, `auditing-search-visibility`,
  `cleaning-ai-copy`
- refs: `../_shared/evidence.md`, `references/content-patterns.md`
- workflow: `search-visibility`
