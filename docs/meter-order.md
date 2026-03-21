# Smart Meter Order Use Case

Order and track smart meter installations.

## API Operations

| Step | Operation | Purpose |
|------|-----------|---------|
| 1 | `get-meter-orders` | List meter orders |
| 2 | `get-meter-orders-by-id` | Get order status |
| 3 | `post-meter-orders` | Create new meter order |

## CLI Workflow

```bash
# Step 1: List existing meter orders
nomos meter-orders list

# Step 2: Create a new meter order
nomos meter-orders create \
  --body '{
    "subscriptionId": "sub_123",
    "meterType": "smart"
  }'

# Step 3: Check order status
nomos meter-orders get --id "mo_789"
```

Or using the generic `call` command:

```bash
# Create order
nomos call post-meter-orders \
  --body '{
    "subscriptionId": "sub_123",
    "meterType": "smart"
  }'

# Get order status
nomos call get-meter-orders-by-id \
  --path '{"id":"mo_789"}'
```

## SDK Implementation

```typescript
import { NomosSDK } from "nomos-sdk-cli";

const sdk = new NomosSDK({
  bearerToken: process.env.NOMOS_TOKEN,
});

async function orderSmartMeter(subscriptionId: string) {
  // 1. Create meter order
  const order = await sdk.call("post-meter-orders", {
    body: {
      subscriptionId: subscriptionId,
      meterType: "smart"
    }
  });

  // 2. Check status
  const orderId = (order.data as { id: string }).id;
  const status = await sdk.call("get-meter-orders-by-id", {
    path: { id: orderId }
  });

  return { order, status };
}

async function listMeterOrders() {
  const orders = await sdk.call("get-meter-orders");
  return orders.data;
}
```

See the complete example in [`examples/meter-order.ts`](https://github.com/tn819/nomos-cli/blob/main/examples/meter-order.ts).
