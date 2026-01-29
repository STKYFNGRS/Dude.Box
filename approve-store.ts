import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function approveStore(subdomain: string) {
  try {
    console.log(`\n🔍 Looking for store with subdomain: ${subdomain}...\n`);
    
    const store = await prisma.store.findUnique({
      where: { subdomain },
      include: {
        owner: {
          select: {
            email: true,
            role: true,
          },
        },
      },
    });

    if (!store) {
      console.error(`❌ Store "${subdomain}" not found!`);
      return;
    }

    console.log(`Found store: ${store.name}`);
    console.log(`Current status: ${store.status}`);
    console.log(`Owner: ${store.owner.email}\n`);

    if (store.status === "approved") {
      console.log(`✅ Store is already approved!`);
      return;
    }

    // Approve the store
    const updatedStore = await prisma.store.update({
      where: { id: store.id },
      data: { status: "approved" },
    });

    console.log(`✅ Successfully approved store: ${updatedStore.name}`);
    console.log(`📍 Subdomain: https://${updatedStore.subdomain}.dude.box`);
    console.log(`\n✨ The store is now live and accessible!`);
  } catch (error) {
    console.error("❌ Error approving store:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get subdomain from command line arguments
const subdomain = process.argv[2];

if (!subdomain) {
  console.error("❌ Please provide a subdomain to approve");
  console.error("\nUsage: npx tsx approve-store.ts <subdomain>");
  console.error("Example: npx tsx approve-store.ts teststore");
  process.exit(1);
}

approveStore(subdomain);
