import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testStoresQuery() {
  try {
    console.log("Testing stores query...\n");
    
    const stores = await prisma.store.findMany({
      orderBy: { created_at: "desc" },
      include: {
        owner: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
          },
        },
        _count: {
          select: {
            products: true,
            orders: true,
          },
        },
      },
    });

    console.log(`✅ Query successful! Found ${stores.length} store(s):\n`);
    
    stores.forEach((store, index) => {
      console.log(`${index + 1}. ${store.name}`);
      console.log(`   Subdomain: ${store.subdomain}`);
      console.log(`   Status: ${store.status}`);
      console.log(`   Owner: ${store.owner.email}`);
      console.log(`   First Name: ${store.owner.first_name || 'null'}`);
      console.log(`   Last Name: ${store.owner.last_name || 'null'}`);
      console.log(`   Products: ${store._count.products}`);
      console.log(`   Orders: ${store._count.orders}`);
      console.log('');
    });
  } catch (error) {
    console.error("❌ Query failed with error:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testStoresQuery();
