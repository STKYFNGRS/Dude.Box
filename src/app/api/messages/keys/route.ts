import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const keyPair = await prisma.userKeyPair.findUnique({
    where: { userId },
    select: { publicKey: true },
  });

  if (!keyPair) {
    return NextResponse.json({ error: "No key pair found" }, { status: 404 });
  }

  return NextResponse.json({ publicKey: keyPair.publicKey });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { publicKey, encryptedPrivateKey } = await req.json();

  if (!publicKey || !encryptedPrivateKey) {
    return NextResponse.json(
      { error: "publicKey and encryptedPrivateKey required" },
      { status: 400 }
    );
  }

  const keyPair = await prisma.userKeyPair.upsert({
    where: { userId: session.user.id },
    update: { publicKey, encryptedPrivateKey },
    create: {
      userId: session.user.id,
      publicKey,
      encryptedPrivateKey,
    },
  });

  return NextResponse.json(
    { id: keyPair.id, publicKey: keyPair.publicKey },
    { status: 201 }
  );
}
