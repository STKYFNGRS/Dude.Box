import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { curateNewsFeed, extractConflictEvents } from "@/lib/claude";

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
      take: 150,
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

    let eventsCreated = 0;
    try {
      const forEventExtraction = curated.map((c) => ({
        title: c.title,
        summary: c.summary,
        region: c.region,
        topic: c.topic,
      }));

      const events = await extractConflictEvents(forEventExtraction);

      for (const event of events) {
        const existing = await prisma.conflictEvent.findFirst({
          where: {
            title: { contains: event.title.slice(0, 30), mode: "insensitive" },
            date: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
          },
        });
        if (existing) continue;

        try {
          await prisma.conflictEvent.create({
            data: {
              title: event.title,
              description: event.description,
              lat: event.lat,
              lng: event.lng,
              countryCode: event.countryCode,
              severity: event.severity,
              eventType: event.eventType,
              source: "AI_NEWS",
              externalId: `ai-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              date: new Date(),
            },
          });
          eventsCreated++;
        } catch {
          // skip duplicate or invalid events
        }
      }
    } catch (err) {
      console.error("Event extraction failed (non-fatal):", err);
    }

    return NextResponse.json({
      message: "Curation complete",
      processed: feedForAI.length,
      curated: created,
      eventsCreated,
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
