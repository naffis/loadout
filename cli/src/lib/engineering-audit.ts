import { lstatSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { readOptional } from "./engineering-files.js";

export interface Finding { path: string; line: number; message: string }
const ignored = new Set([".git", "node_modules", "dist", "build", ".next", ".venv", "vendor", "coverage", ".loadout"]);
const instructionName = /^(?:agents(?:\.override)?|agent|claude(?:\.local)?|gemini)\.md$/i;

/** Heuristic audit, deliberately not an instruction-precedence engine. */
export function auditInstructions(root: string): Finding[] {
  const findings: Finding[] = [];
  const walk = (directory: string): void => {
    for (const entry of readdirSync(join(root, directory), { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (!ignored.has(entry.name)) walk(directory ? `${directory}/${entry.name}` : entry.name);
        continue;
      }
      const path = directory ? `${directory}/${entry.name}` : entry.name;
      const isRule = /(?:^|\.)?(?:cursor|claude|grok)\/rules\/.*\.(?:md|mdc)$/.test(path);
      if (!instructionName.test(entry.name) && !isRule) continue;
      if (lstatSync(join(root, path)).isSymbolicLink()) {
        findings.push({ path, line: 1, message: "Instruction symlink: inspect its target and integrate manually." });
        continue;
      }
      const body = readOptional(root, path) ?? "";
      if (path === "AGENTS.override.md") findings.push({ path, line: 1, message: "This shadows root AGENTS.md in Codex; integrate with the active file deliberately." });
      if (!directory && /^agents\.md$/i.test(entry.name) && entry.name !== "AGENTS.md") findings.push({ path, line: 1, message: "Noncanonical filename: reconcile casing before adding AGENTS.md for portable discovery." });
      body.split(/\r?\n/).forEach((line, index) => {
        const wholeTree = /\bgit add -A\b|\b(?:stage|commit|land)\b.{0,45}\b(?:all|entire|whole)\b.{0,40}\b(?:files|tree)\b/i.test(line);
        const everyGate = /\b(?:full (?:CI|suite|test suite)|all tests)\b.{0,60}\b(?:every|each) (?:edit|change|commit)\b|\b(?:every|each) (?:edit|change|commit)\b.{0,60}\b(?:full (?:CI|suite|test suite)|all tests|PR|pull request)\b/i.test(line);
        const negated = /\b(?:do not|don't|never|avoid|no need to|not required)\b/i.test(line);
        if ((wholeTree || everyGate) && !negated) findings.push({ path, line: index + 1, message: wholeTree ? "Potential whole-tree staging requirement conflicts with ready-batch checkpoints." : "Potential per-change PR/full-suite requirement conflicts with batched validation." });
      });
    }
  };
  walk("");
  // Claude-only legacy installs keep their authoritative .mdc copies here.
  try {
    for (const entry of readdirSync(join(root, ".loadout/rules"))) {
      if (!entry.endsWith(".mdc")) continue;
      const path = `.loadout/rules/${entry}`;
      const body = readOptional(root, path) ?? "";
      if (/\bgit add -A\b|land\s+\*\*all\*\*/i.test(body)) findings.push({ path, line: 1, message: "Legacy whole-tree rule: review its projections before adopting ready-batch checkpoints." });
    }
  } catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; }
  return findings;
}
