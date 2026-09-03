#!/usr/bin/env node
/**
 * stop — at most one follow-up when THIS conversation wrote source
 * in THIS generation. Shared-tree afterFileEdit must not mark.
 */
import { existsSync, readFileSync, unlinkSync } from "node:fs";
import { gateStatePath } from "./lib/gate-state.mjs";
import { asString, readHookInput } from "./lib/read-hook-input.mjs";

const MAX_LOOPS = 1;

const input = readHookInput();
const status = asString(input.status);
const conversationId = asString(input.conversation_id);
const generationId = asString(input.generation_id);
const loopCount = typeof input.loop_count === "number" ? input.loop_count : 0;
const statePath = conversationId ? gateStatePath(conversationId) : "";

function clearFlag() {
  if (!statePath) return;
  try {
    unlinkSync(statePath);
  } catch {
    // missing is fine
  }
}

if (
  status !== "completed" ||
  !conversationId ||
  !existsSync(statePath) ||
  loopCount >= MAX_LOOPS
) {
  if (loopCount >= MAX_LOOPS) clearFlag();
  process.stdout.write("{}\n");
  process.exit(0);
}

let markedFile = "";
try {
  const parsed = JSON.parse(readFileSync(statePath, "utf8"));
  if (asString(parsed.conversation_id) !== conversationId) {
    clearFlag();
    process.stdout.write("{}\n");
    process.exit(0);
  }
  const markedGeneration = asString(parsed.generation_id);
  if (markedGeneration && generationId && markedGeneration !== generationId) {
    clearFlag();
    process.stdout.write("{}\n");
    process.exit(0);
  }
  markedFile = asString(parsed.file_path);
} catch {
  clearFlag();
  process.stdout.write("{}\n");
  process.exit(0);
}

clearFlag();

const followup = markedFile
  ? `Source changed (${markedFile}). If this session changed behavior, run the package typecheck and the tightest affected test, then paste the output. One reminder only — do not keep looping.`
  : "Source changed this session. If behavior changed, run typecheck and the tightest affected test, then paste the output. One reminder only.";

process.stdout.write(`${JSON.stringify({ followup_message: followup })}\n`);
