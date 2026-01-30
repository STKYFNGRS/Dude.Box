import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function hideViolatingProduct() {
  try {
    // Find the "fresh columbian powder" product
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: "columbian", mode: "insensitive" } },
          { name: { contains: "powder", mode: "insensitive" } },
        ],
      },
      include: {
        store: true,
      },
    });

    console.log(`Found ${products.length} matching products:`);
    
    for (const product of products) {
      console.log(`\nProduct: ${product.name}`);
      console.log(`Description: ${product.description}`);
      console.log(`Store: ${product.store?.name}`);
      console.log(`Currently: ${product.moderation_status}, Active: ${product.active}`);

      // Hide it
      await prisma.product.update({
        where: { id: product.id },
        data: {
          moderation_status: "hidden",
          flagged_reason: "EMERGENCY HIDE: Drug reference detected after moderation failure",
          active: false,
        },
      });

      console.log(`✅ Product hidden successfully`);
    }

    console.log("\n✅ All violating products hidden");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

hideViolatingProduct();
