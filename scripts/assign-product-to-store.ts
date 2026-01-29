/**
 * Assign an existing Stripe product to a store in the database
 * 
 * Usage: npx tsx scripts/assign-product-to-store.ts <stripe_product_id> <store_subdomain>
 * Example: npx tsx scripts/assign-product-to-store.ts prod_xxx dudebox
 */

import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

async function assignProductToStore() {
  try {
    const stripeProductId = process.argv[2];
    const storeSubdomain = process.argv[3];

    if (!stripeProductId || !storeSubdomain) {
      console.error("❌ Usage: npx tsx scripts/assign-product-to-store.ts <stripe_product_id> <store_subdomain>");
      console.error("   Example: npx tsx scripts/assign-product-to-store.ts prod_xxx dudebox");
      process.exit(1);
    }

    console.log(`\n🔍 Fetching product from Stripe...`);

    // Fetch product from Stripe
    const stripeProduct = await stripe.products.retrieve(stripeProductId);
    console.log(`   Found: ${stripeProduct.name}`);

    // Get the default price
    const prices = await stripe.prices.list({
      product: stripeProductId,
      active: true,
      limit: 1,
    });

    if (prices.data.length === 0) {
      console.error("❌ No active price found for this product");
      process.exit(1);
    }

    const price = prices.data[0];
    const priceAmount = price.unit_amount ? price.unit_amount / 100 : 0;
    const interval = price.recurring?.interval || "one_time";

    console.log(`   Price: $${priceAmount} (${interval})`);
    console.log(`   Stripe Price ID: ${price.id}`);

    // Find the store
    console.log(`\n🔍 Finding store: ${storeSubdomain}`);
    const store = await prisma.store.findUnique({
      where: { subdomain: storeSubdomain },
    });

    if (!store) {
      console.error(`❌ Store not found: ${storeSubdomain}`);
      console.log("\n   Available stores:");
      const stores = await prisma.store.findMany({
        select: { subdomain: true, name: true },
      });
      stores.forEach((s) => console.log(`      - ${s.subdomain} (${s.name})`));
      process.exit(1);
    }

    console.log(`   Found: ${store.name}`);

    // Check if product already exists
    const existing = await prisma.product.findFirst({
      where: { stripe_price_id: price.id },
    });

    if (existing) {
      console.error(`❌ Product already exists in database`);
      console.log(`   Store: ${existing.store_id}`);
      console.log(`   Name: ${existing.name}`);
      process.exit(1);
    }

    // Create product in database
    console.log(`\n✨ Creating product in database...`);
    const product = await prisma.product.create({
      data: {
        name: stripeProduct.name,
        description: stripeProduct.description || null,
        price: priceAmount,
        interval,
        active: stripeProduct.active,
        stripe_price_id: price.id,
        store_id: store.id,
      },
    });

    console.log(`\n✅ Success! Product imported:`);
    console.log(`   Database ID: ${product.id}`);
    console.log(`   Name: ${product.name}`);
    console.log(`   Price: $${product.price}`);
    console.log(`   Store: ${store.name} (${store.subdomain})`);
    console.log(`   Stripe Price ID: ${product.stripe_price_id}`);
    console.log(`\n🎉 Product is now visible on your site at:`);
    console.log(`   https://${store.subdomain}.dude.box`);
    console.log(`   And at: https://dude.box/products/subscription-box\n`);

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

assignProductToStore();
