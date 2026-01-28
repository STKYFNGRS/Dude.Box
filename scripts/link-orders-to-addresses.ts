import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function linkOrdersToAddresses() {
  console.log("🔧 Starting migration: Link orders to shipping addresses...\n");

  // Get all orders without shipping addresses
  const ordersWithoutAddress = await prisma.order.findMany({
    where: { shipping_address_id: null },
    include: {
      user: {
        include: {
          addresses: true,
        },
      },
    },
  });

  console.log(`📊 Found ${ordersWithoutAddress.length} orders without linked addresses\n`);

  if (ordersWithoutAddress.length === 0) {
    console.log("✅ All orders already have addresses linked. Nothing to do!");
    return;
  }

  let linkedCount = 0;
  let skippedCount = 0;

  for (const order of ordersWithoutAddress) {
    const orderNum = order.id.slice(-8);

    // Find user's default shipping address
    const defaultAddress = order.user.addresses.find(
      (addr) => addr.is_default && addr.type === "shipping"
    );

    if (defaultAddress) {
      await prisma.order.update({
        where: { id: order.id },
        data: { shipping_address_id: defaultAddress.id },
      });
      console.log(
        `✅ Order #${orderNum} → Address ${defaultAddress.id.slice(-8)} (${defaultAddress.city}, ${defaultAddress.state})`
      );
      linkedCount++;
    } else {
      console.warn(
        `⚠️  Order #${orderNum} → No default address (user: ${order.user.email})`
      );
      skippedCount++;
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("📊 MIGRATION SUMMARY");
  console.log("=".repeat(60));
  console.log(`✅ Orders linked:  ${linkedCount}`);
  console.log(`⚠️  Orders skipped: ${skippedCount}`);
  console.log(`📈 Total processed: ${ordersWithoutAddress.length}`);
  console.log("=".repeat(60) + "\n");

  if (skippedCount > 0) {
    console.log(
      "⚠️  Note: Orders without default addresses need manual address assignment"
    );
    console.log("   or the customer needs to add their address in the portal.\n");
  } else {
    console.log("🎉 All orders successfully linked to addresses!\n");
  }
}

// Run the migration
linkOrdersToAddresses()
  .catch((error) => {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
