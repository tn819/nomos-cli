# Examples

This directory contains runnable examples demonstrating the three core use cases of the Nomos SDK.

## Prerequisites

All examples require a Nomos API token:

```bash
export NOMOS_TOKEN="your-api-token"
```

Optionally, use the sandbox environment:

```bash
export NOMOS_BASE_URL="https://api.sandbox.nomos.energy"
export NOMOS_TOKEN="your-sandbox-token"
```

## Available Examples

### 1. Checkout Workflow

Demonstrates the complete customer checkout flow:
- List available energy plans
- Get pricing quote
- Create a lead
- Create subscription

```bash
bun examples/checkout.ts
```

### 2. Invoice Explanation

Shows how to explain an invoice with full context:
- List subscriptions
- Get invoices
- Fetch consumption data
- Get meter readings
- Price breakdown

```bash
# List invoices for first subscription
bun examples/invoice-explanation.ts

# Or specify a subscription
bun examples/invoice-explanation.ts sub_123
```

### 3. Smart Meter Order

Smart meter ordering and tracking:
- Check existing orders
- Create new meter order
- Track order status

```bash
# Create order (standalone)
bun examples/meter-order.ts

# Create order for specific subscription
bun examples/meter-order.ts sub_123
```

## Running Examples

All examples are self-contained TypeScript files that can be run directly with Bun:

```bash
# Checkout flow
bun examples/checkout.ts

# Invoice explanation
bun examples/invoice-explanation.ts

# Meter order
bun examples/meter-order.ts
```

## Example Output

Each example provides:
- Step-by-step progress logging
- Clear success/error messages
- Next step suggestions
- Relevant CLI commands for follow-up actions

## Customizing Examples

Feel free to modify the example files to test different scenarios:

```typescript
// Change plan ID
const planId = "your-plan-id";

// Modify customer data
const customer = {
  email: "your@email.com",
  firstName: "Your",
  lastName: "Name"
};

// Adjust consumption
const annualConsumption = 3500; // kWh
```

## Learning Path

1. Start with `checkout.ts` to understand the subscription creation flow
2. Use `invoice-explanation.ts` to see how billing data is retrieved
3. Try `meter-order.ts` for smart meter integration

## See Also

- [JOURNEY.md](../JOURNEY.md) - Complete buyer journey documentation
- [README.md](../README.md) - CLI and SDK reference
