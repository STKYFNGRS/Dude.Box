import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkStores() {
  const stores = await prisma.store.findMany({
    include: {
      owner: {
        select: {
          email: true,
          role: true,
        },
      },
    },
  });

  console.log(`\n📊 Found ${stores.length} store(s) in database:\n`);
  
  stores.forEach((store, index) => {
    console.log(`${index + 1}. ${store.name} (${store.subdomain})`);
    console.log(`   Status: ${store.status}`);
    console.log(`   Owner: ${store.owner.email} (${store.owner.role})`);
    console.log(`   Application Paid: ${store.application_paid}`);
    console.log(`   Subscription ID: ${store.monthly_subscription_id || 'N/A'}`);
    console.log('');
  });

  await prisma.$disconnect();
}

checkStores().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
