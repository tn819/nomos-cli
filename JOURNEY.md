# Developer Buyer Journey

This guide walks through how a developer on the customer side uses the Nomos CLI/SDK to implement the three core use cases.

## Overview

Your integration journey will follow this pattern:
1. **Discovery** - Explore available operations
2. **Authentication** - Set up credentials
3. **Development** - Implement use cases
4. **Testing** - Validate in sandbox
5. **Production** - Go live

---

## Use Case 1: Checkout

**Goal:** Allow customers to browse plans, get quotes, and subscribe.

### API Operations Mapping

| Step | Operation | Purpose |
|------|-----------|---------|
| 1 | `get-plans` | List available energy plans |
| 2 | `get-plans-by-id` | Show plan details |
| 3 | `get-plans-by-id-quote` | Calculate pricing quote |
| 4 | `post-leads` | Capture lead (optional) |
| 5 | `post-subscriptions` | Create subscription |
| 6 | `get-subscriptions-by-id` | Confirm subscription created |

### CLI Workflow

```bash
# Step 1: Login first
nomos login --token "$NOMOS_TOKEN"

# Step 2: Discover available plans
nomos call get-plans

# Step 3: Get quote for a specific plan
nomos call get-plans-by-id-quote \
  --path '{"id":"plan_123"}' \
  --query '{"annualConsumption":4500}'

# Step 4: Create a lead (optional, for tracking)
nomos call post-leads \
  --body '{
    "email": "customer@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "planId": "plan_123"
  }'

# Step 5: Create subscription
nomos call post-subscriptions \
  --body '{
    "planId": "plan_123",
    "customer": {
      "email": "customer@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "meteringPointId": "DE123456789012345678"
  }'

# Step 6: Verify subscription
nomos call get-subscriptions-by-id \
  --path '{"id":"sub_123"}'
```

### SDK Implementation

```typescript
import { NomosSDK } from "nomos-sdk-cli";

const sdk = new NomosSDK({
  bearerToken: process.env.NOMOS_TOKEN,
});

// Checkout flow
async function checkout(customerData: CustomerData, planId: string) {
  // 1. Get plan details
  const plan = await sdk.call("get-plans-by-id", {
    path: { id: planId }
  });

  // 2. Get quote
  const quote = await sdk.call("get-plans-by-id-quote", {
    path: { id: planId },
    query: { annualConsumption: customerData.consumption }
  });

  // 3. Create lead for tracking
  const lead = await sdk.call("post-leads", {
    body: {
      email: customerData.email,
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      planId: planId
    }
  });

  // 4. Create subscription
  const subscription = await sdk.call("post-subscriptions", {
    body: {
      planId: planId,
      leadId: lead.data.id,
      customer: customerData,
      meteringPointId: customerData.meteringPointId
    }
  });

  return subscription.data;
}
```

---

## Use Case 2: Explaining the Invoice

**Goal:** Help customers understand their energy bills with consumption data and PDF downloads.

### API Operations Mapping

| Step | Operation | Purpose |
|------|-----------|---------|
| 1 | `get-subscriptions` | List customer's subscriptions |
| 2 | `get-subscriptions-by-id-invoices` | Get invoices for subscription |
| 3 | `get-invoices-by-id` | Get invoice details |
| 4 | `get-invoices-by-id-file` | Download PDF |
| 5 | `get-subscriptions-by-id-consumption` | Get consumption data |
| 6 | `get-subscriptions-by-id-meter-readings` | View meter readings |
| 7 | `get-subscriptions-by-id-prices` | Get price breakdown |

### CLI Workflow

```bash
# Step 1: Get customer's subscriptions
nomos call get-subscriptions

# Step 2: Get invoices for a subscription
nomos call get-subscriptions-by-id-invoices \
  --path '{"id":"sub_123"}'

# Step 3: Get specific invoice details
nomos call get-invoices-by-id \
  --path '{"id":"inv_456"}'

# Step 4: Download invoice PDF
nomos call get-invoices-by-id-file \
  --path '{"id":"inv_456"}' > invoice.pdf

# Step 5: Get consumption data for the period
nomos call get-subscriptions-by-id-consumption \
  --path '{"id":"sub_123"}' \
  --query '{"startDate":"2024-01-01","endDate":"2024-01-31"}'

# Step 6: View meter readings
nomos call get-subscriptions-by-id-meter-readings \
  --path '{"id":"sub_123"}'

# Step 7: Get price time series
nomos call get-subscriptions-by-id-prices \
  --path '{"id":"sub_123"}' \
  --query '{"startDate":"2024-01-01","endDate":"2024-01-31"}'
```

### SDK Implementation

```typescript
// Invoice explanation flow
async function explainInvoice(subscriptionId: string, invoiceId: string) {
  // 1. Get invoice details
  const invoice = await sdk.call("get-invoices-by-id", {
    path: { id: invoiceId }
  });

  // 2. Get PDF
  const pdfResponse = await sdk.call("get-invoices-by-id-file", {
    path: { id: invoiceId }
  });
  // pdfResponse.data is Buffer - save to file

  // 3. Get consumption for invoice period
  const consumption = await sdk.call("get-subscriptions-by-id-consumption", {
    path: { id: subscriptionId },
    query: {
      startDate: invoice.data.periodStart,
      endDate: invoice.data.periodEnd
    }
  });

  // 4. Get price breakdown
  const prices = await sdk.call("get-subscriptions-by-id-prices", {
    path: { id: subscriptionId },
    query: {
      startDate: invoice.data.periodStart,
      endDate: invoice.data.periodEnd
    }
  });

  // 5. Get meter readings
  const readings = await sdk.call("get-subscriptions-by-id-meter-readings", {
    path: { id: subscriptionId }
  });

  return {
    invoice: invoice.data,
    consumption: consumption.data,
    prices: prices.data,
    readings: readings.data
  };
}
```

---

## Use Case 3: Smart Meter Order Journey

**Goal:** Order smart meters and track installation status.

### API Operations Mapping

| Step | Operation | Purpose |
|------|-----------|---------|
| 1 | `get-meter-orders` | Check existing orders |
| 2 | `post-meter-orders` | Create new meter order |
| 3 | `get-meter-orders-by-id` | Track order status |
| 4 | `get-subscriptions-by-id` | Verify subscription |

### CLI Workflow (Edison-specific helpers)

```bash
# Option 1: Use Edison-specific helpers
nomos meter-orders list --token "$NOMOS_TOKEN"
nomos meter-orders get --id mo_123 --token "$NOMOS_TOKEN"
nomos meter-orders create --token "$NOMOS_TOKEN" \
  --body '{
    "subscriptionId": "sub_123",
    "meterType": "smart",
    "installationAddress": {
      "street": "Musterstraße 1",
      "zip": "12345",
      "city": "Berlin"
    }
  }'

# Option 2: Use generic call operation
nomos call get-meter-orders --token "$NOMOS_TOKEN"
nomos call post-meter-orders \
  --token "$NOMOS_TOKEN" \
  --body '{
    "subscriptionId": "sub_123",
    "meterType": "smart"
  }'
```

### SDK Implementation

```typescript
// Smart meter order journey
async function orderSmartMeter(subscriptionId: string, address: Address) {
  // 1. Check existing orders
  const existingOrders = await sdk.call("get-meter-orders");
  
  // 2. Create meter order
  const order = await sdk.call("post-meter-orders", {
    body: {
      subscriptionId: subscriptionId,
      meterType: "smart",
      installationAddress: address,
      preferredDate: "2024-03-15"
    }
  });

  return order.data;
}

// Track order status
async function trackMeterOrder(orderId: string) {
  const order = await sdk.call("get-meter-orders-by-id", {
    path: { id: orderId }
  });

  return {
    status: order.data.status, // pending, scheduled, installed, etc.
    scheduledDate: order.data.scheduledDate,
    technician: order.data.technician
  };
}
```

---

## Developer Journey Steps

### 1. Initial Setup

```bash
# Install the CLI globally
npm install -g nomos-sdk-cli

# Or use directly with npx
npx nomos-sdk-cli help

# Login with your credentials
nomos login --token "$NOMOS_TOKEN"
```

### 2. Discovery Phase

```bash
# See all available operations
nomos operations

# See capabilities overview
nomos capabilities

# See what's new in latest API version
nomos new-endpoints
```

### 3. Sandbox Testing

```bash
# Use sandbox environment
export NOMOS_BASE_URL="https://api.sandbox.nomos.energy"
nomos login --token "$NOMOS_SANDBOX_TOKEN"

# Test your use cases
nomos call get-plans
nomos call post-subscriptions --body '{...}'
```

### 4. Integration Patterns

**For Web Applications:**
```typescript
// Create an SDK instance per request
app.get('/api/plans', async (req, res) => {
  const sdk = new NomosSDK({
    bearerToken: process.env.NOMOS_TOKEN
  });
  
  const plans = await sdk.call("get-plans");
  res.json(plans.data);
});
```

**For Backend Services:**
```typescript
// Singleton SDK instance
const nomos = new NomosSDK({
  bearerToken: process.env.NOMOS_TOKEN,
  baseUrl: process.env.NOMOS_BASE_URL
});

// Reuse across requests
async function getCustomerInvoices(customerId: string) {
  return nomos.call("get-subscriptions-by-id-invoices", {
    path: { id: customerId }
  });
}
```

---

## Common Workflows

### Complete Customer Onboarding

```typescript
async function onboardCustomer(customerData: CustomerData) {
  const sdk = new NomosSDK({ bearerToken: process.env.NOMOS_TOKEN });

  // 1. Create lead
  const lead = await sdk.call("post-leads", {
    body: {
      email: customerData.email,
      firstName: customerData.firstName,
      lastName: customerData.lastName
    }
  });

  // 2. Get quote
  const quote = await sdk.call("get-plans-by-id-quote", {
    path: { id: customerData.planId },
    query: { annualConsumption: customerData.consumption }
  });

  // 3. Create subscription
  const subscription = await sdk.call("post-subscriptions", {
    body: {
      planId: customerData.planId,
      leadId: lead.data.id,
      customer: customerData,
      meteringPointId: customerData.meteringPointId
    }
  });

  // 4. Order smart meter (if needed)
  if (customerData.needsSmartMeter) {
    const meterOrder = await sdk.call("post-meter-orders", {
      body: {
        subscriptionId: subscription.data.id,
        meterType: "smart"
      }
    });
  }

  return subscription.data;
}
```

### Monthly Invoice Generation

```typescript
async function generateMonthlyInvoice(subscriptionId: string, month: string) {
  const sdk = new NomosSDK({ bearerToken: process.env.NOMOS_TOKEN });

  // 1. Get consumption
  const consumption = await sdk.call("get-subscriptions-by-id-consumption", {
    path: { id: subscriptionId },
    query: { month }
  });

  // 2. Get meter readings
  const readings = await sdk.call("get-subscriptions-by-id-meter-readings", {
    path: { id: subscriptionId },
    query: { month }
  });

  // 3. Get price breakdown
  const prices = await sdk.call("get-subscriptions-by-id-prices", {
    path: { id: subscriptionId },
    query: { month }
  });

  // 4. Get invoices
  const invoices = await sdk.call("get-subscriptions-by-id-invoices", {
    path: { id: subscriptionId }
  });

  return {
    consumption: consumption.data,
    readings: readings.data,
    prices: prices.data,
    invoices: invoices.data
  };
}
```

---

## Security Best Practices

1. **Never commit tokens** - Use environment variables
2. **Use sandbox for development** - Test against sandbox first
3. **Token rotation** - Rotate credentials regularly
4. **Minimal permissions** - Use tokens with only required scopes

---

## Troubleshooting

### Common Issues

**Authentication Error:**
```bash
# Check token is set
nomos login --token "$NOMOS_TOKEN"
```

**Unknown Operation:**
```bash
# List available operations
nomos operations | grep subscription
```

**Invalid Request Body:**
```bash
# Check operation schema
nomos call get-plans-by-id --path '{"id":"test"}' --help
```

---

## Next Steps

1. Get your sandbox credentials from Nomos
2. Run through each use case with CLI
3. Implement in your application with SDK
4. Test thoroughly in sandbox
5. Go live with production credentials

For support: Contact Nomos developer support
