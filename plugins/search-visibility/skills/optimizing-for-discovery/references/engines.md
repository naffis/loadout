# Engines

Google is the default. Apply extras only when the user named the engine.

## Google (Search, AI Overviews, AI Mode)

- Same ranking and quality systems as classic Search (T1 AI-optimization
  guide, 2026-07-10). RAG over the index; query fan-out underneath.
- Eligibility: indexed, snippet-eligible, technical requirements met.
  Search Console inclusion for generative AI features when that control
  exists for the property.
- Measure: Search Console (including Generative AI performance when
  shown). There is a dedicated generative report as of the 2026 guide.
- Ignore: `llms.txt` as a Google lever, chunking, AI-only rewrites,
  inauthentic mentions, "must have schema for Overviews."

## Bing / Copilot

- Index is Bing. `Bingbot`, IndexNow optional for freshness.
- Classic Bing Webmaster Guidelines still apply.

## ChatGPT Search

- Live fetches use search/cite tokens (`OAI-SearchBot`, `ChatGPT-User`).
  `GPTBot` is training. See `../../_shared/crawlers.md`.
- Content in the first HTML. Opaque JS pricing pages get skipped.
- Optional `llms.txt` as a map, not a switch.

## Perplexity

- `PerplexityBot` for the index. Always-on citations in the product UI.
- Recent, sourced, extractable pages are easier to quote. Still no
  promise.

## Claude (when browsing / search is on)

- Confirm current Anthropic crawler tokens before a robots edit.
- Same people-first page as everyone else.

## Measurement without a vendor tool

For a named prompt set: run each query 3+ times per engine, record
cited / not cited, report a rate (`3/5`), not a single anecdote.
Do not treat one ChatGPT answer as proof.
