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

    const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${apiKey}/VIIRS_SNPP_NRT/world/2`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`FIRMS API responded with ${response.status}`);
    }

    const csvText = await response.text();
    const lines = csvText.trim().split("\n");
    const headers = lines[0].split(",");
    let upserted = 0;

    const latIdx = headers.indexOf("latitude");
    const lngIdx = headers.indexOf("longitude");
    const dateIdx = headers.indexOf("acq_date");
    const timeIdx = headers.indexOf("acq_time");
    const confIdx = headers.indexOf("confidence");
    const brightIdx = headers.indexOf("bright_ti4");

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",");
      const lat = parseFloat(cols[latIdx]);
      const lng = parseFloat(cols[lngIdx]);
      const acqDate = cols[dateIdx];
      const acqTime = cols[timeIdx];
      const confidence = cols[confIdx];
      const brightness = parseFloat(cols[brightIdx]);

      if (isNaN(lat) || isNaN(lng)) continue;

      const externalId = `FIRMS_${acqDate}_${lat.toFixed(3)}_${lng.toFixed(3)}_${acqTime}`;

      await prisma.conflictEvent.upsert({
        where: {
          source_externalId: { source: "FIRMS", externalId },
        },
        update: {
          date: new Date(`${acqDate}T${acqTime.padStart(4, "0").slice(0, 2)}:${acqTime.padStart(4, "0").slice(2)}:00Z`),
          lat,
          lng,
        },
        create: {
          title: `Wildfire detected (brightness: ${brightness || "N/A"})`,
          description: `Confidence: ${confidence || "N/A"}`,
          date: new Date(`${acqDate}T${acqTime.padStart(4, "0").slice(0, 2)}:${acqTime.padStart(4, "0").slice(2)}:00Z`),
          lat,
          lng,
          severity: mapFireSeverity(confidence),
          eventType: "DISASTER",
          source: "FIRMS",
          externalId,
        },
      });
      upserted++;
    }

    return NextResponse.json({
      success: true,
      fetched: lines.length - 1,
      upserted,
    });
  } catch (error) {
    console.error("FIRMS refresh failed:", error);
    return NextResponse.json(
      { error: "Failed to refresh FIRMS data" },
      { status: 500 }
    );
  }
}

function mapFireSeverity(confidence: string): "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" {
  const lower = (confidence || "").toLowerCase();
  if (lower === "high" || lower === "h") return "HIGH";
  if (lower === "nominal" || lower === "n") return "MEDIUM";
  return "LOW";
}
