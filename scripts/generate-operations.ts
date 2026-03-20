import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type OpenApiDoc = {
  info: { version: string };
  paths: Record<string, Record<string, { summary?: string; tags?: string[]; security?: Array<Record<string, unknown>> }>>;
  security?: Array<Record<string, unknown>>;
};

type Operation = {
  key: string;
  method: string;
  path: string;
  summary: string;
  tags: string[];
  security: Array<"bearer" | "basic" | "none">;
  specVersion: string;
};

const specsDir = join(process.cwd(), "specs");
const outFile = join(process.cwd(), "src/generated/operations.json");

function keyFrom(method: string, path: string): string {
  const normalized = path
    .split("/")
    .filter(Boolean)
    .map((segment) => {
      if (segment.startsWith("{") && segment.endsWith("}")) {
        return `by-${segment.slice(1, -1).replace(/_/g, "-")}`;
      }
      if (segment === ".well-known") {
        return "well-known";
      }
      return segment.replace(/_/g, "-");
    })
    .join("-");

  return `${method.toLowerCase()}-${normalized}`;
}

function toSecurityNames(opSecurity: Array<Record<string, unknown>> | undefined, defaultSecurity: Array<Record<string, unknown>> | undefined): Array<"bearer" | "basic" | "none"> {
  const source = opSecurity ?? defaultSecurity;
  if (!source || source.length === 0) return ["none"];

  const out = new Set<"bearer" | "basic" | "none">();
  for (const item of source) {
    if (Object.keys(item).length === 0) {
      out.add("none");
      continue;
    }
    if ("Bearer" in item) out.add("bearer");
    if ("Basic" in item) out.add("basic");
  }

  return out.size > 0 ? Array.from(out) : ["none"];
}

const specFiles = readdirSync(specsDir)
  .filter((f) => f.startsWith("openapi.") && f.endsWith(".json") && f !== "openapi.latest.json")
  .sort();

const versions: Record<string, { source: string; operations: Operation[] }> = {};

for (const file of specFiles) {
  const fullPath = join(specsDir, file);
  const doc = JSON.parse(readFileSync(fullPath, "utf8")) as OpenApiDoc;
  const ops: Operation[] = [];

  for (const [path, methods] of Object.entries(doc.paths)) {
    for (const [method, definition] of Object.entries(methods)) {
      const lowerMethod = method.toLowerCase();
      if (!["get", "post", "put", "patch", "delete"].includes(lowerMethod)) continue;

      ops.push({
        key: keyFrom(lowerMethod, path),
        method: lowerMethod,
        path,
        summary: definition.summary ?? `${lowerMethod.toUpperCase()} ${path}`,
        tags: definition.tags ?? ["Untagged"],
        security: toSecurityNames(definition.security, doc.security),
        specVersion: doc.info.version,
      });
    }
  }

  ops.sort((a, b) => a.key.localeCompare(b.key));
  versions[doc.info.version] = {
    source: file,
    operations: ops,
  };
}

const latest = Object.keys(versions).sort().at(-1);
if (!latest) {
  throw new Error("No OpenAPI specs found in specs/");
}

writeFileSync(
  outFile,
  `${JSON.stringify({ latest, versions }, null, 2)}\n`,
  "utf8",
);

console.log(`Generated ${outFile}`);
console.log(`Latest: ${latest}`);
