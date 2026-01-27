import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Check if product already exists
  const existingProduct = await prisma.product.findFirst({
    where: {
      interval: "month",
      active: true,
    },
  });

  if (existingProduct) {
    console.log("✅ Monthly subscription product already exists:");
    console.log(`   ID: ${existingProduct.id}`);
    console.log(`   Name: ${existingProduct.name}`);
    console.log(`   Price: $${existingProduct.price}`);
    console.log(`   Stripe Price ID: ${existingProduct.stripe_price_id || "NOT SET"}`);
    return;
  }

  // Create the monthly subscription product
  // NOTE: You need to replace 'YOUR_STRIPE_PRICE_ID' with the actual Price ID from Stripe Dashboard
  const product = await prisma.product.create({
    data: {
      name: "Dude.Box Monthly Subscription",
      description: "Premium, veteran-owned gear delivered monthly. Prioritize the subscription experience and build your drop cadence.",
      price: 59.99,
      interval: "month",
      stripe_price_id: "YOUR_STRIPE_PRICE_ID", // Replace this with your actual Stripe Price ID
      active: true,
    },
  });

  console.log("✅ Created monthly subscription product:");
  console.log(`   ID: ${product.id}`);
  console.log(`   Name: ${product.name}`);
  console.log(`   Price: $${product.price}`);
  console.log(`   Stripe Price ID: ${product.stripe_price_id}`);
  console.log("");
  console.log("⚠️  IMPORTANT: Update the stripe_price_id with your actual Stripe Price ID!");
  console.log("   You can do this in Prisma Studio or by running this seed script again after updating the value.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error during seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
