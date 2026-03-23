# SDK Reference

The Nomos SDK provides a TypeScript interface to the Nomos Energy API.

## Installation

```bash
npm install nomos-sdk-cli
```

## Basic Usage

```typescript
import { NomosSDK } from "nomos-sdk-cli";

const sdk = new NomosSDK({
  bearerToken: process.env.NOMOS_TOKEN,
  specVersion: "2026-01-29.edison", // optional, defaults to latest
});

// Call any operation by key
const result = await sdk.call("get-plans");
console.log(result.data);
```

## Configuration

### NomosSdkOptions

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `bearerToken` | `string` | No | Bearer token for authentication |
| `basicAuth` | `{ username: string; password: string }` | No | OAuth client credentials |
| `baseUrl` | `string` | No | API base URL (default: `https://api.nomos.energy`) |
| `specVersion` | `string` | No | OpenAPI spec version |
| `defaultHeaders` | `Record<string, string>` | No | Additional headers |

## SDK Methods

### `call(operationKey, input?)`

Execute an API operation by its key.

```typescript
async call(
  key: string,
  input?: CallInput
): Promise<{ status: number; headers: Headers; data: unknown }>
```

**Parameters:**
- `key` — Operation key (e.g., `"get-plans"`, `"post-subscriptions"`)
- `input` — Optional request configuration

**Returns:**
- `status` — HTTP status code
- `headers` — Response headers
- `data` — Response body (parsed JSON, Buffer for PDF, or text)

### `listOperations()`

Get all available operations for the configured spec version.

```typescript
listOperations(): OperationDefinition[]
```

### `getOperation(key)`

Get details for a specific operation.

```typescript
getOperation(key: string): OperationDefinition
```

Throws if the operation key is unknown.

## CallInput

| Property | Type | Description |
|----------|------|-------------|
| `path` | `Record<string, string \| number>` | URL path parameters |
| `query` | `Record<string, ...>` | Query string parameters |
| `body` | `unknown` | Request body (JSON-serialized) |
| `headers` | `Record<string, string>` | Additional headers |
| `auth` | `"bearer" \| "basic" \| "none"` | Override auth mode |

## OperationDefinition

| Property | Type | Description |
|----------|------|-------------|
| `key` | `string` | Unique operation identifier |
| `method` | `"get" \| "post" \| "put" \| "patch" \| "delete"` | HTTP method |
| `path` | `string` | URL path template |
| `summary` | `string` | Human-readable description |
| `tags` | `string[]` | Category tags |
| `security` | `("bearer" \| "basic" \| "none")[]` | Supported auth methods |
| `specVersion` | `string` | Source spec version |

## Full API Reference

For complete type documentation, see:
- [NomosSDK Class](/sdk/nomos-sdk)
- [Types](/sdk/types)
- [Operations Catalog](/sdk/operations)
