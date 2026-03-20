import operationsData from "./generated/operations.json" with { type: "json" };
import type { OperationDefinition } from "./types.js";

type DataShape = {
  latest: string;
  versions: Record<string, { source: string; operations: OperationDefinition[] }>;
};

const data = operationsData as DataShape;

export function getAvailableVersions(): string[] {
  return Object.keys(data.versions).sort();
}

export function getLatestVersion(): string {
  return data.latest;
}

export function getOperations(version = data.latest): OperationDefinition[] {
  const found = data.versions[version];
  if (!found) {
    throw new Error(`Unknown spec version: ${version}`);
  }
  return found.operations;
}

export function groupOperationsByTag(version = data.latest): Map<string, OperationDefinition[]> {
  const grouped = new Map<string, OperationDefinition[]>();
  for (const op of getOperations(version)) {
    for (const tag of op.tags) {
      const existing = grouped.get(tag) ?? [];
      existing.push(op);
      grouped.set(tag, existing);
    }
  }

  for (const [, ops] of grouped) {
    ops.sort((a, b) => a.key.localeCompare(b.key));
  }

  return new Map([...grouped.entries()].sort((a, b) => a[0].localeCompare(b[0])));
}

export function getVersionDiff(baseVersion: string, compareVersion: string): {
  added: OperationDefinition[];
  removed: OperationDefinition[];
} {
  const base = new Map(getOperations(baseVersion).map((op) => [op.key, op]));
  const compare = new Map(getOperations(compareVersion).map((op) => [op.key, op]));

  const added = [...compare.entries()].filter(([key]) => !base.has(key)).map(([, op]) => op).sort((a, b) => a.key.localeCompare(b.key));
  const removed = [...base.entries()].filter(([key]) => !compare.has(key)).map(([, op]) => op).sort((a, b) => a.key.localeCompare(b.key));

  return { added, removed };
}
