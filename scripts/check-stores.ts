import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Checking Store records...\n");
  
  const stores = await prisma.store.findMany({
    include: {
      owner: {
        select: {
          name: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  console.log(`Total stores: ${stores.length}\n`);
  
  if (stores.length === 0) {
    console.log("❌ No stores found in database");
  } else {
    stores.forEach((store, index) => {
      console.log(`Store ${index + 1}:`);
      console.log(`  - Subdomain: ${store.subdomain}`);
      console.log(`  - Name: ${store.name}`);
      console.log(`  - Status: ${store.status}`);
      console.log(`  - Application Paid: ${store.application_paid}`);
      console.log(`  - Owner: ${store.owner.name} (${store.owner.email})`);
      console.log(`  - Owner Role: ${store.owner.role}`);
      console.log(`  - Created: ${store.created_at}`);
      console.log("");
    });
  }
  
  // Also check the user who should have become a vendor
  const user = await prisma.user.findUnique({
    where: { id: "cmkxahiw3000010d9lag6glnx" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      created_at: true,
    },
  });
  
  console.log("User from checkout session:");
  if (user) {
    console.log(`  - ID: ${user.id}`);
    console.log(`  - Name: ${user.name}`);
    console.log(`  - Email: ${user.email}`);
    console.log(`  - Role: ${user.role} ${user.role === 'vendor' ? '✅' : '❌ (should be vendor)'}`);
  } else {
    console.log("  ❌ User not found");
  }
}

main()
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
