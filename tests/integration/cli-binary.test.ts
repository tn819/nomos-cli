import { describe, test, expect } from "bun:test";
import { $ } from "bun";
import { mkdtemp, writeFile, rm } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";

const CLI_PATH = "./src/cli.ts";

describe("CLI Integration - Built Binary", () => {
  test("built binary should work", async () => {
    const result = await $`./dist/cli.js help`.text();
    expect(result).toContain("Usage:");
    expect(result).toContain("Commands:");
  });

  test("built binary versions command", async () => {
    const result = await $`./dist/cli.js versions`.text();
    expect(result).toContain("2026-01-29.edison");
  });
});

describe("CLI Integration - Config", () => {
  let tempDir: string;

  test("login with --token should persist config", async () => {
    const result = await $`bun ${CLI_PATH} login --token test-token`;
    expect(result.exitCode).toBe(0);
  });
});
