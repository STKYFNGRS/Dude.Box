import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { curateNewsFeed } from "@/lib/claude";

export async function POST(request: NextRequest) {
  try {
    const cronSecret = request.headers.get("x-cron-secret");
    const isAuthorizedCron =
      cronSecret && cronSecret === process.env.CRON_SECRET;

    if (!isAuthorizedCron) {
      const session = await auth();
      if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const recentItems = await prisma.newsFeedItem.findMany({
      orderBy: { publishedAt: "desc" },
      take: 50,
      include: { source: { select: { name: true } } },
    });

    if (recentItems.length === 0) {
      return NextResponse.json({ message: "No feed items to curate", count: 0 });
    }

    const feedForAI = recentItems.map((item) => ({
      title: item.title,
      url: item.url,
      source: item.source.name,
      description: item.description ?? undefined,
    }));

    const curated = await curateNewsFeed(feedForAI);

    let created = 0;
    for (const item of curated) {
      try {
        await prisma.curatedNewsItem.create({
          data: {
            title: item.title,
            summary: item.summary,
            originalUrl: item.originalUrl,
            sourceName: item.sourceName,
            region: item.region || "Global",
            topic: item.topic || "General",
            importance: Math.min(5, Math.max(1, item.importance || 3)),
            rawFeedItemId: recentItems.find((r) => r.url === item.originalUrl)?.id,
          },
        });
        created++;
      } catch {
        // skip duplicates or invalid entries
      }
    }

    return NextResponse.json({
      message: "Curation complete",
      processed: feedForAI.length,
      curated: created,
    });
  } catch (error) {
    console.error("News curation failed:", error);
    return NextResponse.json(
      { error: "Curation failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const items = await prisma.curatedNewsItem.findMany({
      orderBy: { curatedAt: "desc" },
      take: 50,
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Failed to fetch curated news:", error);
    return NextResponse.json(
      { error: "Failed to fetch curated news" },
      { status: 500 }
    );
  }
}
