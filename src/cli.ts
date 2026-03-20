#!/usr/bin/env node
import { Command } from "commander";
import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline/promises";
import { getAvailableVersions, getLatestVersion, getOperations, getVersionDiff, groupOperationsByTag } from "./overview.js";
import { NomosSDK } from "./sdk.js";

function parseJsonObject(value: string | undefined): Record<string, unknown> | undefined {
  if (!value) return undefined;
  const parsed = JSON.parse(value) as unknown;
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("Expected a JSON object");
  }
  return parsed as Record<string, unknown>;
}

type StoredConfig = {
  baseUrl?: string;
  version?: string;
  token?: string;
};

const CONFIG_DIR = join(homedir(), ".nomos");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

function readStoredConfig(): StoredConfig {
  if (!existsSync(CONFIG_FILE)) return {};
  try {
    const raw = readFileSync(CONFIG_FILE, "utf8");
    return JSON.parse(raw) as StoredConfig;
  } catch {
    return {};
  }
}

function writeStoredConfig(config: StoredConfig): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
  writeFileSync(CONFIG_FILE, `${JSON.stringify(config, null, 2)}\n`, "utf8");
  try {
    chmodSync(CONFIG_FILE, 0o600);
  } catch {
    // best-effort on permission hardening
  }
}

async function askWithDefault(rl: ReturnType<typeof createInterface>, label: string, defaultValue?: string): Promise<string> {
  const suffix = defaultValue ? ` [${defaultValue}]` : "";
  const answer = (await rl.question(`${label}${suffix}: `)).trim();
  return answer || defaultValue || "";
}

function sdkFromOptions(opts: { baseUrl?: string; version?: string; token?: string; basic?: string }): NomosSDK {
  const stored = readStoredConfig();
  let basicAuth: { username: string; password: string } | undefined;

  if (opts.basic) {
    const idx = opts.basic.indexOf(":");
    if (idx < 0) {
      throw new Error("--basic must be in the format username:password");
    }
    basicAuth = {
      username: opts.basic.slice(0, idx),
      password: opts.basic.slice(idx + 1),
    };
  }

  return new NomosSDK({
    baseUrl: opts.baseUrl ?? stored.baseUrl,
    specVersion: opts.version ?? stored.version,
    bearerToken: opts.token ?? stored.token,
    basicAuth,
  });
}

function printResponse(result: { status: number; data: unknown }): void {
  console.error(`HTTP ${result.status}`);

  if (Buffer.isBuffer(result.data)) {
    process.stdout.write(result.data);
    return;
  }

  if (typeof result.data === "string") {
    console.log(result.data);
    return;
  }

  console.log(JSON.stringify(result.data, null, 2));
}

function printEverything(version = getLatestVersion()): void {
  const grouped = groupOperationsByTag(version);
  console.log(`Spec version: ${version}`);
  console.log(`Total operations: ${getOperations(version).length}`);

  for (const [tag, ops] of grouped) {
    console.log(`\n[${tag}] (${ops.length})`);
    for (const op of ops) {
      console.log(`- ${op.key} :: ${op.method.toUpperCase()} ${op.path} :: ${op.summary}`);
    }
  }

  const versions = getAvailableVersions();
  if (versions.length >= 2) {
    const base = versions[0];
    const compare = versions[versions.length - 1];
    const diff = getVersionDiff(base, compare);

    console.log(`\nVersion diff ${base} -> ${compare}`);
    console.log(`Added: ${diff.added.length}`);
    for (const op of diff.added) {
      console.log(`+ ${op.key} :: ${op.method.toUpperCase()} ${op.path}`);
    }

    console.log(`Removed: ${diff.removed.length}`);
    for (const op of diff.removed) {
      console.log(`- ${op.key} :: ${op.method.toUpperCase()} ${op.path}`);
    }
  }
}

const program = new Command();
program
  .name("nomos")
  .description("Nomos SDK CLI")
  .version("0.1.0")
  .showHelpAfterError();

program
  .command("help")
  .description("Display help")
  .action(() => {
    program.outputHelp();
  });

program
  .command("login")
  .description("Login and persist auth defaults for future nomos commands")
  .option("--token <token>", "Bearer token")
  .option("--client-id <id>", "OAuth client id")
  .option("--client-secret <secret>", "OAuth client secret")
  .option("--scope <scope>", "OAuth scope string")
  .action(async (opts) => {
    const stored = readStoredConfig();
    let token = opts.token as string | undefined;
    let version = stored.version || getLatestVersion();
    let baseUrl = stored.baseUrl || "https://api.nomos.energy";
    let clientId = opts.clientId as string | undefined;
    let clientSecret = opts.clientSecret as string | undefined;
    let scope = opts.scope as string | undefined;

    const hasExplicitAuth = Boolean(token || (clientId && clientSecret));
    const shouldGuide = !hasExplicitAuth;

    if (shouldGuide) {
      const rl = createInterface({ input: process.stdin, output: process.stdout });
      console.log("Guided login");
      console.log("Step 1/4: connection defaults");
      baseUrl = await askWithDefault(rl, "Base API URL", baseUrl || stored.baseUrl || "https://api.nomos.energy");
      version = await askWithDefault(rl, "Spec version", version || stored.version || getLatestVersion());

      console.log("\nStep 2/4: authentication method");
      console.log("1) Bearer token");
      console.log("2) OAuth client credentials");
      const method = await askWithDefault(rl, "Choose method (1 or 2)", token ? "1" : "2");

      if (method === "1") {
        console.log("\nStep 3/4: bearer token");
        token = await askWithDefault(rl, "Bearer token", token || stored.token);
        if (!token) {
          rl.close();
          throw new Error("No token provided");
        }
      } else {
        console.log("\nStep 3/4: OAuth client credentials");
        clientId = await askWithDefault(rl, "Client ID", clientId);
        clientSecret = await askWithDefault(rl, "Client Secret", clientSecret);
        scope = await askWithDefault(rl, "Scope (optional)", scope);
        if (!clientId || !clientSecret) {
          rl.close();
          throw new Error("Client ID and Client Secret are required for OAuth client credentials");
        }
      }

      console.log("\nStep 4/4: validating and saving...");
      rl.close();
    }

    if (!token && clientId && clientSecret) {
      const sdk = new NomosSDK({
        baseUrl,
        specVersion: version,
        basicAuth: {
          username: clientId,
          password: clientSecret,
        },
      });

      const body: Record<string, string> = { grant_type: "client_credentials" };
      if (scope) body.scope = scope;

      const result = await sdk.call("post-oauth-token", { body, auth: "basic" });
      if (typeof result.data === "object" && result.data !== null && "access_token" in result.data) {
        token = String((result.data as Record<string, unknown>).access_token);
      } else {
        throw new Error("OAuth response did not include access_token");
      }
    }

    if (!token && !shouldGuide) {
      const rl = createInterface({ input: process.stdin, output: process.stdout });
      token = (await rl.question("Paste your bearer token: ")).trim();
      rl.close();
      if (!token) throw new Error("No token provided");
    }

    writeStoredConfig({
      token,
      baseUrl,
      version,
    });

    console.log(`Logged in. Config saved to ${CONFIG_FILE}`);
    console.log("\nDisplaying full capability overview:\n");
    printEverything(version);
  });

program
  .command("versions")
  .description("List available OpenAPI versions")
  .action(() => {
    const latest = getLatestVersion();
    for (const version of getAvailableVersions()) {
      console.log(`${version}${version === latest ? " (latest)" : ""}`);
    }
  });

program
  .command("capabilities")
  .description("Show grouped operation overview and version diff")
  .option("-v, --version <version>", "Spec version", getLatestVersion())
  .action((opts) => {
    printEverything(opts.version);
  });

program
  .command("everything")
  .description("Display the full endpoint overview (same as capabilities)")
  .option("-v, --version <version>", "Spec version", getLatestVersion())
  .action((opts) => {
    printEverything(opts.version);
  });

program
  .command("new-endpoints")
  .description("Show endpoints that are new in the latest spec compared to the earliest available spec")
  .action(() => {
    const versions = getAvailableVersions();
    if (versions.length < 2) {
      console.log("Need at least two spec versions to calculate a diff.");
      return;
    }

    const base = versions[0];
    const latest = versions[versions.length - 1];
    const diff = getVersionDiff(base, latest);

    console.log(`Base: ${base}`);
    console.log(`Latest: ${latest}`);
    console.log(`Added: ${diff.added.length}`);
    for (const op of diff.added) {
      console.log(`+ ${op.method.toUpperCase()} ${op.path} :: ${op.summary}`);
    }

    console.log(`Removed: ${diff.removed.length}`);
    for (const op of diff.removed) {
      console.log(`- ${op.method.toUpperCase()} ${op.path} :: ${op.summary}`);
    }
  });

program
  .command("operations")
  .description("List operation keys")
  .option("-v, --version <version>", "Spec version", getLatestVersion())
  .option("--tag <tag>", "Only show operations with this tag")
  .action((opts) => {
    const operations = getOperations(opts.version).filter((op) => !opts.tag || op.tags.includes(opts.tag));
    for (const op of operations) {
      console.log(`${op.key}\t${op.method.toUpperCase()}\t${op.path}\t${op.tags.join(",")}`);
    }
  });

program
  .command("call")
  .description("Call an operation by key")
  .argument("<operation>", "Operation key from `nomos operations`")
  .option("-v, --version <version>", "Spec version", getLatestVersion())
  .option("--base-url <url>", "Base API URL")
  .option("--token <token>", "Bearer token")
  .option("--basic <username:password>", "Basic credentials")
  .option("--path <json>", "Path params JSON object")
  .option("--query <json>", "Query params JSON object")
  .option("--body <json>", "Body JSON object")
  .option("--auth <auth>", "Auth mode: bearer|basic|none")
  .action(async (operation, opts) => {
    const sdk = sdkFromOptions(opts);
    const result = await sdk.call(operation, {
      path: parseJsonObject(opts.path) as Record<string, string | number> | undefined,
      query: parseJsonObject(opts.query) as Record<string, string | number | boolean | Array<string | number | boolean>> | undefined,
      body: parseJsonObject(opts.body),
      auth: opts.auth,
    });
    printResponse(result);
  });

program
  .command("oauth-token")
  .description("Convenience helper for POST /oauth/token")
  .requiredOption("--client-id <id>", "OAuth client id")
  .requiredOption("--client-secret <secret>", "OAuth client secret")
  .requiredOption("--grant-type <grantType>", "authorization_code|refresh_token|client_credentials")
  .option("--code <code>", "Authorization code")
  .option("--refresh-token <token>", "Refresh token")
  .option("--scope <scope>", "Scopes (space separated)")
  .option("--code-verifier <codeVerifier>", "PKCE code verifier")
  .option("--version <version>", "Spec version", getLatestVersion())
  .option("--base-url <url>", "Base API URL")
  .action(async (opts) => {
    const sdk = new NomosSDK({
      baseUrl: opts.baseUrl,
      specVersion: opts.version,
      basicAuth: { username: opts.clientId, password: opts.clientSecret },
    });

    const body: Record<string, string> = { grant_type: opts.grantType };
    if (opts.code) body.code = opts.code;
    if (opts.refreshToken) body.refresh_token = opts.refreshToken;
    if (opts.scope) body.scope = opts.scope;
    if (opts.codeVerifier) body.code_verifier = opts.codeVerifier;

    const result = await sdk.call("post-oauth-token", {
      body,
      auth: "basic",
    });
    printResponse(result);
  });

const gridFeeReductions = program
  .command("grid-fee-reductions")
  .description("Edison grid fee reductions endpoints");

gridFeeReductions
  .command("list")
  .description("GET /grid-fee-reductions")
  .option("--version <version>", "Spec version", getLatestVersion())
  .option("--base-url <url>", "Base API URL")
  .option("--token <token>", "Bearer token")
  .option("--basic <username:password>", "Basic credentials")
  .option("--query <json>", "Query params JSON object")
  .action(async (opts) => {
    const sdk = sdkFromOptions(opts);
    const result = await sdk.call("get-grid-fee-reductions", {
      query: parseJsonObject(opts.query) as Record<string, string | number | boolean | Array<string | number | boolean>> | undefined,
    });
    printResponse(result);
  });

gridFeeReductions
  .command("get")
  .description("GET /grid-fee-reductions/{id}")
  .requiredOption("--id <id>", "Grid fee reduction id")
  .option("--version <version>", "Spec version", getLatestVersion())
  .option("--base-url <url>", "Base API URL")
  .option("--token <token>", "Bearer token")
  .option("--basic <username:password>", "Basic credentials")
  .action(async (opts) => {
    const sdk = sdkFromOptions(opts);
    const result = await sdk.call("get-grid-fee-reductions-by-id", {
      path: { id: opts.id },
    });
    printResponse(result);
  });

gridFeeReductions
  .command("create")
  .description("POST /grid-fee-reductions")
  .requiredOption("--body <json>", "Body JSON object")
  .option("--version <version>", "Spec version", getLatestVersion())
  .option("--base-url <url>", "Base API URL")
  .option("--token <token>", "Bearer token")
  .option("--basic <username:password>", "Basic credentials")
  .action(async (opts) => {
    const sdk = sdkFromOptions(opts);
    const result = await sdk.call("post-grid-fee-reductions", {
      body: parseJsonObject(opts.body),
    });
    printResponse(result);
  });

const meterOrders = program
  .command("meter-orders")
  .description("Edison meter orders endpoints");

meterOrders
  .command("list")
  .description("GET /meter-orders")
  .option("--version <version>", "Spec version", getLatestVersion())
  .option("--base-url <url>", "Base API URL")
  .option("--token <token>", "Bearer token")
  .option("--basic <username:password>", "Basic credentials")
  .option("--query <json>", "Query params JSON object")
  .action(async (opts) => {
    const sdk = sdkFromOptions(opts);
    const result = await sdk.call("get-meter-orders", {
      query: parseJsonObject(opts.query) as Record<string, string | number | boolean | Array<string | number | boolean>> | undefined,
    });
    printResponse(result);
  });

meterOrders
  .command("get")
  .description("GET /meter-orders/{id}")
  .requiredOption("--id <id>", "Meter order id")
  .option("--version <version>", "Spec version", getLatestVersion())
  .option("--base-url <url>", "Base API URL")
  .option("--token <token>", "Bearer token")
  .option("--basic <username:password>", "Basic credentials")
  .action(async (opts) => {
    const sdk = sdkFromOptions(opts);
    const result = await sdk.call("get-meter-orders-by-id", {
      path: { id: opts.id },
    });
    printResponse(result);
  });

meterOrders
  .command("create")
  .description("POST /meter-orders")
  .requiredOption("--body <json>", "Body JSON object")
  .option("--version <version>", "Spec version", getLatestVersion())
  .option("--base-url <url>", "Base API URL")
  .option("--token <token>", "Bearer token")
  .option("--basic <username:password>", "Basic credentials")
  .action(async (opts) => {
    const sdk = sdkFromOptions(opts);
    const result = await sdk.call("post-meter-orders", {
      body: parseJsonObject(opts.body),
    });
    printResponse(result);
  });

if (process.argv.length <= 2) {
  program.outputHelp();
  process.exit(0);
}

program.parseAsync(process.argv).catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(msg);
  process.exit(1);
});
