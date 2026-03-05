import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const passkeys = await prisma.authenticator.findMany({
    where: { userId: session.user.id },
    select: {
      credentialID: true,
      credentialDeviceType: true,
      credentialBackedUp: true,
      transports: true,
    },
  });

  return NextResponse.json(passkeys);
}
