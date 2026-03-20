#!/usr/bin/env bun
/**
 * Smart Meter Order Workflow Example
 * 
 * This example demonstrates the smart meter order journey:
 * 1. Check existing meter orders
 * 2. Create a new meter order
 * 3. Track order status
 * 
 * Usage:
 *   export NOMOS_TOKEN="your-token"
 *   bun examples/meter-order.ts [subscription-id]
 */

import { NomosSDK } from "../src/sdk";

const TOKEN = process.env.NOMOS_TOKEN;
const BASE_URL = process.env.NOMOS_BASE_URL || "https://api.nomos.energy";

if (!TOKEN) {
  console.error("Error: NOMOS_TOKEN environment variable required");
  process.exit(1);
}

async function meterOrderExample() {
  const subscriptionId = process.argv[2];
  
  console.log("🔌 Smart Meter Order Workflow Example\n");
  
  const sdk = new NomosSDK({
    baseUrl: BASE_URL,
    bearerToken: TOKEN,
  });

  try {
    // Step 1: Check existing orders
    console.log("📋 Step 1: Checking existing meter orders...");
    const existingOrders = await sdk.call("get-meter-orders");
    console.log(`   Found ${existingOrders.data.length} existing order(s)`);
    
    existingOrders.data.slice(0, 3).forEach((order: any) => {
      console.log(`   - ${order.id}: ${order.status} (${order.meterType})`);
    });
    console.log();

    // Step 2: Create new meter order
    console.log("➕ Step 2: Creating new meter order...");
    
    const orderData: any = {
      meterType: "smart",
      preferredInstallationDate: getFutureDate(14),
      notes: "Please install in the basement meter room"
    };
    
    if (subscriptionId) {
      orderData.subscriptionId = subscriptionId;
      console.log(`   For subscription: ${subscriptionId}`);
    }
    
    const newOrder = await sdk.call("post-meter-orders", {
      body: orderData
    });
    
    console.log(`   Order created: ${newOrder.data.id}`);
    console.log(`   Status: ${newOrder.data.status}`);
    console.log(`   Type: ${newOrder.data.meterType}\n`);

    // Step 3: Track order status
    console.log("📊 Step 3: Tracking order status...");
    const orderStatus = await sdk.call("get-meter-orders-by-id", {
      path: { id: newOrder.data.id }
    });
    
    console.log(`   Current status: ${orderStatus.data.status}`);
    console.log(`   Created: ${orderStatus.data.createdAt}`);
    
    if (orderStatus.data.scheduledDate) {
      console.log(`   Scheduled: ${orderStatus.data.scheduledDate}`);
    }
    
    if (orderStatus.data.technician) {
      console.log(`   Technician: ${orderStatus.data.technician.name}`);
    }
    console.log();

    console.log("✅ Meter order workflow completed!");
    console.log("\nTo track this order later:");
    console.log(`  nomos call get-meter-orders-by-id --path '{"id":"${newOrder.data.id}"}'`);
    console.log("\nOr use the Edison helper:");
    console.log(`  nomos meter-orders get --id ${newOrder.data.id}`);

  } catch (error) {
    console.error("\n❌ Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

function getFutureDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

meterOrderExample();
