import { createHash, randomUUID } from "node:crypto";
import { chmodSync, existsSync, lstatSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";

export const START = "<!-- loadout:engineering:start -->";
export const END = "<!-- loadout:engineering:end -->";
export const INSERT = `\n\n${START}\nFor the adopted engineering workflow, read .loadout/engineering/WORKFLOW.md\nand .loadout/engineering/project.json. Preserve applicable project and nested\ninstructions; report conflicts instead of silently overriding them.\n${END}\n`;

export function hash(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}

/** Do not follow instruction-file symlinks, including symlinked parent dirs. */
export function safePath(root: string, path: string): string {
  if (isAbsolute(path) || path.includes("\\") || path.split("/").some((p) => p === ".." || p === "")) {
    throw new Error(`Unsafe profile path: ${path}`);
  }
  const full = resolve(root, path);
  if (!relative(root, full) || relative(root, full).startsWith(`..${sep}`)) throw new Error(`Unsafe profile path: ${path}`);
  let current = resolve(root);
  for (const part of relative(root, full).split(sep)) {
    current = join(current, part);
    try {
      if (lstatSync(current).isSymbolicLink()) throw new Error(`Symlink at ${relative(root, current)}; preserve it and integrate manually.`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }
  return full;
}

export function readOptional(root: string, path: string): string | null {
  const full = safePath(root, path);
  if (!existsSync(full)) return null;
  if (!lstatSync(full).isFile()) throw new Error(`${path} is not a regular file.`);
  const bytes = readFileSync(full);
  const text = bytes.toString("utf8");
  if (!Buffer.from(text, "utf8").equals(bytes)) throw new Error(`${path} is not UTF-8; preserve it and integrate manually.`);
  return text;
}

export function stripManaged(text: string, expected: string): string {
  if (expected !== INSERT) throw new Error("Unknown managed instruction fragment; use its original installer to remove it.");
  if (text.split(START).length !== 2 || text.split(END).length !== 2 || !text.includes(expected)) {
    throw new Error("Managed instruction block was edited, duplicated, or removed; reconcile it before updating.");
  }
  return text.replace(expected, "");
}

export interface FileChange { path: string; before: string | null; after: string | null }

/** Preflight the whole batch; then use checked atomic writes under an installer lock. */
export function applyFileChanges(root: string, changes: FileChange[]): void {
  const lock = safePath(root, ".loadout/engineering-install.lock");
  mkdirSync(dirname(lock), { recursive: true });
  try { mkdirSync(lock); } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") throw new Error("Another engineering install may be running. Confirm it stopped before removing .loadout/engineering-install.lock.");
    throw error;
  }
  try {
    for (const change of changes) {
      if (readOptional(root, change.path) !== change.before) throw new Error(`${change.path} changed since planning; rerun plan.`);
    }
    for (const change of changes) {
      if (change.before === change.after) continue;
      if (readOptional(root, change.path) !== change.before) throw new Error(`${change.path} changed during install; stop writers and inspect the partial operation.`);
      const full = safePath(root, change.path);
      if (change.after === null) { rmSync(full); continue; }
      mkdirSync(dirname(full), { recursive: true });
      const temporary = `${full}.${randomUUID()}.tmp`;
      try {
        writeFileSync(temporary, change.after, { flag: "wx", mode: 0o600 });
        chmodSync(temporary, change.before === null ? 0o644 : lstatSync(full).mode & 0o777);
        renameSync(temporary, full);
      } finally { rmSync(temporary, { force: true }); }
    }
  } finally { rmSync(lock, { recursive: true }); }
}
