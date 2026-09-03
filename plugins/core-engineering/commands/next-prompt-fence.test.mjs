import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { test } from "node:test";

const here = dirname(fileURLToPath(import.meta.url));

/** Diagnose / audit / review slash commands must contain a literal fence. */
const REQUIRED = [
  "next-steps",
  "recommending-next-steps",
  "deep-dive",
  "hunt-defects",
  "walk-failure-paths",
  "audit-lifecycle",
  "do-it-right",
  "deep-flight",
  "review-build",
  "review-plan",
  "complete-the-build",
  "post-flight",
  "session-handoff",
  "plan",
  "start",
];

test("diagnose/audit/review commands contain a literal next-prompt fence", () => {
  for (const name of REQUIRED) {
    const path = join(here, `${name}.md`);
    assert.equal(existsSync(path), true, `missing ${name}.md`);
    const body = readFileSync(path, "utf8");
    assert.match(
      body,
      /```text\n/,
      `${name}.md must include a literal \`\`\`text fence`,
    );
  }
});
