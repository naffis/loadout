# Plain-English brief

The person reading chat is not reading the skill. They want three things, then
stop.

Use this as the **user-facing reply** for diagnose, review, plan, hunt, and
wrap skills. Run the full procedure. Do not dump it.

## What to write (in this order)

**What's going on** — two or three short sentences. Everyday words. What is
true right now, in product terms a teammate can picture.

**What we need to do** — the work, or the recommended next move. One short
paragraph or a 2–4 item list. No task IDs.

**Decision** — only if they must choose. A or B in everyday words. Put your
recommendation first. Skip this heading when there is no choice.

Then the `_shared/next-prompt.md` fence if this skill requires one. Nothing
else.

If they ask for more, paste the notes.

## Keep out of the reply

- Ticket codes, flag names, AC numbers, invariant IDs
- Class / out of scope, self-review, causal chain, hypothesis tables
- File dumps, test logs, MCP receipts
- "Objection / Verdict" theater

Do that work. Keep it off the page until asked.

## Words

- Say "the form can submit twice" not `idempotencyKey=null`
- Say "later checks fail" not "unsatisfiable occupancy contract"
- Say "don't charge again" not "disarm the settle gate"
- A code name may appear once in parentheses if it helps
- No leftover cite tokens and no chatbot closers ("Would you like me to")
- No "It's not X, it's Y" and no "in today's fast-paced world"
- No category-label + koan headlines ("X for Y. Z never happens."). Start with
  a person or a concrete noun. Do not leak schema words into a guarantee.

## Bad vs good

Bad:

> Class / out of scope — siblings: every checkout retry with
> `idempotencyKey=null`. Self-review — AC-05 already `ship_best`s the 409 so
> "never reach settle" is stale. DECISION: when reserve skips `empty_cart` and
> `itemsRequired=true`, (A) disarm the gate (`CART: none`) or (B) invent line
> items.

Good:

> **What's going on**
> Checkout can run even when the cart is empty. Later checks then fail because
> they expect items, and the order gets stuck.
>
> **What we need to do**
> Stop those checkouts from getting stuck. Either drop the "needs items" rule
> when the cart was skipped, or refuse checkout until there are items.
>
> **Decision**
> A) Don't require items when the cart was skipped (recommended)
> B) Block checkout until there are items

## Tickets and handoffs

Same brief. Machine YAML handoffs stay in the comment template the skill
names. They are not the user-facing close.
