#!/usr/bin/env node
/**
 * beforeReadFile / beforeTabFileRead — keep live secret files out of model context.
 */
import { basename } from "node:path";
import { asString, readHookInput } from "./lib/read-hook-input.mjs";

const ALLOW_NAMES = new Set([".env.example", ".env.development.example", ".env.local.example"]);

const SECRET_NAMES = new Set([
  ".env",
  ".env.development",
  ".env.local",
  ".env.production",
  ".env.staging",
  ".dev.vars",
  "credentials.json",
]);

const input = readHookInput();
const filePath = asString(input.file_path);
const name = basename(filePath);

const denied =
  filePath.length > 0 &&
  !ALLOW_NAMES.has(name) &&
  (SECRET_NAMES.has(name) ||
    /(^|[\\/])\.env\.[A-Za-z0-9._-]+$/.test(filePath.replace(/\\/g, "/")));

if (denied) {
  process.stdout.write(
    `${JSON.stringify({
      permission: "deny",
      user_message:
        "Blocked read of a secret file. Use a named env key at runtime; never load .env contents into the model.",
    })}\n`,
  );
  process.exit(0);
}

process.stdout.write(`${JSON.stringify({ permission: "allow" })}\n`);
