import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCountryCode } from "@/lib/country-lookup";

const USGS_FEED_URL =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

function verifyAccess(request: NextRequest, session: any): boolean {
  if (session?.user && (session.user as any).role === "ADMIN") return true;
  const cronSecret = request.headers.get("x-cron-secret");
  if (!cronSecret || !process.env.CRON_SECRET) return false;
  return cronSecret === process.env.CRON_SECRET;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!verifyAccess(request, session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(USGS_FEED_URL);
    if (!response.ok) {
      throw new Error(`USGS API responded with ${response.status}`);
    }

    const geojson = await response.json();
    const features: any[] = geojson.features || [];
    let upserted = 0;

    for (const feature of features) {
      const props = feature.properties;
      const coords = feature.geometry?.coordinates;
      if (!coords || coords.length < 2) continue;
      const [lng, lat] = coords;
      if (isNaN(lat) || isNaN(lng)) continue;

      const externalId = String(feature.id);
      const countryCode = getCountryCode(lat, lng);

      await prisma.conflictEvent.upsert({
        where: {
          source_externalId: { source: "USGS", externalId },
        },
        update: {
          title: props.title || `M${props.mag} Earthquake`,
          description: props.place || null,
          date: new Date(props.time),
          lat,
          lng,
          severity: mapMagnitudeSeverity(props.mag),
          sourceUrl: props.url || null,
          countryCode,
        },
        create: {
          title: props.title || `M${props.mag} Earthquake`,
          description: props.place || null,
          date: new Date(props.time),
          lat,
          lng,
          severity: mapMagnitudeSeverity(props.mag),
          eventType: "DISASTER",
          source: "USGS",
          externalId,
          sourceUrl: props.url || null,
          countryCode,
        },
      });
      upserted++;
    }

    return NextResponse.json({
      success: true,
      fetched: features.length,
      upserted,
    });
  } catch (error) {
    console.error("USGS refresh failed:", error);
    return NextResponse.json(
      { error: "Failed to refresh USGS data" },
      { status: 500 }
    );
  }
}

function mapMagnitudeSeverity(mag: number): "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" {
  if (mag >= 7) return "CRITICAL";
  if (mag >= 6) return "HIGH";
  if (mag >= 5) return "MEDIUM";
  return "LOW";
}
