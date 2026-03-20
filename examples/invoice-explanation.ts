#!/usr/bin/env bun
/**
 * Invoice Explanation Workflow Example
 * 
 * This example demonstrates how to explain an invoice:
 * 1. List customer's subscriptions
 * 2. Get invoices for a subscription
 * 3. Get invoice details
 * 4. Get consumption data
 * 5. Get meter readings
 * 6. Get price breakdown
 * 
 * Usage:
 *   export NOMOS_TOKEN="your-token"
 *   bun examples/invoice-explanation.ts [subscription-id]
 */

import { NomosSDK } from "../src/sdk";

const TOKEN = process.env.NOMOS_TOKEN;
const BASE_URL = process.env.NOMOS_BASE_URL || "https://api.nomos.energy";

if (!TOKEN) {
  console.error("Error: NOMOS_TOKEN environment variable required");
  process.exit(1);
}

async function invoiceExplanationExample() {
  const subscriptionId = process.argv[2];
  
  console.log("📄 Invoice Explanation Workflow Example\n");
  
  const sdk = new NomosSDK({
    baseUrl: BASE_URL,
    bearerToken: TOKEN,
  });

  try {
    // Step 1: Get subscription or list all
    let targetSubscriptionId = subscriptionId;
    
    if (!targetSubscriptionId) {
      console.log("📋 Step 1: Listing subscriptions...");
      const subscriptions = await sdk.call("get-subscriptions");
      
      if (subscriptions.data.length === 0) {
        console.log("   No subscriptions found");
        return;
      }
      
      targetSubscriptionId = subscriptions.data[0].id;
      console.log(`   Using subscription: ${targetSubscriptionId}\n`);
    } else {
      console.log(`📋 Using provided subscription: ${targetSubscriptionId}\n`);
    }

    // Step 2: Get invoices
    console.log("💳 Step 2: Fetching invoices...");
    const invoices = await sdk.call("get-subscriptions-by-id-invoices", {
      path: { id: targetSubscriptionId }
    });
    
    if (invoices.data.length === 0) {
      console.log("   No invoices found for this subscription");
      return;
    }
    
    console.log(`   Found ${invoices.data.length} invoice(s)`);
    const latestInvoice = invoices.data[0];
    console.log(`   Latest invoice: ${latestInvoice.id}`);
    console.log(`   Amount: €${latestInvoice.amount}`);
    console.log(`   Period: ${latestInvoice.periodStart} to ${latestInvoice.periodEnd}\n`);

    // Step 3: Get invoice details
    console.log("📊 Step 3: Getting invoice details...");
    const invoiceDetails = await sdk.call("get-invoices-by-id", {
      path: { id: latestInvoice.id }
    });
    console.log(`   Status: ${invoiceDetails.data.status}`);
    console.log(`   Due date: ${invoiceDetails.data.dueDate}\n`);

    // Step 4: Get consumption data
    console.log("⚡ Step 4: Fetching consumption data...");
    const consumption = await sdk.call("get-subscriptions-by-id-consumption", {
      path: { id: targetSubscriptionId },
      query: {
        startDate: latestInvoice.periodStart,
        endDate: latestInvoice.periodEnd
      }
    });
    console.log(`   Total consumption: ${consumption.data.totalKwh} kWh`);
    console.log(`   Daily average: ${consumption.data.dailyAverageKwh} kWh\n`);

    // Step 5: Get meter readings
    console.log("📏 Step 5: Fetching meter readings...");
    const readings = await sdk.call("get-subscriptions-by-id-meter-readings", {
      path: { id: targetSubscriptionId },
      query: {
        startDate: latestInvoice.periodStart,
        endDate: latestInvoice.periodEnd
      }
    });
    console.log(`   Found ${readings.data.length} reading(s)`);
    readings.data.slice(0, 3).forEach((reading: any) => {
      console.log(`   - ${reading.date}: ${reading.value} kWh (${reading.type})`);
    });
    console.log();

    // Step 6: Get price breakdown
    console.log("💰 Step 6: Fetching price breakdown...");
    const prices = await sdk.call("get-subscriptions-by-id-prices", {
      path: { id: targetSubscriptionId },
      query: {
        startDate: latestInvoice.periodStart,
        endDate: latestInvoice.periodEnd
      }
    });
    console.log(`   Base price: €${prices.data.basePrice}`);
    console.log(`   Energy price: €${prices.data.energyPrice}`);
    console.log(`   Grid fees: €${prices.data.gridFees}`);
    console.log(`   Taxes: €${prices.data.taxes}\n`);

    console.log("✅ Invoice explanation complete!");
    console.log("\nTo download the PDF:");
    console.log(`  nomos call get-invoices-by-id-file --path '{"id":"${latestInvoice.id}"}' > invoice.pdf`);

  } catch (error) {
    console.error("\n❌ Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

invoiceExplanationExample();
