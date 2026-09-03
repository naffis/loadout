import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { test } from "node:test";
import matter from "gray-matter";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function parseMdc(rel) {
  return matter(readFileSync(join(root, rel), "utf8"));
}

test("AC-01 context-hygiene is agent-requested", () => {
  const { data } = parseMdc("rules/context-hygiene.mdc");
  assert.equal(data.alwaysApply, false);
  assert.ok(data.description && String(data.description).length > 0);
  assert.equal(data.globs, undefined);
});

test("AC-02 agents-md-hygiene is glob-attached on AGENTS.md and CLAUDE.md", () => {
  const { data } = parseMdc("rules/agents-md-hygiene.mdc");
  assert.equal(data.alwaysApply, false);
  assert.ok(Array.isArray(data.globs));
  assert.ok(data.globs.includes("**/AGENTS.md"));
  assert.ok(data.globs.includes("**/CLAUDE.md"));
});

test("AC-03 no-inline-imports is glob-attached with six extensions", () => {
  const { data } = parseMdc("rules/no-inline-imports.mdc");
  assert.equal(data.alwaysApply, false);
  assert.deepEqual(data.globs, [
    "**/*.ts",
    "**/*.tsx",
    "**/*.js",
    "**/*.jsx",
    "**/*.mjs",
    "**/*.cjs",
  ]);
});

test("AC-04 kits.starter excludes shared-trunk ids and no-inline-imports", () => {
  const registry = JSON.parse(
    readFileSync(join(root, "registry.json"), "utf8"),
  );
  const starter = registry.kits.starter;
  for (const id of [
    "git-safety",
    "no-stash",
    "shared-working-tree",
    "no-inline-imports",
  ]) {
    assert.equal(starter.includes(id), false, `${id} must not be in starter`);
  }
});

test("AC-11 verifying-a-claim names three verdicts and anti-triggers", () => {
  const body = readFileSync(
    join(
      root,
      "plugins/core-engineering/skills/verifying-a-claim/SKILL.md",
    ),
    "utf8",
  );
  assert.match(body, /VERIFIED/);
  assert.match(body, /NOT VERIFIED/);
  assert.match(body, /INCONCLUSIVE/);
  assert.match(body, /verifying-session-surfaces/);
  assert.match(body, /\/review/);
  const fm = matter(body).data;
  const desc = String(fm.description);
  assert.match(desc, /verify this claim/i);
  assert.match(desc, /Anti-triggers/i);
});
