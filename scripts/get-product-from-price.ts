/**
 * Get product ID from a price ID
 * 
 * Usage: npx tsx scripts/get-product-from-price.ts <price_id>
 * Example: npx tsx scripts/get-product-from-price.ts price_1Sum02In9SFgOJXcOYdXRk9D
 */

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

async function getProductFromPrice() {
  try {
    const priceId = process.argv[2];

    if (!priceId) {
      console.error("\n❌ Usage: npx tsx scripts/get-product-from-price.ts <price_id>");
      console.error("   Example: npx tsx scripts/get-product-from-price.ts price_1Sum02In9SFgOJXcOYdXRk9D\n");
      process.exit(1);
    }

    console.log(`\n🔍 Looking up price: ${priceId}...\n`);

    // Fetch the price
    const price = await stripe.prices.retrieve(priceId);

    // Get the product ID
    const productId = typeof price.product === 'string' ? price.product : price.product.id;

    console.log("✅ Found price!");
    console.log(`   Price ID: ${price.id}`);
    console.log(`   Amount: $${price.unit_amount ? (price.unit_amount / 100).toFixed(2) : "N/A"}`);
    console.log(`   Interval: ${price.recurring?.interval || "one-time"}`);
    console.log(`   Active: ${price.active ? "Yes" : "No"}\n`);

    // Fetch the product
    const product = await stripe.products.retrieve(productId);

    console.log("📦 Associated Product:");
    console.log(`   Product ID: ${product.id}`);
    console.log(`   Name: ${product.name}`);
    console.log(`   Description: ${product.description || "N/A"}`);
    console.log(`   Active: ${product.active ? "Yes" : "No"}\n`);

    console.log("💡 To import this product to your dudebox store, run:");
    console.log(`   npx tsx scripts/assign-product-to-store.ts ${product.id} dudebox\n`);

  } catch (error: any) {
    if (error.type === 'StripeInvalidRequestError') {
      console.error(`\n❌ Error: ${error.message}`);
      console.error(`\n💡 Make sure you're using the correct price ID from Stripe.\n`);
    } else {
      console.error("\n❌ Error:", error);
    }
  }
}

getProductFromPrice();
