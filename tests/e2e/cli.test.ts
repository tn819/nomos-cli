import { describe, test, expect } from "bun:test";
import { $ } from "bun";

const CLI_PATH = "./src/cli.ts";

describe("CLI E2E", () => {
  test("should display help", async () => {
    const result = await $`bun ${CLI_PATH} help`.text();
    expect(result).toContain("Usage:");
    expect(result).toContain("Commands:");
    expect(result).toContain("login");
    expect(result).toContain("versions");
  });

  test("should list versions", async () => {
    const result = await $`bun ${CLI_PATH} versions`.text();
    expect(result).toContain("2025-12-16.batman");
    expect(result).toContain("2026-01-29.edison");
    expect(result).toContain("(latest)");
  });

  test("should list operations", async () => {
    const result = await $`bun ${CLI_PATH} operations`.text();
    const lines = result.trim().split("\n");
    expect(lines.length).toBeGreaterThan(0);
    expect(result).toContain("get-subscriptions");
  });

  test("should show capabilities", async () => {
    const result = await $`bun ${CLI_PATH} capabilities`.text();
    expect(result).toContain("Spec version:");
    expect(result).toContain("Total operations:");
  });

  test("should show new-endpoints", async () => {
    const result = await $`bun ${CLI_PATH} new-endpoints`.text();
    expect(result).toContain("Base:");
    expect(result).toContain("Latest:");
    expect(result).toContain("Added:");
  });

  test("should show everything command", async () => {
    const result = await $`bun ${CLI_PATH} everything`.text();
    expect(result).toContain("Spec version:");
    expect(result).toContain("Total operations:");
  });

  test("should show grid-fee-reductions help", async () => {
    const result = await $`bun ${CLI_PATH} grid-fee-reductions --help`.text();
    expect(result).toContain("Usage:");
  });

  test("should show meter-orders help", async () => {
    const result = await $`bun ${CLI_PATH} meter-orders --help`.text();
    expect(result).toContain("Usage:");
  });
});
