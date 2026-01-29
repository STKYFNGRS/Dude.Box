import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding platform products...");

  // Application Fee Product
  const applicationFee = await prisma.platformProduct.upsert({
    where: { stripe_price_id: "price_1Suxg9In9SFgOJXcePBKNyNz" },
    update: {},
    create: {
      name: "Vendor Application Fee",
      description: "One-time application fee to become a Dude.Box vendor",
      price: 5.00,
      stripe_price_id: "price_1Suxg9In9SFgOJXcePBKNyNz",
      type: "application_fee",
      interval: "one_time",
      active: true,
    },
  });

  console.log(`✅ Created/Updated: ${applicationFee.name} - $${applicationFee.price}`);

  // Monthly Subscription Product
  const monthlySubscription = await prisma.platformProduct.upsert({
    where: { stripe_price_id: "price_1Sum02In9SFgOJXcOYdXRk9D" },
    update: {},
    create: {
      name: "Vendor Monthly Subscription",
      description: "Monthly subscription fee for active vendor stores",
      price: 5.00,
      stripe_price_id: "price_1Sum02In9SFgOJXcOYdXRk9D",
      type: "monthly_subscription",
      interval: "month",
      active: true,
    },
  });

  console.log(`✅ Created/Updated: ${monthlySubscription.name} - $${monthlySubscription.price}/month`);

  console.log("\n✨ Platform products seeded successfully!");
  console.log(`\nTotal platform products: ${await prisma.platformProduct.count()}`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding platform products:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
