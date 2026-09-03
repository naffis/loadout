import { join } from "node:path";

const fromEnv = process.env.CURSOR_GATE_STATE_DIR;

export const GATE_STATE_DIR =
  typeof fromEnv === "string" && fromEnv.length > 0 ? fromEnv : ".cursor/hooks/state";

/** @param {string} conversationId */
export function gateStatePath(conversationId) {
  const id = conversationId.replace(/[^A-Za-z0-9._-]/g, "_");
  return join(GATE_STATE_DIR, `gate-${id}.json`);
}
