#!/usr/bin/env bun
/**
 * Checkout Workflow Example
 * 
 * This example demonstrates the complete checkout flow:
 * 1. List available plans
 * 2. Get quote for a plan
 * 3. Create a lead
 * 4. Create a subscription
 * 
 * Usage:
 *   export NOMOS_TOKEN="your-token"
 *   bun examples/checkout.ts
 */

import { NomosSDK } from "../src/sdk";

const TOKEN = process.env.NOMOS_TOKEN;
const BASE_URL = process.env.NOMOS_BASE_URL || "https://api.nomos.energy";

if (!TOKEN) {
  console.error("Error: NOMOS_TOKEN environment variable required");
  console.error("Get your token from: https://portal.nomos.energy");
  process.exit(1);
}

async function checkoutExample() {
  console.log("🏁 Starting Checkout Workflow Example\n");
  
  const sdk = new NomosSDK({
    baseUrl: BASE_URL,
    bearerToken: TOKEN,
  });

  try {
    // Step 1: List available plans
    console.log("📋 Step 1: Fetching available plans...");
    const plans = await sdk.call("get-plans");
    console.log(`   Found ${plans.data.length} plans`);
    
    if (plans.data.length === 0) {
      console.log("   No plans available");
      return;
    }

    const firstPlan = plans.data[0];
    console.log(`   Using plan: ${firstPlan.name} (${firstPlan.id})\n`);

    // Step 2: Get quote for the plan
    console.log("💰 Step 2: Getting quote...");
    const quote = await sdk.call("get-plans-by-id-quote", {
      path: { id: firstPlan.id },
      query: { annualConsumption: 4500 }
    });
    console.log(`   Monthly estimate: €${quote.data.monthlyEstimate}`);
    console.log(`   Annual estimate: €${quote.data.annualEstimate}\n`);

    // Step 3: Create a lead
    console.log("👤 Step 3: Creating lead...");
    const lead = await sdk.call("post-leads", {
      body: {
        email: "demo@example.com",
        firstName: "Demo",
        lastName: "User",
        phone: "+49123456789",
        planId: firstPlan.id
      }
    });
    console.log(`   Lead created: ${lead.data.id}\n`);

    // Step 4: Create subscription
    console.log("✅ Step 4: Creating subscription...");
    const subscription = await sdk.call("post-subscriptions", {
      body: {
        planId: firstPlan.id,
        leadId: lead.data.id,
        customer: {
          email: "demo@example.com",
          firstName: "Demo",
          lastName: "User",
          phone: "+49123456789"
        },
        meteringPointId: "DE123456789012345678",
        startDate: new Date().toISOString().split('T')[0]
      }
    });
    console.log(`   Subscription created: ${subscription.data.id}`);
    console.log(`   Status: ${subscription.data.status}\n`);

    console.log("🎉 Checkout workflow completed successfully!");
    console.log("\nNext steps:");
    console.log("  - Track subscription: nomos call get-subscriptions-by-id --path '{\"id\":\"" + subscription.data.id + "\"}'");
    console.log("  - View invoices: nomos call get-subscriptions-by-id-invoices --path '{\"id\":\"" + subscription.data.id + "\"}'");

  } catch (error) {
    console.error("\n❌ Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

checkoutExample();
