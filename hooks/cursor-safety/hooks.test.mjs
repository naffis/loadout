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

function commandsMention(hooks, event, needle) {
  return (hooks.hooks?.[event] ?? []).some((row) => String(row.command).includes(needle));
}

test("hooks.json and fragment never wire a stop followup", () => {
  const fragment = JSON.parse(readFileSync(join(here, "hooks.fragment.json"), "utf8"));
  const livePath = join(here, "../hooks.json");
  const docs = [fragment];
  if (existsSync(livePath)) {
    docs.push(JSON.parse(readFileSync(livePath, "utf8")));
  }
  for (const hooks of docs) {
    assert.equal(commandsMention(hooks, "stop", "remind-gate"), false);
    assert.equal(commandsMention(hooks, "postToolUse", "mark-gate-needed"), false);
    assert.equal(commandsMention(hooks, "afterFileEdit", "mark-gate-needed"), false);
    assert.equal(commandsMention(hooks, "afterTabFileEdit", "mark-gate-needed"), false);
  }
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

test("remind-gate never emits followup_message even with a matching mark", () => {
  const stateDir = isolatedState();
  const statePath = join(stateDir, "gate-writer.json");
  writeFileSync(
    statePath,
    JSON.stringify({
      file_path: "/repo/packages/foo/src/bar.ts",
      conversation_id: "writer",
      generation_id: "gen-1",
    }),
  );
  const out = runHook(
    "remind-gate.mjs",
    {
      status: "completed",
      loop_count: 0,
      conversation_id: "writer",
      generation_id: "gen-1",
    },
    gateEnv(stateDir),
  );
  assert.equal(out.followup_message, undefined);
  assert.equal(existsSync(statePath), false);
  rmSync(stateDir, { recursive: true, force: true });
});
