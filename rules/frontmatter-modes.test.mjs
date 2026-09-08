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
    "auditing-search-visibility",
    "search-visibility",
  ]) {
    assert.equal(starter.includes(id), false, `${id} must not be in starter`);
  }
});

test("search-visibility rules are agent-requested or glob, never always-on", () => {
  for (const rel of [
    "rules/people-first-content.mdc",
    "rules/no-search-spam.mdc",
    "rules/search-technical.mdc",
  ]) {
    const { data } = parseMdc(rel);
    assert.equal(data.alwaysApply, false, rel);
    assert.ok(data.description && String(data.description).length > 0, rel);
  }
  const tech = parseMdc("rules/search-technical.mdc");
  assert.ok(Array.isArray(tech.data.globs));
  assert.ok(tech.data.globs.includes("**/*.tsx"));
  assert.ok(tech.data.globs.includes("**/robots.ts"));
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

test("AC-05 copy-voice stays glob-attached", () => {
  const { data } = parseMdc("rules/copy-voice.mdc");
  assert.equal(data.alwaysApply, false);
  assert.deepEqual(data.globs, ["**/*.md", "**/*.mdx"]);
});

test("AC-17 copy-voice body is under 80 lines", () => {
  const raw = readFileSync(join(root, "rules/copy-voice.mdc"), "utf8");
  const body = raw.replace(/^---[\s\S]*?---\s*/, "");
  const lines = body.split("\n");
  assert.ok(lines.length < 80, `copy-voice body is ${lines.length} lines`);
});

test("AC-06 getting-started routes cleaning-ai-copy", () => {
  const body = readFileSync(
    join(root, "plugins/core-engineering/skills/getting-started/SKILL.md"),
    "utf8",
  );
  assert.match(body, /cleaning-ai-copy/);
  assert.match(body, /\/deslop-copy/);
});

test("getting-started routes search-visibility and requires install", () => {
  const body = readFileSync(
    join(root, "plugins/core-engineering/skills/getting-started/SKILL.md"),
    "utf8",
  );
  assert.match(body, /search-visibility/);
  assert.match(body, /loadout add search-visibility/);
  assert.match(body, /live HTML RECEIPT/);
});

test("AC-07 deslopping hands prose to cleaning-ai-copy", () => {
  const body = readFileSync(
    join(root, "plugins/core-engineering/skills/deslopping/SKILL.md"),
    "utf8",
  );
  assert.match(body, /cleaning-ai-copy/);
  assert.match(body, /ChatGPT voice/);
});

test("AC-15 brief omits measured-token literals", () => {
  const brief = readFileSync(
    join(
      root,
      "plugins/core-engineering/skills/_shared/plain-english-brief.md",
    ),
    "utf8",
  );
  assert.doesNotMatch(brief, /delve/);
  assert.doesNotMatch(brief, /tapestry/);
  assert.doesNotMatch(brief, /oaicite/);
});

test("AC-18 marketplace and plugin versions are 0.22.0", () => {
  const mp = JSON.parse(
    readFileSync(join(root, ".claude-plugin/marketplace.json"), "utf8"),
  );
  const plugin = JSON.parse(
    readFileSync(
      join(root, "plugins/core-engineering/.claude-plugin/plugin.json"),
      "utf8",
    ),
  );
  const searchVis = JSON.parse(
    readFileSync(
      join(root, "plugins/search-visibility/.claude-plugin/plugin.json"),
      "utf8",
    ),
  );
  assert.equal(mp.version, "0.22.0");
  const core = mp.plugins.find((p) => p.name === "core-engineering");
  assert.equal(core.version, "0.22.0");
  assert.equal(plugin.version, "0.22.0");
  const searchEntry = mp.plugins.find((p) => p.name === "search-visibility");
  assert.equal(searchEntry.version, "0.1.0");
  assert.equal(searchVis.version, "0.1.0");
});

test("AC-19 kits.starter excludes cleaning-ai-copy", () => {
  const registry = JSON.parse(
    readFileSync(join(root, "registry.json"), "utf8"),
  );
  assert.equal(registry.kits.starter.includes("cleaning-ai-copy"), false);
  assert.equal(registry.kits.starter.includes("deslop-copy-cmd"), false);
  assert.equal(registry.kits.starter.includes("auditing-search-visibility"), false);
  assert.equal(registry.kits.starter.includes("search-visibility"), false);
});

test("AC-20 cleaning-ai-copy description names deslop copy and deslopping", () => {
  const body = readFileSync(
    join(
      root,
      "plugins/core-engineering/skills/cleaning-ai-copy/SKILL.md",
    ),
    "utf8",
  );
  const desc = String(matter(body).data.description);
  assert.match(desc, /deslop copy/);
  assert.match(desc, /Anti-triggers/i);
  assert.match(desc, /deslopping/);
});
