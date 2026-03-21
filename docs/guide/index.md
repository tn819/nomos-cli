# Nomos SDK + CLI

TypeScript SDK and CLI for the Nomos Energy API, generated from published OpenAPI specs.

## Quick Start

::: code-group

```bash [CLI]
# Install globally
npm install -g nomos-sdk-cli

# Login and explore
nomos login --token "$NOMOS_TOKEN"
nomos capabilities
```

```typescript [SDK]
import { NomosSDK } from "nomos-sdk-cli";

const sdk = new NomosSDK({
  bearerToken: process.env.NOMOS_TOKEN,
});

const plans = await sdk.call("get-plans");
```

:::

## Features

- **TypeScript-first** — Full type safety with generated types from OpenAPI specs
- **CLI & SDK** — Use via command line or import as a library
- **Multi-version support** — Switch between API versions (Batman, Edison, etc.)
- **Authentication flexibility** — Bearer tokens or OAuth client credentials

## Use Cases

The SDK is designed around three core customer journeys:

1. **[Checkout](checkout.md)** — Browse plans, get quotes, create subscriptions
2. **[Invoice Explanation](invoice.md)** — View bills, consumption data, PDF downloads
3. **[Smart Meter Order](meter-order.md)** — Order and track smart meter installations

## Project Structure

```
specs/                    # OpenAPI specifications
├── openapi.latest.json
├── openapi.2026-01-29.edison.json
└── openapi.2025-12-16.batman.json

src/                      # Source code
├── cli.ts               # CLI implementation (Commander.js)
├── sdk.ts               # SDK implementation
├── types.ts             # TypeScript types
└── generated/           # Generated operations catalog

docs/                     # Documentation site
├── guide/               # User guides
├── sdk/                 # SDK API reference
├── cli/                 # CLI reference
└── api/                 # OpenAPI reference
```

## Next Steps

- [Installation Guide](installation.md) — Set up the SDK/CLI
- [SDK Reference](/sdk/) — API documentation
- [CLI Reference](/cli/) — Command documentation
- [API Explorer](/api/openapi) — Interactive OpenAPI docs
