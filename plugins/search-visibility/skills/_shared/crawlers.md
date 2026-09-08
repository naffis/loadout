# Crawlers and robots.txt

`robots.txt` is the crawler-control file. `llms.txt` is not.

User-agent tokens change. Confirm on the vendor's current docs before
editing production robots.

## Search / cite crawlers (allow if the user wants that engine)

| Token | Engine | Notes |
| --- | --- | --- |
| `Googlebot` | Google Search, including generative features that read the index | Required for Google. Do not Disallow sitewide. |
| `Google-Extended` | Gemini / some Google generative training | Separate from Googlebot. Blocking it does **not** remove you from Search or AI Overviews that use the Search index. Confirm current Google docs. |
| `Bingbot` | Bing, Copilot | Copilot retrieval is Bing-rooted. |
| `GPTBot` | OpenAI training | Training, not the live ChatGPT-User fetch. |
| `ChatGPT-User` | ChatGPT browsing / cite fetches | Allow if the user wants ChatGPT to fetch the live page. |
| `OAI-SearchBot` | OpenAI search | Allow for ChatGPT Search citation. |
| `PerplexityBot` | Perplexity index | Allow for Perplexity citation. |
| `ClaudeBot` / `anthropic-ai` | Anthropic | Training vs fetch tokens differ; check current docs. |

## Training-only (user decision)

| Token | Notes |
| --- | --- |
| `CCBot` | Common Crawl. Blocking is a product choice, not an SEO win. |
| `Google-Extended` | See above. Not a Search kill switch. |

## Rules of the edit

- A `User-agent: *` + `Disallow: /` blocks everyone, including Googlebot.
  Fix that before any GEO conversation.
- Prefer explicit `Allow: /` for a named search/cite bot **above** a tight
  wildcard deny if you must keep a deny.
- Do not add `noindex` or bot Disallows unless the user asked to hide the
  URL from that engine.
- `llms.txt` at `https://example.com/llms.txt` (`text/plain`) is optional
  agent navigation. It does not override robots.

## What the scanner flags

`scan-search-visibility.mjs` treats a Disallow that matches a **search/cite**
token (Googlebot, Bingbot, ChatGPT-User, OAI-SearchBot, PerplexityBot) as a
blocker when the path under audit would be covered. Training-only denies
are notes, not blockers. A clean RECEIPT is valid only for first-response
HTML, markdown, or robots. Framework sources without HTML, missing paths,
and empty client shells (`id="__next"` with almost no text) are blockers.
Named `http(s)` URLs are fetched as raw HTML (no headless render).
