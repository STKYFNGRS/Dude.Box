import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCountryCode } from "@/lib/country-lookup";

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

    const queries = [
      "conflict OR war OR military",
      "protest OR unrest OR demonstration OR riot",
      "terrorism OR attack OR bombing OR shooting",
      "disaster OR earthquake OR flood OR wildfire OR hurricane",
      "immigration OR border OR deportation",
    ];

    let totalFetched = 0;
    let upserted = 0;

    for (const query of queries) {
      const url = new URL("http://api.gdeltproject.org/api/v2/geo/geo");
      url.searchParams.set("query", query);
      url.searchParams.set("format", "GeoJSON");
      url.searchParams.set("timespan", "1440");
      url.searchParams.set("maxpoints", "250");

      let response: Response;
      try {
        response = await fetch(url.toString());
      } catch (fetchErr) {
        console.warn(`GDELT query "${query}" network error:`, fetchErr);
        continue;
      }
      if (!response.ok) {
        console.warn(`GDELT query "${query}" returned ${response.status}`);
        continue;
      }

      let geojson: any;
      try {
        geojson = await response.json();
      } catch {
        console.warn(`GDELT query "${query}" returned invalid JSON`);
        continue;
      }

      const features: any[] = geojson.features || [];
      totalFetched += features.length;

      for (const feature of features) {
        const props = feature.properties || {};
        const coords = feature.geometry?.coordinates;
        if (!coords || coords.length < 2) continue;

        const [lng, lat] = coords;
        if (isNaN(lat) || isNaN(lng)) continue;

        const dateKey = props.urlpubtimedate || "";
        const urlKey = props.url || "";
        const externalId = `GDELT_${dateKey || urlKey || `${lat.toFixed(3)}_${lng.toFixed(3)}_${Date.now()}`}`;
        const title = props.name || props.html || "Event";
        const eventType = query.includes("protest") ? "PROTEST" : query.includes("terrorism") ? "CONFLICT" : "MILITARY";

        let eventDate: Date;
        try {
          eventDate = dateKey ? new Date(dateKey) : new Date();
          if (isNaN(eventDate.getTime())) eventDate = new Date();
        } catch {
          eventDate = new Date();
        }

        const countryCode = getCountryCode(lat, lng);

        await prisma.conflictEvent.upsert({
          where: {
            source_externalId: { source: "GDELT", externalId },
          },
          update: {
            title: title.slice(0, 500),
            date: eventDate,
            lat,
            lng,
            sourceUrl: props.url || null,
            countryCode,
          },
          create: {
            title: title.slice(0, 500),
            description: props.html ? props.html.slice(0, 1000) : null,
            date: eventDate,
            lat,
            lng,
            severity: "MEDIUM",
            eventType,
            source: "GDELT",
            externalId,
            sourceUrl: props.url || null,
            countryCode,
          },
        });
        upserted++;
      }
    }

    return NextResponse.json({
      success: true,
      fetched: totalFetched,
      upserted,
    });
  } catch (error: any) {
    console.error("GDELT refresh failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to refresh GDELT data" },
      { status: 500 }
    );
  }
}
