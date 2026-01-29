import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkAdmin() {
  const user = await prisma.user.findUnique({
    where: { email: "alex_moore19@yahoo.com" },
    select: {
      id: true,
      email: true,
      role: true,
      is_admin: true,
    },
  });

  console.log("\n👤 Your User Status:");
  console.log(JSON.stringify(user, null, 2));

  await prisma.$disconnect();
}

checkAdmin().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
