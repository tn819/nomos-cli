import { describe, test, expect } from "bun:test";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { $ } from "bun";

const CLI_PATH = "./src/cli.ts";
const FIXTURES_DIR = "tests/fixtures/cli";

// Strip ANSI escape codes for snapshot comparison
function stripAnsi(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1b\[[0-9;]*m/g, "");
}

async function runCli(args: string[]): Promise<string> {
  try {
    const result = await $`env FORCE_COLOR=1 bun ${CLI_PATH} ${args}`.text();
    return stripAnsi(result);
  } catch (err: unknown) {
    if (err && typeof err === "object" && "stdout" in err) {
      return stripAnsi(String((err as { stdout: string }).stdout));
    }
    return String(err);
  }
}

function fixtureFor(name: string): string {
  return `${FIXTURES_DIR}/${name}.txt`;
}

function readFixture(name: string): string | null {
  const path = fixtureFor(name);
  if (!existsSync(path)) return null;
  return readFileSync(path, "utf8");
}

function writeFixture(name: string, content: string): void {
  mkdirSync(FIXTURES_DIR, { recursive: true });
  writeFileSync(fixtureFor(name), content);
}

const UPDATE = process.env.UPDATE_SNAPSHOTS === "1";

function snapshotTest(name: string, args: string[]) {
  test(name, async () => {
    const output = await runCli(args);

    if (UPDATE) {
      writeFixture(name, output);
      console.log(`  updated fixture: ${name}.txt`);
      return;
    }

    const fixture = readFixture(name);
    if (fixture === null) {
      // First run — write the fixture and pass
      writeFixture(name, output);
      console.log(`  created fixture: ${name}.txt`);
      return;
    }

    expect(output).toEqual(fixture);
  });
}

describe("CLI visual snapshots", () => {
  snapshotTest("no-args",                        []);
  snapshotTest("help",                           ["help"]);
  snapshotTest("versions",                       ["versions"]);
  snapshotTest("capabilities",                   ["capabilities"]);
  snapshotTest("operations",                     ["operations"]);
  snapshotTest("new-endpoints",                  ["new-endpoints"]);
  snapshotTest("login--help",                    ["login", "--help"]);
  snapshotTest("call--help",                     ["call", "--help"]);
  snapshotTest("oauth-token--help",              ["oauth-token", "--help"]);
  snapshotTest("grid-fee-reductions--help",      ["grid-fee-reductions", "--help"]);
  snapshotTest("grid-fee-reductions-list--help", ["grid-fee-reductions", "list", "--help"]);
  snapshotTest("meter-orders--help",             ["meter-orders", "--help"]);
  snapshotTest("meter-orders-list--help",        ["meter-orders", "list", "--help"]);
});
