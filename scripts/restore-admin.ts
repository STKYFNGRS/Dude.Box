import { PrismaClient } from "@prisma/client";
import * as readline from "readline";

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function main() {
  console.log("🔧 Admin Restoration Script\n");

  const email = await question("Enter your email address: ");

  if (!email || !email.includes("@")) {
    console.error("❌ Invalid email address");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.error(`❌ User not found with email: ${email}`);
    process.exit(1);
  }

  console.log(`\n👤 Found user: ${user.first_name} ${user.last_name}`);
  console.log(`   Current role: ${user.role}`);
  console.log(`   Current admin status: ${user.is_admin}`);

  const confirm = await question(
    "\n⚠️  Grant admin access to this user? (yes/no): "
  );

  if (confirm.toLowerCase() !== "yes") {
    console.log("❌ Operation cancelled");
    rl.close();
    process.exit(0);
  }

  const updatedUser = await prisma.user.update({
    where: { email },
    data: {
      is_admin: true,
      role: "admin",
    },
  });

  console.log("\n✅ Admin access granted successfully!");
  console.log(`   User: ${updatedUser.first_name} ${updatedUser.last_name}`);
  console.log(`   Email: ${updatedUser.email}`);
  console.log(`   Role: ${updatedUser.role}`);
  console.log(`   Admin: ${updatedUser.is_admin}`);
  console.log("\n🎉 You can now delete this script!");

  rl.close();
}

main()
  .catch((e) => {
    console.error("❌ Error restoring admin access:", e);
    rl.close();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
