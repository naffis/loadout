#!/usr/bin/env node
/**
 * stop — never emit followup_message. Cursor submits that field as a user
 * turn. A notification is not a loop.
 */
import { existsSync, unlinkSync } from "node:fs";
import { gateStatePath } from "./lib/gate-state.mjs";
import { asString, readHookInput } from "./lib/read-hook-input.mjs";

const input = readHookInput();
const conversationId = asString(input.conversation_id);
const statePath = conversationId ? gateStatePath(conversationId) : "";
if (statePath && existsSync(statePath)) {
  try {
    unlinkSync(statePath);
  } catch {
    // missing is fine
  }
}

process.stdout.write("{}\n");
