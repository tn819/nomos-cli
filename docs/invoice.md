# Invoice Explanation Use Case

View billing history, consumption data, and download invoice PDFs.

## API Operations

| Step | Operation | Purpose |
|------|-----------|---------|
| 1 | `get-subscriptions-by-id-invoices` | List invoices for a subscription |
| 2 | `get-invoices-by-id` | Get invoice details |
| 3 | `get-invoices-by-id-file` | Download invoice PDF |
| 4 | `get-subscriptions-by-id-consumption` | Get consumption data |

## CLI Workflow

```bash
# Step 1: List invoices for a subscription
nomos call get-subscriptions-by-id-invoices \
  --path '{"id":"sub_123"}'

# Step 2: Get invoice details
nomos call get-invoices-by-id \
  --path '{"id":"inv_456"}'

# Step 3: Download invoice PDF
nomos call get-invoices-by-id-file \
  --path '{"id":"inv_456"}' > invoice.pdf

# Step 4: Get consumption data
nomos call get-subscriptions-by-id-consumption \
  --path '{"id":"sub_123"}' \
  --query '{
    "startDate": "2024-01-01",
    "endDate": "2024-01-31"
  }'
```

## SDK Implementation

```typescript
import { NomosSDK } from "nomos-sdk-cli";
import { writeFileSync } from "fs";

const sdk = new NomosSDK({
  bearerToken: process.env.NOMOS_TOKEN,
});

async function explainInvoice(subscriptionId: string, invoiceId: string) {
  // 1. Get invoice details
  const invoice = await sdk.call("get-invoices-by-id", {
    path: { id: invoiceId }
  });

  // 2. Get consumption data for the billing period
  const consumption = await sdk.call("get-subscriptions-by-id-consumption", {
    path: { id: subscriptionId },
    query: { 
      startDate: "2024-01-01", 
      endDate: "2024-01-31" 
    }
  });

  // 3. Download PDF
  const pdfResponse = await sdk.call("get-invoices-by-id-file", {
    path: { id: invoiceId }
  });
  
  // Save PDF (data is a Buffer for PDF content)
  if (Buffer.isBuffer(pdfResponse.data)) {
    writeFileSync("invoice.pdf", pdfResponse.data);
  }

  return { invoice, consumption };
}
```

See the complete example in [`examples/invoice-explanation.ts`](https://github.com/tn819/nomos-cli/blob/main/examples/invoice-explanation.ts).
