import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const channels = await prisma.channel.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: { select: { members: true, messages: true } },
      },
    });

    const session = await auth();
    let memberChannelIds: string[] = [];
    if (session?.user?.id) {
      const memberships = await prisma.channelMember.findMany({
        where: { userId: session.user.id },
        select: { channelId: true, lastReadAt: true },
      });
      memberChannelIds = memberships.map((m) => m.channelId);
    }

    const result = channels.map((ch) => ({
      id: ch.id,
      name: ch.name,
      slug: ch.slug,
      description: ch.description,
      icon: ch.icon,
      memberCount: ch._count.members,
      messageCount: ch._count.messages,
      joined: memberChannelIds.includes(ch.id),
    }));

    return NextResponse.json(result);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { name, description, icon } = await request.json();
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const channel = await prisma.channel.create({
      data: { name, slug, description, icon },
    });

    return NextResponse.json(channel, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create channel" }, { status: 500 });
  }
}
