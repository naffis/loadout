# Evidence tiers

Use this before applying a "GEO tactic." The class of wrongness in public
skills is treating a vendor blog as equivalent to Google Search Central.

## Tiers

| Tier | What counts | How to treat it |
| --- | --- | --- |
| **T1 official** | Google Search Central, Bing Webmaster Guidelines, Schema.org | Default. Do this unless the user named another engine. |
| **T2 research** | Peer-reviewed or arXiv with a method (Princeton GEO 2023; C-SEO Bench 2025) | Cite the paper. Do not convert a lab lift into a promised ranking. |
| **T3 practice** | Crawler user-agent lists, llmstxt.org, citation-pattern writeups | Useful for non-Google engines. Label as convention, not a Google requirement. |
| **T4 vendor** | Agency checklists, tool landing pages, "40% visibility" blogs | Never house doctrine. May inform a question, not a required step. |

When tiers conflict, T1 wins for Google surfaces. T2 that *falsifies* a T4
claim wins over the claim. C-SEO Bench (NeurIPS 2025) found most
conversational-SEO methods ineffective or harmful to ranking. That kills
"apply this GEO hack and expect a citation."

## House doctrine (what we actually do)

1. **People-first content is the ranking and citation foundation.** Unique
   point of view, first-hand experience, complete answers. Commodity
   roundups and scaled AI pages violate Google's helpful-content and spam
   policies and do not become "AIO optimized" by adding FAQ schema.
2. **Technical SEO still applies to generative Google features.** Indexed,
   crawlable, snippet-eligible pages are the input to AI Overviews and AI
   Mode (RAG over the Search index, plus query fan-out). JavaScript must
   follow Google's JS SEO basics. Duplicate URLs waste crawl.
3. **Structure for humans is structure for extraction.** One H1, question
   headings, a direct answer before the essay, tables for comparisons,
   visible dates and authors. Google says do not chunk pages into AI-bait
   fragments and do not write a second copy "for AI."
4. **Structured data is for rich results and entity clarity.** It is not
   required for Google generative features. It must match visible content
   exactly. Fake FAQ / Review / AggregateRating is spam.
5. **Do not require `llms.txt`, OKF, or other AI-only files for Google.**
   Google's 2026-07-10 AI-optimization guide says Search does not use them
   in a special way. Optional for agent navigation on other engines. Never
   a citation guarantee. `robots.txt` is the crawler-control file.
6. **Never promise a citation, snippet, or ranking.** Those are engine
   decisions. Ship the work; measure later.
7. **Inauthentic mentions are spam.** Do not bulk-post Reddit, fake
   reviews, or buy "AI mention" placements. Third-party presence that is
   real (docs, reviews, press, Wikipedia edits that meet their rules) is
   off-site work, not a code change.
8. **Measure with the right surface.** Google: Search Console, including
   the Generative AI performance report when the property has it. Other
   engines: repeated prompt checks (n≥3 per query; report a rate, not one
   run) or a dedicated visibility tool the user already has.

## Google myths to ignore (T1)

From [Optimizing your website for generative AI features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
(updated 2026-07-10):

- Special AI markup or `llms.txt` as a Google ranking/citation lever
- Chunking content into tiny AI pieces
- Rewriting the same page in "AI voice" or covering every fan-out query as
  its own thin URL (scaled content abuse)
- Seeking inauthentic mentions
- Treating structured data as required for AI Overviews

## What still helps non-Google engines (T3)

ChatGPT Search, Perplexity, Copilot, and Claude-with-search do not share
Google's index. For those, still do T1 quality and technical work, then:

- Allow the engine's *search/cite* crawler in `robots.txt` if the user
  wants to be cited there (see `crawlers.md`)
- Keep answers in the initial HTML, not client-only
- Optional `llms.txt` as a table of contents for agents
- Visible pricing, specs, and definitions (agents skip JS walls)

Do not block search/cite crawlers "to protect content" and then ask why
that engine never cites the site.

## Princeton GEO vs C-SEO Bench

- Aggarwal et al., *GEO: Generative Engine Optimization*, arXiv:2311.09735
  (KDD 2024). In their 2023 setup, adding citations, statistics, and
  quotations raised visibility vs an unoptimized baseline. Keyword stuffing
  hurt. Treat as: **write with sources, numbers, and named experts**
  because that is better content, not because a +40% is owed.
- Puerto et al., *C-SEO Bench*, NeurIPS 2025, arXiv:2506.11097. Most
  current conversational-SEO methods were ineffective and often *lowered*
  document ranking. Treat as: **do not ship a GEO method as the class
  fix** when the page is thin, uncrawlable, or commodity.

## Sources

Full links: `sources.md`.
