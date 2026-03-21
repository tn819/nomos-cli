#!/usr/bin/env bun
import { execSync } from "node:child_process";
import { copyFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const DOCS_DIR = "docs";
const SDK_DOCS_DIR = join(DOCS_DIR, "sdk");
const CLI_DOCS_DIR = join(DOCS_DIR, "cli");

function run(command: string): void {
  console.log(`> ${command}`);
  execSync(command, { stdio: "inherit" });
}

async function main() {
  console.log("🚀 Generating documentation...\n");

  console.log("📚 Generating SDK API documentation...");
  try {
    run("bun typedoc");
    console.log("✅ SDK docs generated\n");
  } catch (err) {
    console.error("❌ Failed to generate SDK docs:", err);
    process.exit(1);
  }

  console.log("⌨️  Generating CLI documentation...");
  try {
    run("bun scripts/generate-cli-docs.ts docs/cli");
    console.log("✅ CLI docs generated\n");
  } catch (err) {
    console.error("❌ Failed to generate CLI docs:", err);
    process.exit(1);
  }

  console.log("📄 Copying additional documentation...");
  
  const additionalDocs = [
    { from: "JOURNEY.md", to: join(DOCS_DIR, "guide", "journeys.md") },
    { from: "examples/README.md", to: join(DOCS_DIR, "guide", "examples.md") },
  ];

  for (const { from, to } of additionalDocs) {
    if (existsSync(from)) {
      copyFileSync(from, to);
      console.log(`  Copied ${from} -> ${to}`);
    }
  }

  console.log("\n✨ Documentation generation complete!");
  console.log("\nNext steps:");
  console.log("  bun run docs:dev    # Start dev server");
  console.log("  bun run docs:build  # Build static site");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
