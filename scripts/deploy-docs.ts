#!/usr/bin/env bun
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";

function run(command: string, cwd?: string): void {
  console.log(`> ${command}`);
  execSync(command, { stdio: "inherit", cwd });
}

function main() {
  console.log("🚀 Deploying documentation to GitHub Pages...\n");

  if (!existsSync("docs-dist/.git")) {
    console.error("❌ docs-dist worktree not found. Run:");
    console.error("   git worktree add docs-dist gh-pages");
    process.exit(1);
  }

  console.log("📚 Generating documentation...");
  run("bun run docs:generate");

  console.log("\n🏗️  Building VitePress site...");
  run("bun run docs:build");

  console.log("\n📤 Deploying to gh-pages...");
  const timestamp = new Date().toISOString();

  run("git add -A", "docs-dist");

  try {
    run(`git commit -m "Deploy docs: ${timestamp}"`, "docs-dist");
  } catch {
    console.log("⚠️  No changes to commit");
  }

  run("git push origin gh-pages", "docs-dist");

  console.log("\n✅ Documentation deployed!");
  console.log("🌐 Site will be available at: https://tn819.github.io/nomos-cli/");
}

main();
