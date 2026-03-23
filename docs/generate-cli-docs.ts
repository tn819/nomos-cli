#!/usr/bin/env bun
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

interface CommandDoc {
  name: string;
  description: string;
  helpText: string;
  subcommands?: CommandDoc[];
}

async function getHelpText(command: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn("bun", ["src/cli.ts", ...command, "--help"], {
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "pipe"],
    });

    let output = "";
    let errorOutput = "";

    proc.stdout.on("data", (data) => {
      output += data.toString();
    });

    proc.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    proc.on("close", (code) => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        resolve(output.trim() || errorOutput.trim());
      }
    });

    proc.on("error", reject);
  });
}

async function generateCommandDoc(name: string, commandPath: string[] = []): Promise<CommandDoc> {
  const helpText = await getHelpText([...commandPath, name]);
  const lines = helpText.split("\n");
  
  const description = lines
    .find(line => line.trim() && !line.startsWith("Usage:") && !line.startsWith("Options:"))
    ?.trim() || "";

  return {
    name,
    description,
    helpText,
  };
}

async function generateAllDocs(): Promise<CommandDoc[]> {
  const topLevelCommands = [
    { name: "help", description: "Display help" },
    { name: "login", description: "Login and persist auth defaults" },
    { name: "versions", description: "List available OpenAPI versions" },
    { name: "capabilities", description: "Show grouped operation overview" },
    { name: "everything", description: "Display the full endpoint overview" },
    { name: "new-endpoints", description: "Show new endpoints in latest spec" },
    { name: "operations", description: "List operation keys" },
    { name: "call", description: "Call an operation by key" },
    { name: "oauth-token", description: "Helper for POST /oauth/token" },
  ];

  const subcommandGroups = [
    {
      name: "grid-fee-reductions",
      description: "Edison grid fee reductions endpoints",
      subcommands: ["list", "get", "create"],
    },
    {
      name: "meter-orders",
      description: "Edison meter orders endpoints",
      subcommands: ["list", "get", "create"],
    },
  ];

  const docs: CommandDoc[] = [];

  for (const cmd of topLevelCommands) {
    console.log(`Generating docs for: ${cmd.name}`);
    const doc = await generateCommandDoc(cmd.name);
    docs.push(doc);
  }

  for (const group of subcommandGroups) {
    console.log(`Generating docs for: ${group.name}`);
    const groupDoc: CommandDoc = {
      name: group.name,
      description: group.description,
      helpText: await getHelpText([group.name, "--help"]),
      subcommands: [],
    };

    for (const sub of group.subcommands) {
      console.log(`  Generating docs for: ${group.name} ${sub}`);
      const subDoc = await generateCommandDoc(sub, [group.name]);
      groupDoc.subcommands!.push(subDoc);
    }

    docs.push(groupDoc);
  }

  return docs;
}

function generateMarkdown(docs: CommandDoc[]): string {
  let markdown = `# CLI Reference

Complete reference for the \`nomos\` CLI commands.

## Table of Contents

`;

  for (const doc of docs) {
    if (doc.subcommands) {
      markdown += `- [${doc.name}](#${doc.name})\n`;
      for (const sub of doc.subcommands) {
        markdown += `  - [${doc.name} ${sub.name}](#${doc.name}-${sub.name})\n`;
      }
    } else {
      markdown += `- [${doc.name}](#${doc.name})\n`;
    }
  }

  markdown += "\n---\n\n";

  for (const doc of docs) {
    if (doc.subcommands) {
      markdown += `## ${doc.name}\n\n`;
      markdown += `${doc.description}\n\n`;
      markdown += `\`\`\`\n${doc.helpText}\n\`\`\`\n\n`;

      for (const sub of doc.subcommands) {
        markdown += `### ${doc.name} ${sub.name}\n\n`;
        markdown += `${sub.description}\n\n`;
        markdown += `\`\`\`\n${sub.helpText}\n\`\`\`\n\n`;
      }
    } else {
      markdown += `## ${doc.name}\n\n`;
      markdown += `${doc.description}\n\n`;
      markdown += `\`\`\`\n${doc.helpText}\n\`\`\`\n\n`;
    }
  }

  return markdown;
}

async function main() {
  const outputDir = process.argv[2] || "docs/cli";
  mkdirSync(outputDir, { recursive: true });

  console.log("Generating CLI documentation...");
  const docs = await generateAllDocs();
  const markdown = generateMarkdown(docs);

  const outputPath = join(outputDir, "commands.md");
  writeFileSync(outputPath, markdown);
  console.log(`CLI documentation written to: ${outputPath}`);
}

main().catch((err) => {
  console.error("Error generating CLI docs:", err);
  process.exit(1);
});
