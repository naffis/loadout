import { readFileSync } from "node:fs";

/** @returns {Record<string, unknown>} */
export function readHookInput() {
  const raw = readFileSync(0, "utf8").trim();
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

/** @param {unknown} value */
export function asString(value) {
  return typeof value === "string" ? value : "";
}
