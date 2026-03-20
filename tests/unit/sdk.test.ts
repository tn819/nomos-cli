import { describe, test, expect } from "bun:test";
import { NomosSDK } from "../../src/sdk";

describe("NomosSDK", () => {
  const mockBaseUrl = "https://api.test.nomos.energy";
  const mockToken = "test-token-123";

  test("should initialize with bearer token", () => {
    const sdk = new NomosSDK({
      baseUrl: mockBaseUrl,
      bearerToken: mockToken,
      specVersion: "2026-01-29.edison",
    });

    expect(sdk).toBeDefined();
  });

  test("should initialize with basic auth", () => {
    const sdk = new NomosSDK({
      baseUrl: mockBaseUrl,
      basicAuth: {
        username: "client-id",
        password: "client-secret",
      },
      specVersion: "2026-01-29.edison",
    });

    expect(sdk).toBeDefined();
  });

  test("should list operations for latest version", () => {
    const sdk = new NomosSDK({
      bearerToken: mockToken,
    });

    const operations = sdk.listOperations();
    expect(operations.length).toBeGreaterThan(0);
    expect(operations[0]).toHaveProperty("key");
    expect(operations[0]).toHaveProperty("method");
    expect(operations[0]).toHaveProperty("path");
  });

  test("should get operation by key", () => {
    const sdk = new NomosSDK({
      bearerToken: mockToken,
    });

    const operation = sdk.getOperation("get-subscriptions");
    expect(operation).toBeDefined();
    expect(operation?.key).toBe("get-subscriptions");
    expect(operation?.method).toBe("get");
  });

  test("should throw for unknown operation", () => {
    const sdk = new NomosSDK({
      bearerToken: mockToken,
    });

    expect(() => sdk.getOperation("unknown-operation")).toThrow("Unknown operation key: unknown-operation");
  });

  test("should support different spec versions", () => {
    const batmanSdk = new NomosSDK({
      bearerToken: mockToken,
      specVersion: "2025-12-16.batman",
    });

    const edisonSdk = new NomosSDK({
      bearerToken: mockToken,
      specVersion: "2026-01-29.edison",
    });

    const batmanOps = batmanSdk.listOperations();
    const edisonOps = edisonSdk.listOperations();

    expect(edisonOps.length).toBeGreaterThan(batmanOps.length);
  });
});
