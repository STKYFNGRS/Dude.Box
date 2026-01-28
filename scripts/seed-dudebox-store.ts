/**
 * Seed script to create the default Dude.Box store
 * and assign existing products to it
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏪 Seeding Dude.Box default store...\n");

  // Find the first admin user
  const admin = await prisma.user.findFirst({
    where: { is_admin: true },
  });

  if (!admin) {
    console.error("❌ No admin user found. Please create an admin user first.");
    console.error("   You can use: /api/auth/make-admin endpoint");
    process.exit(1);
  }

  console.log(`✅ Found admin: ${admin.email}`);

  // Check if dudebox store already exists
  const existingStore = await prisma.store.findUnique({
    where: { subdomain: "dudebox" },
  });

  if (existingStore) {
    console.log(`\n⚠️  Dude.Box store already exists (ID: ${existingStore.id})`);
    console.log(`   Subdomain: ${existingStore.subdomain}`);
    console.log(`   Status: ${existingStore.status}\n`);
  } else {
    // Create the Dude.Box store
    const store = await prisma.store.create({
      data: {
        subdomain: "dudebox",
        name: "Dude.Box",
        description:
          "The original Dude.Box store - curated monthly subscription boxes for men.",
        contact_email: "dude@dude.box",
        owner_id: admin.id,
        status: "approved",
        approved_at: new Date(),
        approved_by: admin.id,
        stripe_onboarded: true, // Using platform Stripe account
        shipping_policy: "Free shipping on all subscription boxes.",
        return_policy:
          "30-day money-back guarantee. Contact us if you're not satisfied.",
      },
    });

    console.log(`\n✅ Created Dude.Box store (ID: ${store.id})`);
    console.log(`   Subdomain: ${store.subdomain}`);
    console.log(`   Status: ${store.status}`);
    console.log(`   Owner: ${admin.email}`);
  }

  // Get the store (either just created or existing)
  const store = await prisma.store.findUnique({
    where: { subdomain: "dudebox" },
  });

  if (!store) {
    throw new Error("Failed to create or find Dude.Box store");
  }

  // Assign all existing products to the dudebox store
  const productsToUpdate = await prisma.product.findMany({
    where: {
      store_id: null, // Only update products not yet assigned to a store
    },
  });

  if (productsToUpdate.length > 0) {
    const result = await prisma.product.updateMany({
      where: {
        store_id: null,
      },
      data: {
        store_id: store.id,
      },
    });

    console.log(`\n✅ Assigned ${result.count} product(s) to Dude.Box store`);
  } else {
    console.log(`\n✅ All products already assigned to stores`);
  }

  // Update admin user role if not already set
  if (admin.role === "customer") {
    await prisma.user.update({
      where: { id: admin.id },
      data: { role: "admin" },
    });
    console.log(`\n✅ Updated admin role for ${admin.email}`);
  }

  // Display summary
  const totalProducts = await prisma.product.count({
    where: { store_id: store.id },
  });

  const totalStores = await prisma.store.count();

  console.log("\n============================================================");
  console.log("📊 SUMMARY");
  console.log("============================================================");
  console.log(`Total stores: ${totalStores}`);
  console.log(`Dude.Box products: ${totalProducts}`);
  console.log(`Store URL: https://dudebox.dude.box (or www.dude.box)`);
  console.log("============================================================\n");
}

main()
  .catch((e) => {
    console.error("\n❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
