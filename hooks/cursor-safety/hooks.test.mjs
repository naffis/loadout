import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { test } from "node:test";

const here = dirname(fileURLToPath(import.meta.url));

/** @param {string} script @param {unknown} payload @param {Record<string, string>} [extraEnv] */
function runHook(script, payload, extraEnv = {}) {
  const result = spawnSync(process.execPath, [join(here, script)], {
    input: JSON.stringify(payload),
    encoding: "utf8",
    cwd: here,
    env: { ...process.env, ...extraEnv },
  });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout.trim() || "{}");
}

function isolatedState() {
  return mkdtempSync(join(tmpdir(), "loadout-gate-"));
}

/** @param {string} stateDir */
function gateEnv(stateDir) {
  return { CURSOR_GATE_STATE_DIR: stateDir };
}

test("deny-destructive-git blocks stash and reset --hard", () => {
  const stash = runHook("deny-destructive-git.mjs", { command: "git stash push -u" });
  assert.equal(stash.permission, "deny");
  const hard = runHook("deny-destructive-git.mjs", { command: "git reset --hard HEAD" });
  assert.equal(hard.permission, "deny");
  const clean = runHook("deny-destructive-git.mjs", { command: "git clean -fd" });
  assert.equal(clean.permission, "deny");
  const envDump = runHook("deny-destructive-git.mjs", { command: "cat .env.development" });
  assert.equal(envDump.permission, "deny");
});

test("deny-destructive-git allows read-only git", () => {
  const status = runHook("deny-destructive-git.mjs", { command: "git status --short" });
  assert.equal(status.permission, "allow");
  const diff = runHook("deny-destructive-git.mjs", { command: "git diff --stat" });
  assert.equal(diff.permission, "allow");
  const oneFile = runHook("deny-destructive-git.mjs", {
    command: "git restore src/foo.ts",
  });
  assert.equal(oneFile.permission, "allow");
});

test("deny-destructive-git blocks whole-tree restore and flagged stash", () => {
  const restoreDot = runHook("deny-destructive-git.mjs", { command: "git restore ." });
  assert.equal(restoreDot.permission, "deny");
  const checkoutDot = runHook("deny-destructive-git.mjs", { command: "git checkout ." });
  assert.equal(checkoutDot.permission, "deny");
  const checkoutHead = runHook("deny-destructive-git.mjs", {
    command: "git checkout HEAD -- .",
  });
  assert.equal(checkoutHead.permission, "deny");
  const checkoutForce = runHook("deny-destructive-git.mjs", {
    command: "git checkout --force .",
  });
  assert.equal(checkoutForce.permission, "deny");
  const flagged = runHook("deny-destructive-git.mjs", {
    command: "git -C /repo stash push -u",
  });
  assert.equal(flagged.permission, "deny");
});

test("hooks.fragment.json marks only this conversation's Write/StrReplace", () => {
  const hooks = JSON.parse(readFileSync(join(here, "hooks.fragment.json"), "utf8"));
  const post = hooks.hooks?.postToolUse ?? [];
  assert.ok(
    post.some(
      (row) =>
        String(row.command).includes("mark-gate-needed") &&
        String(row.matcher).includes("Write"),
    ),
    "postToolUse Write/StrReplace must flag the stop reminder",
  );
  const afterEdit = hooks.hooks?.afterFileEdit ?? [];
  assert.ok(
    !afterEdit.some((row) => String(row.command).includes("mark-gate-needed")),
    "workspace afterFileEdit must not flag the gate",
  );
  const tab = hooks.hooks?.afterTabFileEdit ?? [];
  assert.ok(
    !tab.some((row) => String(row.command).includes("mark-gate-needed")),
    "TabWrite must not flag the gate",
  );
});

test("redact-env-read blocks live env files and allows examples", () => {
  const live = runHook("redact-env-read.mjs", {
    file_path: "/Users/me/proj/.env.development",
  });
  assert.equal(live.permission, "deny");
  const example = runHook("redact-env-read.mjs", {
    file_path: "/Users/me/proj/.env.example",
  });
  assert.equal(example.permission, "allow");
  const source = runHook("redact-env-read.mjs", {
    file_path: "/Users/me/proj/packages/worker/src/index.ts",
  });
  assert.equal(source.permission, "allow");
});

test("remind-gate follows up once then stays quiet", () => {
  const stateDir = isolatedState();
  const statePath = join(stateDir, "gate-conv-a.json");
  writeFileSync(
    statePath,
    JSON.stringify({ file_path: "packages/foo/src/bar.ts", conversation_id: "conv-a" }),
  );

  const first = runHook(
    "remind-gate.mjs",
    {
      status: "completed",
      loop_count: 0,
      conversation_id: "conv-a",
    },
    gateEnv(stateDir),
  );
  assert.match(first.followup_message ?? "", /Source changed/);
  assert.equal(existsSync(statePath), false);

  writeFileSync(
    statePath,
    JSON.stringify({ file_path: "packages/foo/src/bar.ts", conversation_id: "conv-a" }),
  );
  const second = runHook(
    "remind-gate.mjs",
    {
      status: "completed",
      loop_count: 1,
      conversation_id: "conv-a",
    },
    gateEnv(stateDir),
  );
  assert.equal(second.followup_message, undefined);
  rmSync(stateDir, { recursive: true, force: true });
});

test("remind-gate does not fire a leftover unscoped flag into another chat", () => {
  const stateDir = isolatedState();
  writeFileSync(
    join(stateDir, "gate-needed.json"),
    JSON.stringify({
      file_path: "packages/foo/src/sibling.test.ts",
    }),
  );
  const cross = runHook(
    "remind-gate.mjs",
    {
      status: "completed",
      loop_count: 0,
      conversation_id: "agent-this",
    },
    gateEnv(stateDir),
  );
  assert.equal(cross.followup_message, undefined);
  rmSync(stateDir, { recursive: true, force: true });
});

test("remind-gate ignores a sibling conversation's edit", () => {
  const stateDir = isolatedState();
  const env = gateEnv(stateDir);
  runHook(
    "mark-gate-needed.mjs",
    {
      tool_name: "Write",
      tool_input: { path: "/repo/packages/foo/src/bar.ts" },
      conversation_id: "agent-other",
      generation_id: "gen-other",
    },
    env,
  );
  const cross = runHook(
    "remind-gate.mjs",
    {
      status: "completed",
      loop_count: 0,
      conversation_id: "agent-this",
      generation_id: "gen-this",
    },
    env,
  );
  assert.equal(cross.followup_message, undefined);

  const own = runHook(
    "remind-gate.mjs",
    {
      status: "completed",
      loop_count: 0,
      conversation_id: "agent-other",
      generation_id: "gen-other",
    },
    env,
  );
  assert.match(own.followup_message ?? "", /bar\.ts/);
  rmSync(stateDir, { recursive: true, force: true });
});

test("mark-gate-needed ignores afterFileEdit-shaped sibling writes", () => {
  const stateDir = isolatedState();
  const env = gateEnv(stateDir);
  runHook(
    "mark-gate-needed.mjs",
    {
      file_path: "/repo/packages/foo/src/sibling.contract.test.ts",
      conversation_id: "diagnose-chat",
    },
    env,
  );
  const quiet = runHook(
    "remind-gate.mjs",
    {
      status: "completed",
      loop_count: 0,
      conversation_id: "diagnose-chat",
      generation_id: "gen-next-steps",
    },
    env,
  );
  assert.equal(quiet.followup_message, undefined);
  rmSync(stateDir, { recursive: true, force: true });
});

test("mark-gate-needed records this conversation's Write via tool_input.path", () => {
  const stateDir = isolatedState();
  const env = gateEnv(stateDir);
  runHook(
    "mark-gate-needed.mjs",
    {
      tool_name: "Write",
      tool_input: { path: "/repo/packages/foo/src/bar.ts" },
      conversation_id: "writer-chat",
      generation_id: "gen-1",
    },
    env,
  );
  const own = runHook(
    "remind-gate.mjs",
    {
      status: "completed",
      loop_count: 0,
      conversation_id: "writer-chat",
      generation_id: "gen-1",
    },
    env,
  );
  assert.match(own.followup_message ?? "", /bar\.ts/);
  rmSync(stateDir, { recursive: true, force: true });
});

test("remind-gate stays quiet when the mark is from a prior generation", () => {
  const stateDir = isolatedState();
  const env = gateEnv(stateDir);
  runHook(
    "mark-gate-needed.mjs",
    {
      tool_name: "StrReplace",
      tool_input: { path: "/repo/packages/foo/src/bar.ts" },
      conversation_id: "same-chat",
      generation_id: "gen-edit",
    },
    env,
  );
  const later = runHook(
    "remind-gate.mjs",
    {
      status: "completed",
      loop_count: 0,
      conversation_id: "same-chat",
      generation_id: "gen-next-steps",
    },
    env,
  );
  assert.equal(later.followup_message, undefined);
  rmSync(stateDir, { recursive: true, force: true });
});
