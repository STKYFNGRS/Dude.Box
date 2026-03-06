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

const GRID_SIZE = 0.5; // ~55 km cells
const MAX_GRID_CELLS = 200;

function gridKey(lat: number, lng: number): string {
  return `${Math.round(lat / GRID_SIZE) * GRID_SIZE}_${Math.round(lng / GRID_SIZE) * GRID_SIZE}`;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!verifyAccess(request, session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiKey = process.env.NASA_FIRMS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          message:
            "NASA FIRMS API key not configured. Set NASA_FIRMS_API_KEY in environment variables. " +
            "Register at https://firms.modaps.eosdis.nasa.gov/api/area/ to obtain a key.",
        },
        { status: 503 }
      );
    }

    const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${apiKey}/VIIRS_SNPP_NRT/world/1`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`FIRMS API responded with ${response.status}`);
    }

    const csvText = await response.text();
    const lines = csvText.trim().split("\n");
    if (lines.length < 2) {
      return NextResponse.json({ success: true, fetched: 0, upserted: 0 });
    }

    const headers = lines[0].split(",");
    const latIdx = headers.indexOf("latitude");
    const lngIdx = headers.indexOf("longitude");
    const dateIdx = headers.indexOf("acq_date");
    const timeIdx = headers.indexOf("acq_time");
    const confIdx = headers.indexOf("confidence");
    const brightIdx = headers.indexOf("bright_ti4");

    if (latIdx < 0 || lngIdx < 0 || dateIdx < 0) {
      throw new Error(`Unexpected FIRMS CSV headers: ${headers.join(",")}`);
    }

    interface FireRow {
      lat: number; lng: number; date: string; time: string;
      confidence: string; brightness: number;
    }

    // Spatial grid: keep only the brightest detection per 0.5-degree cell
    const gridMap = new Map<string, FireRow>();

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",");
      const lat = parseFloat(cols[latIdx]);
      const lng = parseFloat(cols[lngIdx]);
      if (isNaN(lat) || isNaN(lng)) continue;

      const confidence = confIdx >= 0 ? (cols[confIdx] || "").trim().toLowerCase() : "";
      if (confidence !== "high" && confidence !== "h") continue;

      const brightness = brightIdx >= 0 ? parseFloat(cols[brightIdx]) : 0;
      const key = gridKey(lat, lng);
      const existing = gridMap.get(key);
      if (!existing || brightness > existing.brightness) {
        gridMap.set(key, {
          lat, lng,
          date: cols[dateIdx] || "",
          time: timeIdx >= 0 ? (cols[timeIdx] || "0000") : "0000",
          confidence: cols[confIdx] || "",
          brightness,
        });
      }
    }

    const gridded = [...gridMap.values()]
      .sort((a, b) => b.brightness - a.brightness)
      .slice(0, MAX_GRID_CELLS);

    let upserted = 0;
    for (const row of gridded) {
      const t = row.time.padStart(4, "0");
      const dateStr = `${row.date}T${t.slice(0, 2)}:${t.slice(2)}:00Z`;
      let eventDate: Date;
      try {
        eventDate = new Date(dateStr);
        if (isNaN(eventDate.getTime())) eventDate = new Date();
      } catch {
        eventDate = new Date();
      }

      const gk = gridKey(row.lat, row.lng);
      const externalId = `FIRMS_${row.date}_${gk}`;
      const countryCode = getCountryCode(row.lat, row.lng);

      await prisma.conflictEvent.upsert({
        where: {
          source_externalId: { source: "FIRMS", externalId },
        },
        update: {
          date: eventDate,
          lat: row.lat,
          lng: row.lng,
          countryCode,
        },
        create: {
          title: `Wildfire detected (brightness: ${row.brightness || "N/A"})`,
          description: `Confidence: ${row.confidence || "N/A"}`,
          date: eventDate,
          lat: row.lat,
          lng: row.lng,
          severity: "HIGH",
          eventType: "DISASTER",
          source: "FIRMS",
          externalId,
          countryCode,
        },
      });
      upserted++;
    }

    return NextResponse.json({
      success: true,
      fetched: lines.length - 1,
      gridCells: gridMap.size,
      upserted,
    });
  } catch (error: any) {
    console.error("FIRMS refresh failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to refresh FIRMS data" },
      { status: 500 }
    );
  }
}
