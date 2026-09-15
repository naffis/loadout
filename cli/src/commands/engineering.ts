import { execFileSync } from "node:child_process";
import { applyFileChanges } from "../lib/engineering-files.js";
import { ignoredProfilePaths, parseTools, planEngineering, planEngineeringRemoval } from "../lib/engineering.js";
import { findSourceRoot } from "../lib/source.js";
import { err, info, ok, warn } from "../lib/log.js";

export function engineering(args: string[]): number {
  const [action = "plan", ...options] = args;
  if (!["plan", "apply", "check", "remove"].includes(action)) throw new Error("Usage: loadout engineering <plan|apply|check|remove> [--tools codex,grok,claude,cursor] [--dry-run]");
  let selected;
  let dryRun = action === "plan" || action === "check";
  for (let i = 0; i < options.length; i++) {
    if (options[i] === "--tools" && options[i + 1]) selected = parseTools(options[++i]);
    else if (options[i] === "--dry-run") dryRun = true;
    else throw new Error(`Unknown engineering option: ${options[i]}`);
  }
  if (action === "remove" && selected) throw new Error("remove uses the recorded adapter set; omit --tools.");
  const root = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  const plan = action === "remove" ? planEngineeringRemoval(root) : planEngineering(root, findSourceRoot(), selected);
  if (action !== "remove") {
    for (const path of ignoredProfilePaths(root, plan.changes.map((change) => change.path))) {
      plan.findings.push({ path, line: 1, message: "Git ignores this profile path; reconcile the ignore rule deliberately so clients can discover and teammates can receive it." });
    }
  }
  info(`loadout engineering ${action} — ${root}`);
  for (const change of plan.changes) info(`  ${change.before === change.after ? "keep" : change.after === null ? "remove" : change.before === null ? "create" : "update"} ${change.path}`);
  for (const note of plan.notes) warn(note);
  for (const finding of plan.findings) err(`${finding.path}:${finding.line}: ${finding.message}`);
  if (plan.findings.length) {
    err("No changes written. Resolve these potential instruction conflicts in their authoritative files, then rerun plan. No force/bypass option is provided.");
    return 1;
  }
  if (action === "check") {
    if (!plan.installed) { err("Profile not installed."); return 1; }
    if (plan.changes.some((change) => change.before !== change.after)) { warn("Profile update available; inspect plan and apply deliberately."); return 1; }
    ok("Installed profile matches this loadout version. This is an installation check, not a test run or instruction-loading proof.");
    return 0;
  }
  if (dryRun) { info("Dry run: no files written. Pause active editors before applying instruction changes."); return 0; }
  applyFileChanges(root, plan.changes);
  ok(action === "remove" ? "Removed unchanged loadout-owned files and exact instruction blocks; project content/config preserved." : "Installed engineering profile; existing project text preserved. Git, CI, global CLI config and permissions were not changed.");
  return 0;
}
