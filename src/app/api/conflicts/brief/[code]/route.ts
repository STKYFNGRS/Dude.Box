import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeCII, COUNTRY_NAMES, getCountryFromHeadline } from "@/lib/conflict-data";
import { generateCountryBrief } from "@/lib/claude";
import type { CIIBreakdown } from "@/lib/conflict-data";

const ONE_HOUR_MS = 60 * 60 * 1000;

function shapeBriefResponse(
  record: {
    countryCode: string;
    ciiScore: number;
    ciiBreakdown: unknown;
    aiSummary: string | null;
    topHeadlines: unknown;
    computedAt: Date;
  },
  events: { id: string; title: string; date: Date; severity: string; eventType: string }[]
) {
  const breakdown = (record.ciiBreakdown ?? {
    conflictIntensity: 0,
    eventDensity: 0,
    unrestScore: 0,
    newsVelocity: 0,
  }) as CIIBreakdown;

  const rawHeadlines = (record.topHeadlines ?? []) as unknown[];
  const headlines = rawHeadlines.map((item) => {
    if (typeof item === "string") {
      return { title: item, url: "", publishedAt: "" };
    }
    const obj = item as { title?: string; publishedAt?: string };
    return {
      title: obj.title ?? "",
      url: "",
      publishedAt: obj.publishedAt ?? "",
    };
  });

  return {
    countryCode: record.countryCode,
    ciiScore: record.ciiScore,
    breakdown,
    aiSummary: record.aiSummary,
    headlines,
    events: events.map((e) => ({
      id: e.id,
      title: e.title,
      date: e.date.toISOString(),
      severity: e.severity,
      eventType: e.eventType,
    })),
    computedAt: record.computedAt,
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const countryCode = code.toUpperCase();

    // Fetch events by countryCode directly on the event, plus via zone linkage
    const zones = await prisma.conflictZone.findMany({
      where: { countryCode },
      select: { id: true },
    });
    const zoneIds = zones.map((z) => z.id);

    const events = await prisma.conflictEvent.findMany({
      where: {
        OR: [
          { countryCode },
          ...(zoneIds.length > 0 ? [{ zoneId: { in: zoneIds } }] : []),
        ],
      },
      orderBy: { date: "desc" },
      take: 20,
      select: { id: true, title: true, date: true, severity: true, eventType: true },
    });

    // Deduplicate events by id (in case both conditions match)
    const seen = new Set<string>();
    const uniqueEvents = events.filter((e) => {
      if (seen.has(e.id)) return false;
      seen.add(e.id);
      return true;
    });

    // Check for cached brief (also recompute if breakdown uses old schema)
    const forceRefresh = _request.nextUrl.searchParams.get("fresh") === "1";
    const cached = await prisma.countryBrief.findUnique({
      where: { countryCode },
    });

    const hasNewSchema = cached?.ciiBreakdown &&
      typeof cached.ciiBreakdown === "object" &&
      "conflictIntensity" in (cached.ciiBreakdown as Record<string, unknown>);

    if (!forceRefresh && cached && hasNewSchema && Date.now() - cached.computedAt.getTime() < ONE_HOUR_MS) {
      return NextResponse.json(shapeBriefResponse(cached, uniqueEvents));
    }

    // Compute fresh CII
    const cii = await computeCII(countryCode);

    // Gather recent headlines mentioning this country
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newsItems = await prisma.newsFeedItem.findMany({
      where: { publishedAt: { gte: sevenDaysAgo } },
      orderBy: { publishedAt: "desc" },
      take: 300,
      select: { title: true, publishedAt: true },
    });

    const allMatched = newsItems
      .filter((item) => getCountryFromHeadline(item.title) === countryCode);

    // Deduplicate similar headlines using Jaccard similarity
    const matchedItems: typeof allMatched = [];
    for (const item of allMatched) {
      const words = new Set(item.title.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(w => w.length > 3));
      let isDupe = false;
      for (const existing of matchedItems) {
        const existingWords = new Set(existing.title.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(w => w.length > 3));
        const intersection = [...words].filter(w => existingWords.has(w)).length;
        const union = new Set([...words, ...existingWords]).size;
        if (union > 0 && intersection / union > 0.5) { isDupe = true; break; }
      }
      if (!isDupe) matchedItems.push(item);
      if (matchedItems.length >= 15) break;
    }

    const headlines = matchedItems.map((item) => item.title);

    const countryInfo = COUNTRY_NAMES[countryCode];
    const countryName = countryInfo?.name || countryCode;
    const aiSummary =
      headlines.length > 0
        ? await generateCountryBrief(countryName, headlines)
        : `No recent headlines found for ${countryName}. CII score: ${cii.score}/100.`;

    const brief = await prisma.countryBrief.upsert({
      where: { countryCode },
      update: {
        ciiScore: cii.score,
        ciiBreakdown: cii.breakdown as any,
        aiSummary,
        topHeadlines: matchedItems.map((item) => ({
          title: item.title,
          publishedAt: item.publishedAt?.toISOString() ?? "",
        })) as any,
        computedAt: new Date(),
      },
      create: {
        countryCode,
        ciiScore: cii.score,
        ciiBreakdown: cii.breakdown as any,
        aiSummary,
        topHeadlines: matchedItems.map((item) => ({
          title: item.title,
          publishedAt: item.publishedAt?.toISOString() ?? "",
        })) as any,
      },
    });

    return NextResponse.json(shapeBriefResponse(brief, uniqueEvents));
  } catch (error) {
    console.error("Failed to generate country brief:", error);
    return NextResponse.json(
      { error: "Failed to generate country brief" },
      { status: 500 }
    );
  }
}
