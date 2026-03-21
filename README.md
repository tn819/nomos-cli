```
          ---- ---           ----       ---    ---    ------    .----    ----    ------     .-----.
        ----- .---         -----        ----   ---  ----------  -----   -----  ----------  ---------
      ----.-  .---       ----..         -.---- --- ----     --- ---.-.  --.-- --..     --- ---..  .
    ---.-.    .---     ---.-.           ----.--.-- .-.      ------..-- --.--- --.      --.---------.
  -----.      .--.   -----.             --- .--.-- .---     --.---- --.-- --. .--.     ---     .----
----.-        .--- ----.-               -.-   ----  ----------. ---  ---- ---  --------.- .---------
--.-           --- --.-                 ---    --.    .-.---.   .-.  --.  ---    ------     -----..
  ⚡  CLI for Nomos Energy API  ·  nomos.energy
```

[![npm](https://img.shields.io/npm/v/nomos-sdk-cli.svg)](https://www.npmjs.com/package/nomos-sdk-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![CI](https://github.com/tn819/nomos-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/tn819/nomos-cli/actions)

> TypeScript SDK and CLI for the Nomos Energy API. Generated from OpenAPI specs with full type safety.

---

## Overview

The Nomos SDK provides a type-safe TypeScript client and CLI for interacting with the Nomos Energy API. It supports three core workflows:

- **Checkout** - Browse plans, get quotes, create subscriptions
- **Invoice Explanation** - View bills, consumption data, PDF downloads  
- **Smart Meter Orders** - Order and track smart meter installations

---

## Quick Start

```bash
# Install
bun install

# Build
bun run build

# Login and explore
nomos login --token "$NOMOS_TOKEN"
nomos capabilities
```

---

## CLI Usage

### Help & Discovery

```bash
nomos --version        # Show version
nomos help             # Show help with ASCII logo
nomos versions         # List available API versions
nomos capabilities     # Full capability overview
nomos new-endpoints    # Show newly added endpoints
nomos operations       # List all operation keys
```

### Authentication

```bash
nomos login --token "$NOMOS_TOKEN"
nomos login --client-id "$NOMOS_CLIENT_ID" --client-secret "$NOMOS_CLIENT_SECRET"
```

### Checkout Flow

```bash
nomos call get-plans
nomos call get-plans-by-id-quote --path '{"id":"plan_123"}' --query '{"annualConsumption":4500}'
nomos call post-subscriptions --set planId=plan_123 --set customer.email=test@example.com
```

### Invoice & Consumption

```bash
nomos call get-subscriptions-by-id-invoices --path '{"id":"sub_123"}'
nomos call get-invoices-by-id --path '{"id":"inv_456"}'
nomos call get-subscriptions-by-id-consumption --path '{"id":"sub_123"}'
```

### Smart Meter Orders

```bash
nomos meter-orders list
nomos meter-orders get --id mo_123
nomos meter-orders create --set subscriptionId=sub_123
```

---

## SDK Usage

```typescript
import { NomosSDK } from "nomos-sdk-cli";

const sdk = new NomosSDK({
  bearerToken: process.env.NOMOS_TOKEN,
  specVersion: "2026-01-29.edison",
});

// Get plans
const plans = await sdk.call("get-plans");

// Create subscription
const subscription = await sdk.call("post-subscriptions", {
  body: { planId: "plan_123", customer: { email: "test@example.com" } }
});

// Get invoice
const invoice = await sdk.call("get-invoices-by-id", { path: { id: "inv_456" } });
```

---

## Installation

### Global

```bash
npm install -g nomos-sdk-cli
nomos login --token "$NOMOS_TOKEN"
```

### Development

```bash
git clone https://github.com/tn819/nomos-cli.git
cd nomos-cli
bun install
bun run build
bun run test:all
```

---

## Scripts

| Script | Description |
|--------|-------------|
| `bun run build` | Build single-file CLI |
| `bun run dev` | Run CLI in dev mode |
| `bun run test` | Run all tests |
| `bun run lint` | Run ESLint |
| `bun run capabilities` | Show capabilities |

---

## API Versions

| Version | Paths | Operations |
|---------|-------|------------|
| `2025-12-16.batman` | 23 | 26 |
| `2026-01-29.edison` | 27 | 32 |

New in Edison: Grid fee reductions, Smart meter ordering

---

## Documentation

- **[JOURNEY.md](JOURNEY.md)** - Buyer journey workflows
- **[examples/](examples/)** - Runnable examples
- **[API Docs](https://docs.nomos.energy)** - Official API documentation

---

## Requirements

- Bun 1.2+ (development)
- Node.js 18+ (production)
- Nomos API token

---

## License

ISC
