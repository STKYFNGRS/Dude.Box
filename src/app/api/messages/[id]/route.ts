import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: conversationId } = await params;

  const membership = await prisma.conversationMember.findUnique({
    where: {
      conversationId_userId: {
        conversationId,
        userId: session.user.id,
      },
    },
  });

  if (!membership) {
    return NextResponse.json({ error: "Not a member" }, { status: 403 });
  }

  const [messages, otherMember] = await Promise.all([
    prisma.directMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      include: {
        sender: { select: { id: true, name: true, image: true } },
      },
    }),
    prisma.conversationMember.findFirst({
      where: { conversationId, userId: { not: session.user.id } },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    }),
  ]);

  await prisma.conversationMember.update({
    where: { id: membership.id },
    data: { lastReadAt: new Date() },
  });

  return NextResponse.json({
    meta: {
      id: conversationId,
      otherUser: otherMember?.user ?? { id: "", name: "Deleted User", image: null },
    },
    messages: messages.map((m) => ({
      id: m.id,
      senderId: m.senderId,
      ciphertext: m.ciphertext,
      iv: m.iv,
      createdAt: m.createdAt.toISOString(),
      sender: m.sender,
    })),
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: conversationId } = await params;

  const membership = await prisma.conversationMember.findUnique({
    where: {
      conversationId_userId: {
        conversationId,
        userId: session.user.id,
      },
    },
  });

  if (!membership) {
    return NextResponse.json({ error: "Not a member" }, { status: 403 });
  }

  const { ciphertext, iv } = await req.json();

  if (!ciphertext) {
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }

  const message = await prisma.directMessage.create({
    data: {
      conversationId,
      senderId: session.user.id,
      ciphertext,
      iv: iv ?? "",
    },
    include: {
      sender: { select: { id: true, name: true, image: true } },
    },
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  return NextResponse.json({
    id: message.id,
    senderId: message.senderId,
    ciphertext: message.ciphertext,
    iv: message.iv,
    createdAt: message.createdAt.toISOString(),
    sender: message.sender,
  }, { status: 201 });
}
