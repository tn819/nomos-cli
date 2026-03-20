import type { OperationDefinition } from "./types.js";
export declare function getAvailableVersions(): string[];
export declare function getLatestVersion(): string;
export declare function getOperations(version?: string): OperationDefinition[];
export declare function groupOperationsByTag(version?: string): Map<string, OperationDefinition[]>;
export declare function getVersionDiff(baseVersion: string, compareVersion: string): {
    added: OperationDefinition[];
    removed: OperationDefinition[];
};
