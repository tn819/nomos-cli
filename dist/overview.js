import operationsData from "./generated/operations.json" with { type: "json" };
const data = operationsData;
export function getAvailableVersions() {
    return Object.keys(data.versions).sort();
}
export function getLatestVersion() {
    return data.latest;
}
export function getOperations(version = data.latest) {
    const found = data.versions[version];
    if (!found) {
        throw new Error(`Unknown spec version: ${version}`);
    }
    return found.operations;
}
export function groupOperationsByTag(version = data.latest) {
    const grouped = new Map();
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
export function getVersionDiff(baseVersion, compareVersion) {
    const base = new Map(getOperations(baseVersion).map((op) => [op.key, op]));
    const compare = new Map(getOperations(compareVersion).map((op) => [op.key, op]));
    const added = [...compare.entries()].filter(([key]) => !base.has(key)).map(([, op]) => op).sort((a, b) => a.key.localeCompare(b.key));
    const removed = [...base.entries()].filter(([key]) => !compare.has(key)).map(([, op]) => op).sort((a, b) => a.key.localeCompare(b.key));
    return { added, removed };
}
