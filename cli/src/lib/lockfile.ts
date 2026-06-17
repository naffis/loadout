import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import type { Lockfile } from "./types.js";

export const LOCKFILE_NAME = "loadout.lock.json";
const BASE_DIR = join(".loadout", "base");

export function lockfilePath(projectRoot: string): string {
  return join(projectRoot, LOCKFILE_NAME);
}

export function readLockfile(projectRoot: string): Lockfile | null {
  const p = lockfilePath(projectRoot);
  if (!existsSync(p)) return null;
  return JSON.parse(readFileSync(p, "utf8")) as Lockfile;
}

export function writeLockfile(projectRoot: string, lock: Lockfile): void {
  writeFileSync(lockfilePath(projectRoot), `${JSON.stringify(lock, null, 2)}\n`);
}

export function emptyLockfile(source: string, ref: string): Lockfile {
  return { source, ref, installed: {} };
}

/** sha256 of a string, prefixed like the spec's `sha256:...`. */
export function hashString(content: string): string {
  return `sha256:${createHash("sha256").update(content).digest("hex")}`;
}

/** Stable hash of a file or a directory (concatenated relative-path + content). */
export function hashPath(absPath: string): string {
  if (!existsSync(absPath)) return hashString("");
  const st = statSync(absPath);
  if (st.isFile()) return hashString(readFileSync(absPath, "utf8"));
  // Directory: hash each file's relative path + content, sorted for stability.
  const parts: string[] = [];
  const walk = (dir: string): void => {
    for (const entry of readdirSync(dir).sort()) {
      const full = join(dir, entry);
      const s = statSync(full);
      if (s.isDirectory()) walk(full);
      else {
        const rel = relative(absPath, full).split(sep).join("/"); // portable across OSes
        parts.push(`${rel}\u0000${readFileSync(full, "utf8")}`);
      }
    }
  };
  walk(absPath);
  return hashString(parts.join("\n"));
}

// --- merge-base cache: a copy of the upstream content at install time -------
// Enables a true three-way merge without re-fetching the old version. The cached copy
// mirrors the installed file or directory verbatim.

export function baseCachePath(projectRoot: string, id: string): string {
  return join(projectRoot, BASE_DIR, id);
}
