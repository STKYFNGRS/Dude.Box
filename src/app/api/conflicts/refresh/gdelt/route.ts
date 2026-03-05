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

    const url = new URL("http://api.gdeltproject.org/api/v2/geo/geo");
    url.searchParams.set("query", "protest OR unrest OR demonstration");
    url.searchParams.set("format", "GeoJSON");
    url.searchParams.set("timespan", "7d");
    url.searchParams.set("maxpoints", "500");

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`GDELT API responded with ${response.status}`);
    }

    const geojson = await response.json();
    const features: any[] = geojson.features || [];
    let upserted = 0;

    for (const feature of features) {
      const props = feature.properties || {};
      const coords = feature.geometry?.coordinates;
      if (!coords || coords.length < 2) continue;

      const [lng, lat] = coords;
      const externalId = `GDELT_${props.urlpubtimedate || props.url || `${lat}_${lng}_${Date.now()}`}`;
      const title = props.name || props.html || "Protest event";

      await prisma.conflictEvent.upsert({
        where: {
          source_externalId: { source: "GDELT", externalId },
        },
        update: {
          title: title.slice(0, 500),
          date: props.urlpubtimedate ? new Date(props.urlpubtimedate) : new Date(),
          lat,
          lng,
          sourceUrl: props.url || null,
        },
        create: {
          title: title.slice(0, 500),
          description: props.html ? props.html.slice(0, 1000) : null,
          date: props.urlpubtimedate ? new Date(props.urlpubtimedate) : new Date(),
          lat,
          lng,
          severity: "MEDIUM",
          eventType: "PROTEST",
          source: "GDELT",
          externalId,
          sourceUrl: props.url || null,
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
    console.error("GDELT refresh failed:", error);
    return NextResponse.json(
      { error: "Failed to refresh GDELT data" },
      { status: 500 }
    );
  }
}
