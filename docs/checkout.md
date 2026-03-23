# Checkout Use Case

Allow customers to browse energy plans, get pricing quotes, and create subscriptions.

## API Operations

| Step | Operation | Purpose |
|------|-----------|---------|
| 1 | `get-plans` | List available energy plans |
| 2 | `get-plans-by-id` | Show plan details |
| 3 | `get-plans-by-id-quote` | Calculate pricing quote |
| 4 | `post-leads` | Capture lead (optional) |
| 5 | `post-subscriptions` | Create subscription |
| 6 | `get-subscriptions-by-id` | Confirm subscription created |

## CLI Workflow

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

## SDK Implementation

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
      customer: {
        email: customerData.email,
        firstName: customerData.firstName,
        lastName: customerData.lastName
      },
      meteringPointId: customerData.meteringPointId
    }
  });

  return subscription;
}
```

See the complete example in [`examples/checkout.ts`](https://github.com/tn819/nomos-cli/blob/main/examples/checkout.ts).
