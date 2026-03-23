#!/usr/bin/env bun
/**
 * Visual audit script — captures all CLI command outputs as text fixtures
 * and optionally generates an HTML report for visual review.
 *
 * Usage:
 *   bun scripts/visual-audit.ts            # capture fixtures only
 *   bun scripts/visual-audit.ts --report   # capture fixtures + generate report.html
 */

import { $ } from "bun";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const CLI = "./src/cli.ts";
const FIXTURES_DIR = "tests/fixtures/cli";

const COMMANDS: Array<{ name: string; args: string[] }> = [
  { name: "no-args",                      args: [] },
  { name: "help",                         args: ["help"] },
  { name: "versions",                     args: ["versions"] },
  { name: "capabilities",                 args: ["capabilities"] },
  { name: "operations",                   args: ["operations"] },
  { name: "new-endpoints",                args: ["new-endpoints"] },
  { name: "login--help",                  args: ["login", "--help"] },
  { name: "call--help",                   args: ["call", "--help"] },
  { name: "oauth-token--help",            args: ["oauth-token", "--help"] },
  { name: "grid-fee-reductions--help",    args: ["grid-fee-reductions", "--help"] },
  { name: "grid-fee-reductions-list--help", args: ["grid-fee-reductions", "list", "--help"] },
  { name: "meter-orders--help",           args: ["meter-orders", "--help"] },
  { name: "meter-orders-list--help",      args: ["meter-orders", "list", "--help"] },
];

async function runCommand(args: string[]): Promise<string> {
  try {
    const result = await $`env FORCE_COLOR=1 bun ${CLI} ${args}`.text();
    return result;
  } catch (err: unknown) {
    // commander exits with 0 for --help; some commands exit non-zero without auth
    if (err && typeof err === "object" && "stdout" in err) {
      return String((err as { stdout: string }).stdout);
    }
    return String(err);
  }
}

function stripAnsi(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1b\[[0-9;]*m/g, "");
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function main() {
  const generateReport = process.argv.includes("--report");

  mkdirSync(FIXTURES_DIR, { recursive: true });

  const results: Array<{ name: string; cmd: string; output: string }> = [];

  for (const { name, args } of COMMANDS) {
    const cmd = `nomos ${args.join(" ")}`.trim();
    process.stdout.write(`  capturing: ${cmd}\n`);

    const raw = await runCommand(args);
    const stripped = stripAnsi(raw);

    // Save plain-text fixture
    writeFileSync(join(FIXTURES_DIR, `${name}.txt`), stripped);

    results.push({ name, cmd, output: raw });
  }

  console.log(`\n✓ Fixtures written to ${FIXTURES_DIR}/`);

  if (!generateReport) return;

  // Build HTML report
  const sections = results
    .map(({ name, cmd, output }) => {
      // Convert ANSI to simple HTML (colors stripped for readability)
      const plain = escapeHtml(stripAnsi(output));
      return `
    <section>
      <h2><code>${escapeHtml(cmd)}</code> <span class="slug">${name}</span></h2>
      <pre>${plain}</pre>
    </section>`;
    })
    .join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Nomos CLI Visual Audit</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0d0d0d; color: #e0e0e0; margin: 0; padding: 2rem; }
    h1 { color: #7c5cff; margin-bottom: 2rem; }
    section { margin-bottom: 2.5rem; border: 1px solid #222; border-radius: 8px; padding: 1rem 1.5rem; }
    h2 { font-size: 1rem; color: #9d7fff; margin: 0 0 0.75rem; }
    h2 code { font-size: 1.1rem; color: #fff; }
    .slug { font-size: 0.75rem; color: #666; font-family: monospace; }
    pre { margin: 0; font-family: "SF Mono", Menlo, monospace; font-size: 0.8rem; line-height: 1.5; white-space: pre-wrap; word-break: break-all; color: #ccc; }
    p.meta { font-size: 0.75rem; color: #555; margin-top: 1rem; }
  </style>
</head>
<body>
  <h1>Nomos CLI — Visual Audit</h1>
  <p class="meta">Generated: ${new Date().toISOString()}</p>
${sections}
</body>
</html>`;

  writeFileSync("report.html", html);
  console.log("✓ Report written to report.html");
}

main();
