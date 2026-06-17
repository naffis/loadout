const useColor = process.stdout.isTTY && process.env.NO_COLOR === undefined;

function paint(code: string, s: string): string {
  return useColor ? `\u001b[${code}m${s}\u001b[0m` : s;
}

export const c = {
  red: (s: string) => paint("31", s),
  green: (s: string) => paint("32", s),
  yellow: (s: string) => paint("33", s),
  blue: (s: string) => paint("34", s),
  dim: (s: string) => paint("2", s),
  bold: (s: string) => paint("1", s),
};

export function info(msg: string): void {
  console.log(msg);
}

export function ok(msg: string): void {
  console.log(`${c.green("✓")} ${msg}`);
}

export function warn(msg: string): void {
  console.warn(`${c.yellow("⚠")} ${msg}`);
}

export function err(msg: string): void {
  console.error(`${c.red("✗")} ${msg}`);
}

export function heading(msg: string): void {
  console.log(`\n${c.bold(msg)}`);
}
