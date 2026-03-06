import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const zoneId = searchParams.get("zoneId");
    const eventType = searchParams.get("eventType");
    const since = searchParams.get("since");

    const where: Record<string, unknown> = {};
    if (zoneId) where.zoneId = zoneId;
    if (eventType) where.eventType = eventType;
    if (since) where.date = { gte: new Date(since) };

    const events = await prisma.conflictEvent.findMany({
      where,
      include: {
        zone: {
          select: {
            id: true,
            name: true,
            region: true,
            countryCode: true,
            status: true,
            severity: true,
          },
        },
      },
      orderBy: { date: "desc" },
      take: 500,
    });

    const enriched = events.map((e) => ({
      ...e,
      countryCode: e.countryCode ?? e.zone?.countryCode ?? null,
    }));

    // Deduplicate: keep highest-severity event per country+type+day+location
    const SEVERITY_RANK: Record<string, number> = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
    const deduped = new Map<string, (typeof enriched)[number]>();
    for (const ev of enriched) {
      const day = new Date(ev.date).toISOString().slice(0, 10);
      const locKey = `${Math.round(ev.lat)}_${Math.round(ev.lng)}`;
      const key = `${ev.countryCode ?? "UNK"}_${ev.eventType}_${day}_${locKey}`;
      const existing = deduped.get(key);
      if (!existing || (SEVERITY_RANK[ev.severity] ?? 0) > (SEVERITY_RANK[existing.severity] ?? 0)) {
        deduped.set(key, ev);
      }
    }

    return NextResponse.json(Array.from(deduped.values()));
  } catch (error) {
    console.error("Failed to fetch conflict events:", error);
    return NextResponse.json(
      { error: "Failed to fetch conflict events" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if ((session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, date, zoneId, sourceUrl, severity, eventType, lat, lng, source, externalId } = body;

    if (!title || lat == null || lng == null) {
      return NextResponse.json(
        { error: "title, lat, and lng are required" },
        { status: 400 }
      );
    }

    const event = await prisma.conflictEvent.create({
      data: {
        title,
        description,
        date: date ? new Date(date) : new Date(),
        zoneId: zoneId || null,
        sourceUrl,
        severity: severity ?? "MEDIUM",
        eventType: eventType ?? "CONFLICT",
        lat,
        lng,
        source: source || null,
        externalId: externalId || null,
      },
      include: {
        zone: {
          select: { id: true, name: true, region: true, countryCode: true },
        },
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Failed to create conflict event:", error);
    return NextResponse.json(
      { error: "Failed to create conflict event" },
      { status: 500 }
    );
  }
}
