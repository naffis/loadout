import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { mergeMcp, planTargets, projectRuleIntoClaudeMd } from "./project.js";
import { findSourceRoot } from "./source.js";
import type { RegistryAsset } from "./types.js";

function tmp(): string {
  return mkdtempSync(join(tmpdir(), "loadout-test-"));
}

test("mergeMcp adds new servers and leaves collisions untouched", () => {
  const dir = tmp();
  try {
    const target = join(dir, "mcp.json");
    writeFileSync(target, JSON.stringify({ mcpServers: { existing: { command: "keep" } } }));
    const res = mergeMcp(
      target,
      JSON.stringify({ mcpServers: { existing: { command: "OVERWRITE" }, fresh: { command: "x" } } }),
    );
    assert.deepEqual(res.added, ["fresh"]);
    assert.deepEqual(res.collisions, ["existing"]);
    const out = JSON.parse(readFileSync(target, "utf8"));
    assert.equal(out.mcpServers.existing.command, "keep", "existing server not overwritten");
    assert.ok(out.mcpServers.fresh, "new server added");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("projectRuleIntoClaudeMd inserts once and is idempotent", () => {
  const dir = tmp();
  try {
    const claude = join(dir, "CLAUDE.md");
    writeFileSync(claude, "# Project\n\nuser content\n");
    projectRuleIntoClaudeMd(claude, "no-any", "---\nx: 1\n---\n# No any\nbody-v1\n");
    let out = readFileSync(claude, "utf8");
    assert.ok(out.includes("user content"), "user content preserved");
    assert.ok(out.includes("rule:no-any"), "rule marker inserted");
    assert.ok(out.includes("body-v1"), "rule body inserted (frontmatter stripped)");
    assert.ok(!out.includes("x: 1"), "frontmatter not projected");

    // Re-projecting the same rule with new body replaces, doesn't duplicate.
    projectRuleIntoClaudeMd(claude, "no-any", "# No any\nbody-v2\n");
    out = readFileSync(claude, "utf8");
    assert.equal(out.match(/rule:no-any/g)?.length, 1, "rule not duplicated on re-project");
    assert.ok(out.includes("body-v2") && !out.includes("body-v1"), "rule body refreshed");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("planTargets maps a cursor-rule to a .cursor copy plus a CLAUDE.md projection", () => {
  const asset: RegistryAsset = {
    id: "no-any",
    type: "cursor-rule",
    source: "rules/no-any.mdc",
    version: "0.1.0",
    managed: true,
    tools: ["cursor", "claude"],
  };
  const actions = planTargets(asset, { cursor: true, claude: true }, "/proj");
  const kinds = actions.map((a) => a.kind);
  assert.ok(kinds.includes("copyFile"), "rule gets a tracked file copy");
  assert.ok(kinds.includes("projectRule"), "rule projected into CLAUDE.md for Claude Code");
});

function copyTargets(actions: ReturnType<typeof planTargets>): string[] {
  return actions.filter((a) => a.kind === "copyFile").map((a) => (a as { target: string }).target);
}

test("planTargets vendors a command into each tool's commands dir", () => {
  const asset: RegistryAsset = {
    id: "start",
    type: "command",
    source: "plugins/core-engineering/commands/start.md",
    version: "0.1.0",
    managed: false,
    tools: ["cursor", "claude"],
  };
  assert.deepEqual(
    copyTargets(planTargets(asset, { cursor: true, claude: false }, "/proj")),
    [join(".cursor", "commands", "start.md")],
    "cursor-only project gets .cursor/commands/start.md (fixes /start)",
  );
  assert.deepEqual(
    copyTargets(planTargets(asset, { cursor: true, claude: true }, "/proj")),
    [join(".cursor", "commands", "start.md"), join(".claude", "commands", "start.md")],
  );
});

test("planTargets vendors an agent into each tool's agents dir", () => {
  const asset: RegistryAsset = {
    id: "reviewer",
    type: "agent",
    source: "plugins/core-engineering/agents/reviewer.md",
    version: "0.1.0",
    managed: false,
    tools: ["cursor", "claude"],
  };
  assert.deepEqual(copyTargets(planTargets(asset, { cursor: true, claude: false }, "/proj")), [
    join(".cursor", "agents", "reviewer.md"),
  ]);
  assert.deepEqual(copyTargets(planTargets(asset, { cursor: false, claude: true }, "/proj")), [
    join(".claude", "agents", "reviewer.md"),
  ]);
});

test("findSourceRoot resolves to a dir containing registry.json (fixes npx list/doctor)", () => {
  const root = findSourceRoot();
  assert.ok(existsSync(join(root, "registry.json")), "source root holds the registry");
});
