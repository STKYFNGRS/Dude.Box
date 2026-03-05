import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const url = new URL(request.url);
  const action = url.searchParams.get("action");
  const cursor = url.searchParams.get("cursor");
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "50"), 100);

  try {
    const channel = await prisma.channel.findUnique({ where: { slug } });
    if (!channel) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });
    }

    if (action === "members") {
      const members = await prisma.channelMember.findMany({
        where: { channelId: channel.id },
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { joinedAt: "asc" },
      });
      return NextResponse.json(members.map((m) => m.user));
    }

    const messages = await prisma.channelMessage.findMany({
      where: { channelId: channel.id },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    const session = await auth();
    if (session?.user?.id) {
      await prisma.channelMember.updateMany({
        where: { channelId: channel.id, userId: session.user.id },
        data: { lastReadAt: new Date() },
      });
    }

    return NextResponse.json({
      channel: {
        id: channel.id,
        name: channel.name,
        slug: channel.slug,
        description: channel.description,
      },
      messages: messages.reverse(),
      hasMore: messages.length === limit,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const action = url.searchParams.get("action");

  try {
    const channel = await prisma.channel.findUnique({ where: { slug } });
    if (!channel) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });
    }

    if (action === "join") {
      const membership = await prisma.channelMember.upsert({
        where: {
          channelId_userId: { channelId: channel.id, userId: session.user.id },
        },
        update: {},
        create: { channelId: channel.id, userId: session.user.id },
      });
      return NextResponse.json({ joined: true, id: membership.id });
    }

    if (action === "leave") {
      await prisma.channelMember.deleteMany({
        where: { channelId: channel.id, userId: session.user.id },
      });
      return NextResponse.json({ left: true });
    }

    const { content } = await request.json();
    if (!content?.trim()) {
      return NextResponse.json({ error: "Message content required" }, { status: 400 });
    }

    const isMember = await prisma.channelMember.findUnique({
      where: {
        channelId_userId: { channelId: channel.id, userId: session.user.id },
      },
    });

    if (!isMember) {
      await prisma.channelMember.create({
        data: { channelId: channel.id, userId: session.user.id },
      });
    }

    const message = await prisma.channelMessage.create({
      data: {
        channelId: channel.id,
        userId: session.user.id,
        content: content.trim(),
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
