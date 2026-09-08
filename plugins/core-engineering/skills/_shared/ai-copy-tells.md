# AI copy tells

House catalog for `cleaning-ai-copy` and `copy-voice`. Identify by **cluster**,
not one marker. Word lists drift by model era. Scaffolds and leftover tokens
do not.

Fiction dialect (Elara, dust motes, voice barely above a whisper) is out of
scope.

Do not print a "% AI" score. Do not send text to a detector API.

Machine list: `cleaning-ai-copy/references/ai-copy-patterns.json`.

## RED

Near-proof leftovers (Wikipedia): `oaicite`, `contentReference`, `oai_citation`,
`turn0search`, `utm_source=chatgpt.com`, Gemini `[cite: N]`, DeepSeek
`【…†…】`, Perplexity `[web:1]`, `grok_card`.

Chat leftovers: "Would you like me to", "Regenerate response", "I hope this
helps", "You're absolutely right".

Measured style words (Kobak / Juzek): delve / delves / delving, tapestry,
intricate, showcasing, realm. Verb forms only for underscore: "underscore the",
"underscores the", "underscoring". Bare "underscore" is not a hit.

Scaffolds: not-X-but-Y; serves as / stands as / boasts; **taxonomy + invariant**.

### Taxonomy + invariant (house)

Bad: `Named credentials for agents. The model never sees the value.`

That is a box label plus a solemn guarantee. No person. Schema leak ("the
value").

Good: `Your agent can call Stripe. It never gets the key.`

Same promise. A person and a concrete noun.

## ORANGE

Juzek common stack, cluster only (≥2 in one paragraph): across, additionally,
comprehensive, crucial, enhancing, exhibited, insights, notably, particularly,
within.

Promo: testament, pivotal, nestled, evolving landscape.

Dangling `-ing` closers: highlighting, ensuring, reflecting, emphasizing,
fostering, aligning.

Solemn invariant alone: never sees / never stored / never leaves / never shared
/ the model never.

`the value` only when the same paragraph already has a never-* hit.

## YELLOW

U+2014 / U+2013 only. One mark is advisory, not proof. ASCII hyphen is not a
hit.

## Era note

GPT-4 favored delve / tapestry / testament. GPT-4o favored align with /
fostering / showcasing. Later models shift again. Update the JSON when a new
measured paper lands. Keep scaffolds and leftovers.

## Citations

- https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing
- https://arxiv.org/abs/2406.07016
- https://arxiv.org/abs/2412.11385
- https://eqbench.com
- https://www.seangoedecke.com/em-dashes/
