/**
 * Import existing Stripe products into the database
 * 
 * Usage: npx tsx scripts/import-stripe-products.ts
 */

import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

async function importStripeProducts() {
  try {
    console.log("🔍 Fetching products from Stripe...\n");

    // Fetch all products from Stripe
    const products = await stripe.products.list({
      active: true,
      limit: 100,
    });

    console.log(`Found ${products.data.length} active products in Stripe\n`);

    for (const stripeProduct of products.data) {
      console.log(`\n📦 Processing: ${stripeProduct.name}`);
      console.log(`   Stripe ID: ${stripeProduct.id}`);

      // Get the default price for this product
      const prices = await stripe.prices.list({
        product: stripeProduct.id,
        active: true,
        limit: 1,
      });

      if (prices.data.length === 0) {
        console.log(`   ⚠️  No active price found, skipping`);
        continue;
      }

      const price = prices.data[0];
      const priceAmount = price.unit_amount ? price.unit_amount / 100 : 0;
      const interval = price.recurring?.interval || "one_time";

      console.log(`   Price: $${priceAmount} (${interval})`);

      // Check if product already exists in database
      const existingProduct = await prisma.product.findFirst({
        where: {
          OR: [
            { stripe_product_id: stripeProduct.id },
            { name: stripeProduct.name },
          ],
        },
      });

      if (existingProduct) {
        console.log(`   ℹ️  Product already exists in database, skipping`);
        continue;
      }

      // Prompt for store assignment
      console.log(`\n   ⚠️  MANUAL ACTION REQUIRED:`);
      console.log(`   To import "${stripeProduct.name}", you need to:`);
      console.log(`   1. Know which store (vendor) owns this product`);
      console.log(`   2. Run: npx tsx scripts/assign-product-to-store.ts "${stripeProduct.id}" "STORE_ID"\n`);
    }

    console.log("\n✅ Stripe product scan complete!\n");
    console.log("💡 To properly import products:");
    console.log("   1. Go to /vendor/products/new in your browser");
    console.log("   2. Create products through the platform");
    console.log("   3. They will automatically sync to Stripe\n");
    console.log("   OR use the assign-product-to-store script for existing Stripe products\n");

  } catch (error) {
    console.error("❌ Error importing products:", error);
  } finally {
    await prisma.$disconnect();
  }
}

importStripeProducts();
