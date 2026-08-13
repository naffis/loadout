import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { missingFromInstalled, resolveDesiredIds, workflowUsesIds } from "./desired.js";
import type { Registry } from "./types.js";

function tmp(): string {
  return mkdtempSync(join(tmpdir(), "loadout-desired-"));
}

function writeWorkflow(root: string, name: string, uses: Record<string, string[]>): void {
  const dir = join(root, "processes", "workflows");
  mkdirSync(dir, { recursive: true });
  const lines = Object.entries(uses)
    .map(([k, ids]) => `  ${k}: [${ids.join(", ")}]`)
    .join("\n");
  writeFileSync(
    join(dir, `${name}.md`),
    `---\nname: ${name}\nuses:\n${lines}\n---\n\n# ${name}\n`,
  );
}

test("workflowUsesIds reads rules skills commands agents", () => {
  const root = tmp();
  try {
    writeWorkflow(root, "ship-a-feature", {
      rules: ["no-shortcuts"],
      skills: ["review-build", "post-flight"],
      commands: ["review-build-cmd"],
      agents: ["reviewer"],
    });
    assert.deepEqual(
      workflowUsesIds(root, "processes/workflows/ship-a-feature.md").sort(),
      ["no-shortcuts", "post-flight", "review-build", "review-build-cmd", "reviewer"].sort(),
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("resolveDesiredIds includes starter seeds and closes workflow uses", () => {
  const root = tmp();
  try {
    writeWorkflow(root, "ship-a-feature", {
      skills: ["review-build", "post-flight"],
      commands: ["post-flight-cmd"],
    });
    writeWorkflow(root, "plan-then-build", {
      skills: ["create-plan", "review-plan"],
      commands: ["plan"],
    });

    const registry: Registry = {
      version: "1.1.0",
      source: "github:naffis/loadout",
      kits: {
        starter: ["start", "ship-a-feature", "plan-then-build", "definition-of-done"],
      },
      assets: [
        { id: "start", type: "command", source: "x", version: "0.1.0", managed: false, tools: ["cursor"] },
        {
          id: "ship-a-feature",
          type: "workflow",
          source: "processes/workflows/ship-a-feature.md",
          version: "0.1.0",
          managed: true,
          tools: ["cursor"],
        },
        {
          id: "plan-then-build",
          type: "workflow",
          source: "processes/workflows/plan-then-build.md",
          version: "0.1.0",
          managed: true,
          tools: ["cursor"],
        },
        { id: "review-build", type: "skill", source: "x", version: "0.1.0", managed: true, tools: ["cursor"] },
        { id: "post-flight", type: "skill", source: "x", version: "0.1.0", managed: true, tools: ["cursor"] },
        { id: "post-flight-cmd", type: "command", source: "x", version: "0.1.0", managed: false, tools: ["cursor"] },
        { id: "create-plan", type: "skill", source: "x", version: "0.1.0", managed: true, tools: ["cursor"] },
        { id: "review-plan", type: "skill", source: "x", version: "0.1.0", managed: true, tools: ["cursor"] },
        { id: "plan", type: "command", source: "x", version: "0.1.0", managed: false, tools: ["cursor"] },
        {
          id: "definition-of-done",
          type: "cursor-rule",
          source: "x",
          version: "0.1.0",
          managed: true,
          tools: ["cursor"],
        },
      ],
    };

    // Partial install: only ship-a-feature. Desired must pull starter seeds + both
    // workflows' uses (including create-plan from plan-then-build starter seed).
    const desired = resolveDesiredIds(registry, root, ["ship-a-feature"]);
    assert.ok(desired.includes("ship-a-feature"));
    assert.ok(desired.includes("plan-then-build"), "starter seed plan-then-build");
    assert.ok(desired.includes("create-plan"), "uses of plan-then-build");
    assert.ok(desired.includes("review-build"), "uses of ship-a-feature");
    assert.ok(desired.includes("post-flight"));
    assert.ok(desired.includes("start"));
    assert.ok(desired.includes("definition-of-done"));

    const missing = missingFromInstalled(desired, ["ship-a-feature"]);
    assert.ok(missing.includes("create-plan"));
    assert.ok(missing.includes("plan-then-build"));
    assert.ok(!missing.includes("ship-a-feature"));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("resolveDesiredIds does not invent unknown uses refs", () => {
  const root = tmp();
  try {
    writeWorkflow(root, "ship-a-feature", {
      skills: ["review-build", "not-in-registry"],
    });
    const registry: Registry = {
      version: "1.1.0",
      source: "github:naffis/loadout",
      kits: { starter: ["ship-a-feature"] },
      assets: [
        {
          id: "ship-a-feature",
          type: "workflow",
          source: "processes/workflows/ship-a-feature.md",
          version: "0.1.0",
          managed: true,
          tools: ["cursor"],
        },
        { id: "review-build", type: "skill", source: "x", version: "0.1.0", managed: true, tools: ["cursor"] },
      ],
    };
    const desired = resolveDesiredIds(registry, root, ["ship-a-feature"]);
    assert.ok(desired.includes("review-build"));
    assert.ok(!desired.includes("not-in-registry"));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
