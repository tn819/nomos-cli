# Nomos SDK + CLI

TypeScript SDK and CLI for the Nomos API, generated from published OpenAPI specs.

## Top 3 Use Cases

This SDK is designed around three core customer journeys:

1. **[Checkout](JOURNEY.md#use-case-1-checkout)** - Browse plans, get quotes, create subscriptions
2. **[Invoice Explanation](JOURNEY.md#use-case-2-explaining-the-invoice)** - View bills, consumption data, PDF downloads
3. **[Smart Meter Order](JOURNEY.md#use-case-3-smart-meter-order-journey)** - Order and track smart meter installations

See [JOURNEY.md](JOURNEY.md) for complete buyer journey documentation and [examples/](examples/) for runnable examples.

## Quick Start

```bash
# Install dependencies
bun install

# Build the CLI
bun run build

# Login and explore
nomos login --token "$NOMOS_TOKEN"
nomos capabilities
```

## API Overview

Source specs:
- `specs/openapi.2025-12-16.batman.json` (23 paths, 26 operations)
- `specs/openapi.2026-01-29.edison.json` (27 paths, 32 operations)

New in Edison:
- Grid fee reductions endpoints
- Smart meter order endpoints

## CLI Usage

### Core Commands

```bash
# Help and discovery
nomos help
nomos versions
nomos capabilities
nomos new-endpoints
nomos operations

# Authentication
nomos login --token "$NOMOS_TOKEN"
nomos login --client-id "$NOMOS_CLIENT_ID" --client-secret "$NOMOS_CLIENT_SECRET"

# Use cases - Checkout
nomos call get-plans
nomos call get-plans-by-id-quote --path '{"id":"plan_123"}' --query '{"annualConsumption":4500}'
nomos call post-leads --body '{"email":"test@example.com","firstName":"Test","lastName":"User"}'
nomos call post-subscriptions --body '{"planId":"plan_123","customer":{"email":"test@example.com"}}'

# Use cases - Invoice Explanation
nomos call get-subscriptions-by-id-invoices --path '{"id":"sub_123"}'
nomos call get-invoices-by-id --path '{"id":"inv_456"}'
nomos call get-invoices-by-id-file --path '{"id":"inv_456"}' > invoice.pdf
nomos call get-subscriptions-by-id-consumption --path '{"id":"sub_123"}'

# Use cases - Smart Meter Order
nomos meter-orders list
nomos meter-orders get --id mo_123
nomos meter-orders create --body '{"subscriptionId":"sub_123","meterType":"smart"}'

# Generic API call
nomos call get-subscriptions --token "$NOMOS_TOKEN"
nomos call get-subscriptions-by-id --token "$NOMOS_TOKEN" --path '{"id":"sub_123"}'
```

## SDK Usage

### TypeScript

```typescript
import { NomosSDK } from "nomos-sdk-cli";

const sdk = new NomosSDK({
  bearerToken: process.env.NOMOS_TOKEN,
  specVersion: "2026-01-29.edison",
});

// Checkout: Get plans and create subscription
const plans = await sdk.call("get-plans");
const quote = await sdk.call("get-plans-by-id-quote", {
  path: { id: "plan_123" },
  query: { annualConsumption: 4500 }
});
const subscription = await sdk.call("post-subscriptions", {
  body: { planId: "plan_123", customer: { email: "test@example.com" } }
});

// Invoice: Get invoice details with consumption
const invoice = await sdk.call("get-invoices-by-id", { path: { id: "inv_456" } });
const consumption = await sdk.call("get-subscriptions-by-id-consumption", {
  path: { id: "sub_123" },
  query: { startDate: "2024-01-01", endDate: "2024-01-31" }
});

// Meter Order: Create and track
const order = await sdk.call("post-meter-orders", {
  body: { subscriptionId: "sub_123", meterType: "smart" }
});
const status = await sdk.call("get-meter-orders-by-id", { path: { id: order.data.id } });
```

See [examples/](examples/) for complete runnable examples of all three use cases.

## Installation

### Global Install

```bash
npm install -g nomos-sdk-cli
nomos login --token "$NOMOS_TOKEN"
```

### Development

```bash
# Clone and setup
git clone https://github.com/tn819/nomos-cli.git
cd nomos-cli
bun install

# Build
bun run build

# Run tests
bun run test:all

# Run examples
export NOMOS_TOKEN="your-token"
bun examples/checkout.ts
```

## Available Scripts

```bash
# Development
bun run dev              # Run CLI in dev mode
bun run build            # Build single-file CLI

# Testing
bun run test             # Run all tests
bun run test:unit        # Unit tests
bun run test:e2e         # E2E tests
bun run test:shell       # Shell integration tests
bun run test:all         # Everything + build

# API
bun run capabilities     # Show capabilities
bun run generate         # Generate operations from specs
bun run sync             # Refresh specs from Nomos
```

## How It Works

- Specs are stored in `specs/`
- `bun run generate` reads specs and writes `src/generated/operations.json`
- SDK and CLI read the generated operations catalog
- Bun provides native TypeScript support and fast bundling

## Documentation

- **[JOURNEY.md](JOURNEY.md)** - Complete buyer journey and use case workflows
- **[examples/](examples/)** - Runnable examples for all three use cases
- **[tests/](tests/)** - Test suite (unit, e2e, integration)

## Requirements

- [Bun](https://bun.sh/) 1.2+ (for development)
- Node.js 18+ (for built CLI)
- Nomos API token

## License

ISC
