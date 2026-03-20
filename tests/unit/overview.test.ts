import { describe, test, expect } from "bun:test";
import { getAvailableVersions, getLatestVersion, getOperations, getVersionDiff, groupOperationsByTag } from "../../src/overview";

describe("Overview", () => {
  test("getAvailableVersions should return array", () => {
    const versions = getAvailableVersions();
    expect(Array.isArray(versions)).toBe(true);
    expect(versions.length).toBeGreaterThan(0);
  });

  test("getLatestVersion should return string", () => {
    const latest = getLatestVersion();
    expect(typeof latest).toBe("string");
    expect(latest).toContain("20");
  });

  test("getOperations should return operations for latest version", () => {
    const operations = getOperations();
    expect(operations.length).toBeGreaterThan(0);
    expect(operations[0]).toHaveProperty("key");
    expect(operations[0]).toHaveProperty("method");
    expect(operations[0]).toHaveProperty("path");
    expect(operations[0]).toHaveProperty("tags");
  });

  test("getOperations should return operations for specific version", () => {
    const versions = getAvailableVersions();
    const operations = getOperations(versions[0]);
    expect(operations.length).toBeGreaterThan(0);
  });

  test("groupOperationsByTag should group by tags", () => {
    const grouped = groupOperationsByTag();
    expect(grouped instanceof Map).toBe(true);
    expect(grouped.size).toBeGreaterThan(0);

    for (const [tag, ops] of grouped) {
      expect(typeof tag).toBe("string");
      expect(Array.isArray(ops)).toBe(true);
      expect(ops.length).toBeGreaterThan(0);
    }
  });

  test("getVersionDiff should show differences", () => {
    const versions = getAvailableVersions();
    if (versions.length >= 2) {
      const diff = getVersionDiff(versions[0], versions[versions.length - 1]);
      expect(diff).toHaveProperty("added");
      expect(diff).toHaveProperty("removed");
      expect(Array.isArray(diff.added)).toBe(true);
      expect(Array.isArray(diff.removed)).toBe(true);
    }
  });
});
