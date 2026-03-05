import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const searchQuery = req.nextUrl.searchParams.get("search");

  if (searchQuery) {
    const users = await prisma.user.findMany({
      where: {
        id: { not: userId },
        OR: [
          { name: { contains: searchQuery, mode: "insensitive" } },
          { email: { contains: searchQuery, mode: "insensitive" } },
        ],
      },
      select: { id: true, name: true, email: true, image: true },
      take: 10,
    });
    return NextResponse.json({ users });
  }

  const memberships = await prisma.conversationMember.findMany({
    where: { userId },
    include: {
      conversation: {
        include: {
          members: {
            where: { userId: { not: userId } },
            include: {
              user: { select: { id: true, name: true, image: true } },
            },
          },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      },
    },
    orderBy: { conversation: { updatedAt: "desc" } },
  });

  const conversations = memberships.map((m) => {
    const otherMember = m.conversation.members[0];
    const lastMsg = m.conversation.messages[0] ?? null;

    const unreadCount = lastMsg && m.lastReadAt
      ? lastMsg.createdAt > m.lastReadAt ? 1 : 0
      : lastMsg ? 1 : 0;

    return {
      id: m.conversationId,
      otherUser: otherMember?.user ?? { id: "", name: "Deleted User", image: null },
      lastMessage: lastMsg
        ? { preview: lastMsg.ciphertext.slice(0, 80), createdAt: lastMsg.createdAt.toISOString() }
        : null,
      unreadCount,
    };
  });

  return NextResponse.json(conversations);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId: otherUserId } = await req.json();

  if (!otherUserId || otherUserId === session.user.id) {
    return NextResponse.json({ error: "Invalid user" }, { status: 400 });
  }

  const otherUser = await prisma.user.findUnique({ where: { id: otherUserId } });
  if (!otherUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const existing = await prisma.conversation.findFirst({
    where: {
      AND: [
        { members: { some: { userId: session.user.id } } },
        { members: { some: { userId: otherUserId } } },
      ],
    },
  });

  if (existing) {
    return NextResponse.json({ id: existing.id });
  }

  const conversation = await prisma.conversation.create({
    data: {
      members: {
        create: [
          { userId: session.user.id },
          { userId: otherUserId },
        ],
      },
    },
  });

  return NextResponse.json({ id: conversation.id }, { status: 201 });
}
