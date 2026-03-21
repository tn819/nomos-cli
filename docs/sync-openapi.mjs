import { execSync } from "node:child_process";

const versions = ["2025-12-16.batman", "2026-01-29.edison"];

for (const version of versions) {
  const url = `https://api.nomos.energy/openapi.${version}.json`;
  const out = `specs/openapi.${version}.json`;
  execSync(`curl -sSL ${url} > ${out}`, { stdio: "inherit" });
}

execSync("cp specs/openapi.2026-01-29.edison.json specs/openapi.latest.json", { stdio: "inherit" });
execSync("npm run generate", { stdio: "inherit" });
