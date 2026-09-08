import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { test } from "node:test";

const here = dirname(fileURLToPath(import.meta.url));

test("audit-search is a diagnose command and has a next-prompt fence", () => {
  const path = join(here, "audit-search.md");
  assert.equal(existsSync(path), true);
  const body = readFileSync(path, "utf8");
  assert.match(body, /```text\n/);
});

test("optimize-discovery is implement-only and has no next-prompt fence", () => {
  const path = join(here, "optimize-discovery.md");
  assert.equal(existsSync(path), true);
  const body = readFileSync(path, "utf8");
  assert.doesNotMatch(body, /```text\n/);
});
