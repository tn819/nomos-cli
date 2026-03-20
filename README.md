# Nomos SDK + CLI

TypeScript SDK and CLI for the Nomos API, generated from published OpenAPI specs.

## API Overview

Source specs:
- `specs/openapi.2025-12-16.batman.json` (23 paths, 26 operations)
- `specs/openapi.2026-01-29.edison.json` (27 paths, 32 operations)

New operations in `2026-01-29.edison` compared to `2025-12-16.batman`:
- `GET /grid-fee-reductions`
- `POST /grid-fee-reductions`
- `GET /grid-fee-reductions/{id}`
- `GET /meter-orders`
- `POST /meter-orders`
- `GET /meter-orders/{id}`

Everything else from Batman remains available.

## Install

```bash
npm install
npm run generate
npm run build
```

## CLI

Build first, then run with `nomos`.

```bash
# Quick flow
nomos help
nomos login

# List versions
nomos versions

# Full capability overview with grouped operations and diff
nomos capabilities

# Only endpoints added in latest version
nomos new-endpoints

# List operation keys
nomos operations

# Example: get subscriptions
nomos call get-subscriptions --token "$NOMOS_TOKEN"

# Example: get one subscription
nomos call get-subscriptions-by-id --token "$NOMOS_TOKEN" --path '{"id":"sub_123"}'

# Optional non-interactive login
nomos login --token "$NOMOS_TOKEN"
nomos login --client-id "$NOMOS_CLIENT_ID" --client-secret "$NOMOS_CLIENT_SECRET"

# Edison-specific helpers
nomos grid-fee-reductions list --token "$NOMOS_TOKEN"
nomos grid-fee-reductions get --id gfr_123 --token "$NOMOS_TOKEN"
nomos grid-fee-reductions create --token "$NOMOS_TOKEN" --body '{"subscriptionId":"sub_123"}'

nomos meter-orders list --token "$NOMOS_TOKEN"
nomos meter-orders get --id mo_123 --token "$NOMOS_TOKEN"
nomos meter-orders create --token "$NOMOS_TOKEN" --body '{"subscriptionId":"sub_123"}'
```

## SDK

```ts
import { NomosSDK } from "./dist/index.js";

const sdk = new NomosSDK({
  bearerToken: process.env.NOMOS_TOKEN,
  specVersion: "2026-01-29.edison",
});

const operations = sdk.listOperations();
console.log(operations.map((o) => o.key));

const result = await sdk.call("get-subscriptions");
console.log(result.status, result.data);
```

## How it works

- Specs are stored in `specs/`
- `npm run generate` reads specs and writes `src/generated/operations.json`
- SDK and CLI read that generated operations catalog

To refresh specs from Nomos and regenerate operations:

```bash
npm run sync
```
