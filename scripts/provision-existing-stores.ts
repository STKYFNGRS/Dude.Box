import { PrismaClient } from "@prisma/client";
import { provisionStoreSubdomain } from "../src/lib/dns-provisioning";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting subdomain provisioning for existing stores...\n");

  const approvedStores = await prisma.store.findMany({
    where: { status: "approved" },
    select: {
      id: true,
      name: true,
      subdomain: true,
      created_at: true,
    },
    orderBy: { created_at: "asc" },
  });

  console.log(`Found ${approvedStores.length} approved store(s)\n`);

  if (approvedStores.length === 0) {
    console.log("No approved stores found. Exiting.");
    return;
  }

  let successCount = 0;
  let failureCount = 0;

  for (const store of approvedStores) {
    console.log(`\n[${ approvedStores.indexOf(store) + 1}/${approvedStores.length}] Processing: ${store.name}`);
    console.log(`   Subdomain: ${store.subdomain}.dude.box`);
    console.log(`   Store ID: ${store.id}`);
    
    try {
      const result = await provisionStoreSubdomain(store.subdomain);
      
      if (result.success) {
        console.log(`   ✅ Successfully provisioned ${store.subdomain}.dude.box`);
        successCount++;
      } else {
        console.log(`   ❌ Failed to provision ${store.subdomain}.dude.box`);
        if (result.cloudflare && !result.cloudflare.success) {
          console.log(`      Cloudflare error: ${result.cloudflare.error}`);
        }
        if (result.vercel && !result.vercel.success) {
          console.log(`      Vercel error: ${result.vercel.error}`);
        }
        failureCount++;
      }
    } catch (error) {
      console.log(`   ❌ Error provisioning ${store.subdomain}.dude.box:`, error);
      failureCount++;
    }
    
    // Wait between requests to avoid rate limits
    if (approvedStores.indexOf(store) < approvedStores.length - 1) {
      console.log("   ⏳ Waiting 2 seconds before next request...");
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("📊 Provisioning Summary");
  console.log("=".repeat(60));
  console.log(`Total stores processed: ${approvedStores.length}`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failureCount}`);
  console.log("=".repeat(60));

  if (successCount > 0) {
    console.log("\nℹ️  Note: SSL certificates may take 1-2 minutes to provision in Vercel.");
    console.log("   Check Vercel dashboard to verify domain status.");
  }

  if (failureCount > 0) {
    console.log("\n⚠️  Some stores failed to provision. Please check the errors above.");
    console.log("   You can manually add domains in Cloudflare and Vercel dashboards.");
  }
}

main()
  .catch((error) => {
    console.error("\n❌ Fatal error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
