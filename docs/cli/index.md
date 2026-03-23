# CLI Reference

The `nomos` CLI provides command-line access to the Nomos Energy API.

## Installation

```bash
npm install -g nomos-sdk-cli
```

## Global Options

All commands support these options:

| Option | Description |
|--------|-------------|
| `--version` | Show version number |
| `--help` | Show help |

## Authentication

The CLI supports two authentication methods:

### Bearer Token

```bash
nomos login --token "your-token-here"
```

### OAuth Client Credentials

```bash
nomos login --client-id "your-client-id" --client-secret "your-client-secret"
```

Credentials are stored in `~/.nomos/config.json` with 0600 permissions.

## Commands

### Discovery

- `nomos help` — Display help
- `nomos versions` — List available OpenAPI versions
- `nomos capabilities` — Show grouped operation overview
- `nomos everything` — Display full endpoint overview
- `nomos new-endpoints` — Show new endpoints in latest spec
- `nomos operations` — List operation keys

### API Calls

- `nomos call <operation>` — Call an operation by key
- `nomos oauth-token` — Helper for POST /oauth/token

### Resource Commands

- `nomos grid-fee-reductions list` — GET /grid-fee-reductions
- `nomos grid-fee-reductions get --id <id>` — GET /grid-fee-reductions/{id}
- `nomos grid-fee-reductions create --body <json>` — POST /grid-fee-reductions

- `nomos meter-orders list` — GET /meter-orders
- `nomos meter-orders get --id <id>` — GET /meter-orders/{id}
- `nomos meter-orders create --body <json>` — POST /meter-orders

## Complete Command Reference

See [Commands](/cli/commands) for full documentation of all commands and options.

## Examples

### Checkout Flow

```bash
# Login first
nomos login --token "$NOMOS_TOKEN"

# List available plans
nomos call get-plans

# Get a quote for a specific plan
nomos call get-plans-by-id-quote \
  --path '{"id":"plan_123"}' \
  --query '{"annualConsumption":4500}'

# Create a subscription
nomos call post-subscriptions \
  --body '{
    "planId": "plan_123",
    "customer": {
      "email": "customer@example.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  }'
```

### Invoice Explanation

```bash
# List invoices for a subscription
nomos call get-subscriptions-by-id-invoices \
  --path '{"id":"sub_123"}'

# Download invoice PDF
nomos call get-invoices-by-id-file \
  --path '{"id":"inv_456"}' > invoice.pdf
```

### Smart Meter Order

```bash
# List meter orders
nomos meter-orders list

# Create a new meter order
nomos meter-orders create \
  --body '{"subscriptionId":"sub_123","meterType":"smart"}'

# Get order status
nomos meter-orders get --id mo_789
```
