#!/usr/bin/env node
/**
 * postToolUse (Write|StrReplace) — remember a source edit for THIS
 * conversation and generation only. Workspace afterFileEdit is not a
 * writer signal on a shared tree.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { extname } from "node:path";
import { GATE_STATE_DIR, gateStatePath } from "./lib/gate-state.mjs";
import { asString, readHookInput } from "./lib/read-hook-input.mjs";

const GATE_EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".mts", ".cts"]);
const WRITE_TOOLS = new Set(["Write", "StrReplace"]);

const input = readHookInput();
const toolName = asString(input.tool_name);
const toolInput =
  input.tool_input && typeof input.tool_input === "object"
    ? /** @type {Record<string, unknown>} */ (input.tool_input)
    : {};
const filePath = asString(toolInput.path) || asString(toolInput.file_path);
const conversationId = asString(input.conversation_id);
const generationId = asString(input.generation_id);

if (
  WRITE_TOOLS.has(toolName) &&
  conversationId &&
  filePath &&
  GATE_EXTS.has(extname(filePath))
) {
  mkdirSync(GATE_STATE_DIR, { recursive: true });
  writeFileSync(
    gateStatePath(conversationId),
    `${JSON.stringify({
      file_path: filePath,
      conversation_id: conversationId,
      generation_id: generationId,
      marked_at: new Date().toISOString(),
    })}\n`,
  );
}

process.stdout.write("{}\n");
