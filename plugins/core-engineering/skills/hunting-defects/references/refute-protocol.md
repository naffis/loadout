# Refute-or-promote

Every candidate is **unverified** until this protocol runs. Hunters propose;
the parent kills or promotes.

## Kill checks (any one sufficient)

| Check                  | Kill when                                                    |
| ---------------------- | ------------------------------------------------------------ |
| All-path release       | Cleanup runs on success, throw, early return, unmount, abort |
| Downstream guard       | A later invariant makes the bad state impossible (cite it)   |
| Test proves impossible | A test fails if the bug existed — and it covers this path    |
| Intended fail-open     | Owning doc names this exact fail-open                        |
| Out of scope           | Generated, test fixture, unrelated debt                      |
| False grep             | Identifier collision; not the acquire/release pair           |

Write the kill in one line with a path. Preference is not a kill.

If you **cannot name the missing path in one sentence**, the candidate is
**speculative**. Do not promote it.

Read the **enclosing function** (signature through closing brace). A ±3 line
grep window is not a refute.

## Promote checks (all required)

1. **Location** — `file:line` of the acquire or the missing branch.
2. **Missing path** — name the path that skips the release / check / fail-closed
   (error, empty, cancel, replay, unmount, concurrent writer).
3. **Impact** — what a user, wallet, or invariant actually loses.
4. **Class** — which hunt class; sibling search query for step 6.

## Confidence

| Label           | Meaning                                         | Max severity         |
| --------------- | ----------------------------------------------- | -------------------- |
| **proven**      | Missing path read in source; no kill check held | Critical / High      |
| **likely**      | Strong shape, one unread callee or flag         | High / Medium        |
| **speculative** | Grep-shaped; not traced                         | Low — never Critical |

Do not promote confidence in the same context that found the candidate.
Critical/High lists go to `reviewer` or `/review`.

## Wave rule

A later wave may kill an earlier promote if new evidence appears. Update the
table; do not hide the reversal.
