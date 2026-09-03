#!/usr/bin/env node
/**
 * beforeShellExecution — bind no-stash / git-safety / no-secrets.
 * Fail-open on parse errors so a broken hook does not freeze the agent.
 */
import { asString, readHookInput } from "./lib/read-hook-input.mjs";

const input = readHookInput();
const command = asString(input.command);

/** `git` plus optional `-C` / `--git-dir` flags, then the subcommand. */
const GIT = String.raw`\bgit(?:\s+(?:-C\s+\S+|-[^\s]+|--[^\s]+))*\s+`;

const DENY = [
  {
    re: new RegExp(`${GIT}stash\\b`),
    reason: "git stash is banned (no-stash). Leave WIP in the tree or commit the whole tree when asked.",
  },
  {
    re: new RegExp(`${GIT}reset\\b[^\\n]*--hard\\b`),
    reason: "git reset --hard is banned (git-safety). Do not discard WIP.",
  },
  {
    re: new RegExp(`${GIT}clean\\s+[^\\n]*-[a-zA-Z]*f`),
    reason: "git clean -f is banned (git-safety). Do not wipe untracked files.",
  },
  {
    re: new RegExp(`${GIT}checkout\\b[^\\n]*(?:^|\\s)\\.(?:\\s|$)`),
    reason: "git checkout -- . is banned (git-safety). Do not restore the whole tree.",
  },
  {
    re: new RegExp(`${GIT}restore\\b[^\\n]*(?:^|\\s)\\.(?:\\s|$)`),
    reason: "git restore . is banned (git-safety). Do not restore the whole tree.",
  },
  {
    re: /\b(?:cat|less|more|head|tail|bat|nl)\s+[^\n]*\.env(?:\.[A-Za-z0-9._-]+)?\b/,
    reason: "Do not print .env files (no-secrets-in-code). Read keys by name in code, never dump values.",
  },
  {
    re: /\bprintenv\b/,
    reason: "printenv can leak secrets into the transcript. Read a named key in process code instead.",
  },
];

const hit = DENY.find((row) => row.re.test(command));
if (hit) {
  process.stdout.write(
    `${JSON.stringify({
      permission: "deny",
      user_message: hit.reason,
      agent_message: hit.reason,
    })}\n`,
  );
  process.exit(0);
}

process.stdout.write(`${JSON.stringify({ permission: "allow" })}\n`);
