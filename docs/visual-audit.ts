#!/usr/bin/env bun
/**
 * Visual Audit — captures all CLI command outputs as plain-text fixtures
 * and generates an HTML report for human review.
 *
 * Usage:
 *   bun scripts/visual-audit.ts            # capture + generate report
 *   bun scripts/visual-audit.ts --report   # re-generate HTML from existing fixtures
 */

import { $ } from "bun";
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

const FIXTURES_DIR = join(import.meta.dir, "../tests/fixtures/cli");
const REPORT_PATH = join(FIXTURES_DIR, "report.html");
const CLI = join(import.meta.dir, "../src/cli.ts");

const COMMANDS: { name: string; args: string[]; description: string }[] = [
  { name: "no-args",                      args: [],                                    description: "Welcome screen (no arguments)" },
  { name: "help",                         args: ["help"],                              description: "Help command" },
  { name: "versions",                     args: ["versions"],                          description: "List API versions" },
  { name: "capabilities",                 args: ["capabilities"],                      description: "Full capability overview" },
  { name: "operations",                   args: ["operations"],                        description: "List operation keys" },
  { name: "new-endpoints",                args: ["new-endpoints"],                     description: "New endpoints diff" },
  { name: "login--help",                  args: ["login", "--help"],                   description: "login --help" },
  { name: "call--help",                   args: ["call", "--help"],                    description: "call --help" },
  { name: "oauth-token--help",            args: ["oauth-token", "--help"],             description: "oauth-token --help" },
  { name: "grid-fee-reductions--help",    args: ["grid-fee-reductions", "--help"],     description: "grid-fee-reductions --help" },
  { name: "grid-fee-reductions-list--help", args: ["grid-fee-reductions", "list", "--help"], description: "grid-fee-reductions list --help" },
  { name: "meter-orders--help",           args: ["meter-orders", "--help"],            description: "meter-orders --help" },
  { name: "meter-orders-list--help",      args: ["meter-orders", "list", "--help"],    description: "meter-orders list --help" },
];

/** Strip ANSI escape codes for plain-text fixtures */
function stripAnsi(str: string): string {
  return str.replace(/\x1b\[[0-9;]*m/g, "").replace(/\x1b\[[0-9;]*[a-zA-Z]/g, "");
}

/** Minimal ANSI → HTML span converter for the report */
function ansiToHtml(raw: string): string {
  const ansiMap: Record<string, string> = {
    "0":  "",          // reset — handled separately
    "38;5;99":  "#7c5cff",  // purple (primary)
    "38;5;105": "#9d7fff",  // purple bright
    "38;5;246": "#a1a1aa",  // gray
    "38;5;243": "#71717a",  // muted
    "38;5;34":  "#22c55e",  // green
    "38;5;1":   "#ef4444",  // red
    "38;5;214": "#f59e0b",  // amber
    "38;5;239": "#27272a",  // gray-bright (bg-ish)
    "1":        "",          // bold — handled separately
  };

  let out = "";
  let openSpans = 0;
  const parts = raw.split(/(\x1b\[[0-9;]*m)/);

  for (const part of parts) {
    if (!part.startsWith("\x1b[")) {
      out += escHtml(part);
      continue;
    }
    const code = part.slice(2, -1);
    if (code === "0" || code === "") {
      // Reset: close all open spans
      out += "</span>".repeat(openSpans);
      openSpans = 0;
    } else if (code === "1") {
      out += `<span style="font-weight:bold">`;
      openSpans++;
    } else if (ansiMap[code]) {
      out += `<span style="color:${ansiMap[code]}">`;
      openSpans++;
    }
  }
  out += "</span>".repeat(openSpans);
  return out;
}

function escHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function capture(args: string[]): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  const env = { ...process.env, FORCE_COLOR: "1" };
  try {
    const proc = Bun.spawn(["bun", CLI, ...args], {
      env,
      stdout: "pipe",
      stderr: "pipe",
    });
    const [stdout, stderr] = await Promise.all([
      new Response(proc.stdout).text(),
      new Response(proc.stderr).text(),
    ]);
    const exitCode = await proc.exited;
    return { stdout, stderr, exitCode };
  } catch (e) {
    return { stdout: "", stderr: String(e), exitCode: 1 };
  }
}

function generateReport(entries: { name: string; description: string; cmd: string; raw: string }[]): string {
  const blocks = entries.map(({ description, cmd, raw }) => {
    const html = ansiToHtml(raw);
    return `
    <div class="block">
      <div class="block-header">
        <span class="cmd">${escHtml(cmd)}</span>
        <span class="desc">${escHtml(description)}</span>
      </div>
      <pre class="terminal">${html}</pre>
    </div>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Nomos CLI — Visual Audit</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0d0d0d; color: #e4e4e7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 40px 32px; }
  h1 { color: #7c5cff; font-size: 22px; margin-bottom: 6px; }
  .meta { color: #71717a; font-size: 13px; margin-bottom: 32px; }
  .block { margin-bottom: 32px; border: 1px solid #1e1e2e; border-radius: 10px; overflow: hidden; }
  .block-header {
    background: #12121c; padding: 10px 16px; display: flex; align-items: center; gap: 12px;
    border-bottom: 1px solid #1e1e2e;
  }
  .cmd { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 12px; color: #9d7fff; background: #1a1a2e; padding: 3px 10px; border-radius: 4px; }
  .desc { font-size: 12px; color: #71717a; }
  .terminal {
    background: #0a0a0a; padding: 18px 22px; font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
    font-size: 12.5px; line-height: 1.5; white-space: pre; overflow-x: auto;
  }
</style>
</head>
<body>
<h1>Nomos CLI — Visual Audit</h1>
<p class="meta">Generated ${new Date().toISOString()} · ${entries.length} commands captured</p>
${blocks}
</body>
</html>`;
}

async function main() {
  const reportOnly = process.argv.includes("--report");

  if (!existsSync(FIXTURES_DIR)) {
    mkdirSync(FIXTURES_DIR, { recursive: true });
  }

  const entries: { name: string; description: string; cmd: string; raw: string }[] = [];

  for (const { name, args, description } of COMMANDS) {
    const cmdStr = args.length ? `nomos ${args.join(" ")}` : "nomos";
    const fixturePath = join(FIXTURES_DIR, `${name}.txt`);

    let raw: string;

    if (reportOnly && existsSync(fixturePath)) {
      raw = readFileSync(fixturePath, "utf8");
      console.log(`  ↩  ${cmdStr} (from fixture)`);
    } else {
      process.stdout.write(`  › ${cmdStr} ...`);
      const { stdout, stderr } = await capture(args);
      raw = stdout + stderr;
      const plain = stripAnsi(raw);
      writeFileSync(fixturePath, plain, "utf8");
      console.log(` saved (${plain.split("\n").length} lines)`);
    }

    entries.push({ name, description, cmd: cmdStr, raw });
  }

  writeFileSync(REPORT_PATH, generateReport(entries), "utf8");
  console.log(`\n✓ Report → ${REPORT_PATH}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
