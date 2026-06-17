import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export interface MergeResult {
  merged: string;
  conflict: boolean;
}

/**
 * Three-way merge of text. `ours` = file on disk, `base` = merge base (upstream at install),
 * `theirs` = new upstream. diff3-style: clean merges combine both sides; conflicts produce
 * markers and never silently discard either side. Uses the system `diff3 -m` when available,
 * with a conservative JS fallback.
 */
export function threeWayMerge(ours: string, base: string, theirs: string): MergeResult {
  if (ours === theirs) return { merged: ours, conflict: false };
  if (ours === base) return { merged: theirs, conflict: false }; // only upstream changed
  if (theirs === base) return { merged: ours, conflict: false }; // only local changed

  // Both changed: try diff3 -m for a line-level merge.
  const dir = mkdtempSync(join(tmpdir(), "loadout-merge-"));
  try {
    const oursF = join(dir, "ours");
    const baseF = join(dir, "base");
    const theirsF = join(dir, "theirs");
    writeFileSync(oursF, ours);
    writeFileSync(baseF, base);
    writeFileSync(theirsF, theirs);
    const res = spawnSync("diff3", ["-m", oursF, baseF, theirsF], { encoding: "utf8" });
    if (res.status === 0 && typeof res.stdout === "string") {
      return { merged: res.stdout, conflict: false };
    }
    if (res.status === 1 && typeof res.stdout === "string") {
      // Conflicts present; diff3 already wrote <<<<<<< / ======= / >>>>>>> markers.
      return { merged: res.stdout, conflict: true };
    }
  } catch {
    // diff3 unavailable; fall through.
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }

  // Fallback: wrap the whole file in conflict markers rather than lose either side.
  const merged =
    `<<<<<<< local\n${ours}\n` +
    `||||||| base\n${base}\n` +
    `=======\n${theirs}\n>>>>>>> upstream\n`;
  return { merged, conflict: true };
}
