/**
 * List all Stripe products with their IDs
 * 
 * Usage: npx tsx scripts/list-stripe-products.ts
 */

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

async function listProducts() {
  try {
    console.log("\n🔍 Fetching all products from Stripe...\n");

    const products = await stripe.products.list({
      limit: 100,
      expand: ['data.default_price'],
    });

    if (products.data.length === 0) {
      console.log("No products found in Stripe.\n");
      return;
    }

    console.log(`Found ${products.data.length} product(s):\n`);
    console.log("=".repeat(80));

    for (const product of products.data) {
      console.log(`\n📦 ${product.name}`);
      console.log(`   Product ID: ${product.id}`);
      console.log(`   Active: ${product.active ? "Yes" : "No"}`);
      console.log(`   Description: ${product.description || "N/A"}`);
      
      // Get prices for this product
      const prices = await stripe.prices.list({
        product: product.id,
        limit: 10,
      });

      if (prices.data.length > 0) {
        console.log(`   Prices:`);
        prices.data.forEach((price) => {
          const amount = price.unit_amount ? `$${(price.unit_amount / 100).toFixed(2)}` : "N/A";
          const interval = price.recurring?.interval || "one-time";
          console.log(`      - ${amount} (${interval}) - Price ID: ${price.id}`);
        });
      }

      console.log(`\n   To import this product, run:`);
      console.log(`   npx tsx scripts/assign-product-to-store.ts ${product.id} dudebox\n`);
      console.log("=".repeat(80));
    }

    console.log("\n✅ Done!\n");

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

listProducts();
