import { describe, test, expect, beforeAll } from "bun:test";
import { NomosSDK } from "../../src/sdk";
import { $ } from "bun";

const SANDBOX_URL = "https://api.sandbox.nomos.energy";

async function getSandboxToken(): Promise<string | undefined> {
  return process.env.NOMOS_SANDBOX_TOKEN;
}

describe("API Integration - Sandbox", () => {
  let token: string | undefined;

  beforeAll(async () => {
    token = await getSandboxToken();
  });

  test.skipIf(!token)("should list subscriptions", async () => {
    const sdk = new NomosSDK({
      baseUrl: SANDBOX_URL,
      bearerToken: token!,
      specVersion: "2026-01-29.edison",
    });

    const result = await sdk.call("get-subscriptions");
    expect(result.status).toBe(200);
    expect(Array.isArray(result.data)).toBe(true);
  });

  test.skipIf(!token)("should get grid-fee-reductions", async () => {
    const sdk = new NomosSDK({
      baseUrl: SANDBOX_URL,
      bearerToken: token!,
      specVersion: "2026-01-29.edison",
    });

    const result = await sdk.call("get-grid-fee-reductions");
    expect(result.status).toBe(200);
  });

  test.skipIf(!token)("CLI should call sandbox API", async () => {
    const result = await $`bun ./src/cli.ts call get-subscriptions --token ${token} --base-url ${SANDBOX_URL}`.text();
    expect(result).toContain("HTTP 200");
  });
});

describe("API Integration - Live (requires token)", () => {
  test.skipIf(!process.env.NOMOS_TOKEN)("should authenticate and call API", async () => {
    const sdk = new NomosSDK({
      bearerToken: process.env.NOMOS_TOKEN!,
    });

    const result = await sdk.call("get-subscriptions");
    expect(result.status).toBe(200);
  });
});
