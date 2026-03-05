import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function verifyAccess(request: NextRequest, session: any): boolean {
  if (session?.user && (session.user as any).role === "ADMIN") return true;
  const cronSecret = request.headers.get("x-cron-secret");
  return cronSecret === process.env.CRON_SECRET;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!verifyAccess(request, session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const dateStr = thirtyDaysAgo.toISOString().split("T")[0];

    const acledKey = process.env.ACLED_API_KEY;
    const acledEmail = process.env.ACLED_EMAIL;

    if (!acledKey || !acledEmail) {
      return NextResponse.json(
        { error: "ACLED API credentials not configured" },
        { status: 503 }
      );
    }

    const url = new URL("https://api.acleddata.com/acled/read");
    url.searchParams.set("key", acledKey);
    url.searchParams.set("email", acledEmail);
    url.searchParams.set("event_date", `${dateStr}|${new Date().toISOString().split("T")[0]}`);
    url.searchParams.set("event_date_where", "BETWEEN");
    url.searchParams.set("limit", "500");

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`ACLED API responded with ${response.status}`);
    }

    const data = await response.json();
    const events = data.data || [];
    let upserted = 0;

    for (const event of events) {
      const externalId = String(event.data_id);
      await prisma.conflictEvent.upsert({
        where: {
          source_externalId: { source: "ACLED", externalId },
        },
        update: {
          title: event.event_type || "Unknown event",
          description: event.notes || null,
          date: new Date(event.event_date),
          lat: parseFloat(event.latitude),
          lng: parseFloat(event.longitude),
          severity: mapAcledSeverity(event.fatalities),
          sourceUrl: event.source_url || null,
        },
        create: {
          title: event.event_type || "Unknown event",
          description: event.notes || null,
          date: new Date(event.event_date),
          lat: parseFloat(event.latitude),
          lng: parseFloat(event.longitude),
          severity: mapAcledSeverity(event.fatalities),
          eventType: mapAcledEventType(event.event_type),
          source: "ACLED",
          externalId,
          sourceUrl: event.source_url || null,
        },
      });
      upserted++;
    }

    return NextResponse.json({
      success: true,
      fetched: events.length,
      upserted,
    });
  } catch (error) {
    console.error("ACLED refresh failed:", error);
    return NextResponse.json(
      { error: "Failed to refresh ACLED data" },
      { status: 500 }
    );
  }
}

function mapAcledSeverity(fatalities: string | number): "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" {
  const count = typeof fatalities === "string" ? parseInt(fatalities, 10) : fatalities;
  if (count >= 50) return "CRITICAL";
  if (count >= 10) return "HIGH";
  if (count >= 1) return "MEDIUM";
  return "LOW";
}

function mapAcledEventType(eventType: string): "CONFLICT" | "PROTEST" | "DISASTER" | "MILITARY" {
  const lower = (eventType || "").toLowerCase();
  if (lower.includes("protest") || lower.includes("riot")) return "PROTEST";
  if (lower.includes("battle") || lower.includes("violence against civilians")) return "CONFLICT";
  if (lower.includes("strategic")) return "MILITARY";
  return "CONFLICT";
}
