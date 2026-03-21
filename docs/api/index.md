# API Reference

The Nomos API is documented using OpenAPI specifications.

## Available Versions

| Version | Date | Paths | Operations | Notes |
|---------|------|-------|------------|-------|
| Edison | 2026-01-29 | 27 | 32 | Latest — includes grid fee reductions and meter orders |
| Batman | 2025-12-16 | 23 | 26 | Previous stable version |

## Interactive Documentation

View the interactive OpenAPI documentation:

<div class="api-links">
  <a href="./openapi.html" class="VPButton medium brand">View OpenAPI Docs (Latest)</a>
</div>

## Spec Files

The OpenAPI specifications are stored in the `specs/` directory:

- `specs/openapi.latest.json` — Always points to the latest version
- `specs/openapi.2026-01-29.edison.json` — Edison release
- `specs/openapi.2025-12-29.batman.json` — Batman release

## SDK/CLI Generation

Both the SDK and CLI are generated from these specifications:

1. Specs are synced from Nomos using `bun run sync`
2. Operations are extracted using `bun run generate`
3. The resulting catalog is used by both SDK and CLI

## What's New in Edison

New endpoints added in the 2026-01-29 Edison release:

### Grid Fee Reductions
- `GET /grid-fee-reductions` — List grid fee reductions
- `GET /grid-fee-reductions/{id}` — Get a specific reduction
- `POST /grid-fee-reductions` — Create a new reduction

### Meter Orders
- `GET /meter-orders` — List meter orders
- `GET /meter-orders/{id}` — Get a specific order
- `POST /meter-orders` — Create a new order

See `nomos new-endpoints` for a complete diff between versions.
