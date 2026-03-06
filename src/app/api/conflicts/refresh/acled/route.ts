import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function verifyAccess(request: NextRequest, session: any): boolean {
  if (session?.user && (session.user as any).role === "ADMIN") return true;
  const cronSecret = request.headers.get("x-cron-secret");
  if (!cronSecret || !process.env.CRON_SECRET) return false;
  return cronSecret === process.env.CRON_SECRET;
}

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAcledToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const email = process.env.ACLED_EMAIL;
  const password = process.env.ACLED_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "ACLED credentials not configured. Set ACLED_EMAIL and ACLED_PASSWORD in environment variables. " +
      "Register at https://developer.acleddata.com/ to obtain credentials."
    );
  }

  const body = new URLSearchParams({
    username: email,
    password: password,
    grant_type: "password",
    client_id: "acled",
  });

  const res = await fetch("https://acleddata.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`ACLED OAuth failed (${res.status}): ${errText}`);
  }

  const data = await res.json();
  if (!data.access_token) {
    throw new Error("ACLED OAuth response missing access_token");
  }

  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + 23 * 60 * 60 * 1000, // cache for 23h (token valid 24h)
  };

  return data.access_token;
}

const ISO3_TO_ISO2: Record<string, string> = {
  AFG: "AF", ALB: "AL", DZA: "DZ", AGO: "AO", ARG: "AR", ARM: "AM", AUS: "AU",
  AZE: "AZ", BHR: "BH", BGD: "BD", BLR: "BY", BEN: "BJ", BOL: "BO", BIH: "BA",
  BRA: "BR", BFA: "BF", BDI: "BI", KHM: "KH", CMR: "CM", CAF: "CF", TCD: "TD",
  CHL: "CL", CHN: "CN", COL: "CO", COD: "CD", COG: "CG", CRI: "CR", CIV: "CI",
  HRV: "HR", CUB: "CU", CYP: "CY", CZE: "CZ", DNK: "DK", DJI: "DJ", DOM: "DO",
  ECU: "EC", EGY: "EG", SLV: "SV", GNQ: "GQ", ERI: "ER", EST: "EE", SWZ: "SZ",
  ETH: "ET", FIN: "FI", FRA: "FR", GAB: "GA", GMB: "GM", GEO: "GE", DEU: "DE",
  GHA: "GH", GRC: "GR", GTM: "GT", GIN: "GN", GNB: "GW", GUY: "GY", HTI: "HT",
  HND: "HN", HUN: "HU", IND: "IN", IDN: "ID", IRN: "IR", IRQ: "IQ", IRL: "IE",
  ISR: "IL", ITA: "IT", JAM: "JM", JPN: "JP", JOR: "JO", KAZ: "KZ", KEN: "KE",
  PRK: "KP", KOR: "KR", KWT: "KW", KGZ: "KG", LAO: "LA", LVA: "LV", LBN: "LB",
  LSO: "LS", LBR: "LR", LBY: "LY", LTU: "LT", MDG: "MG", MWI: "MW", MYS: "MY",
  MLI: "ML", MRT: "MR", MEX: "MX", MDA: "MD", MNG: "MN", MNE: "ME", MAR: "MA",
  MOZ: "MZ", MMR: "MM", NAM: "NA", NPL: "NP", NLD: "NL", NZL: "NZ", NIC: "NI",
  NER: "NE", NGA: "NG", MKD: "MK", NOR: "NO", OMN: "OM", PAK: "PK", PAN: "PA",
  PNG: "PG", PRY: "PY", PER: "PE", PHL: "PH", POL: "PL", PRT: "PT", QAT: "QA",
  ROU: "RO", RUS: "RU", RWA: "RW", SAU: "SA", SEN: "SN", SRB: "RS", SLE: "SL",
  SGP: "SG", SVK: "SK", SVN: "SI", SOM: "SO", ZAF: "ZA", SSD: "SS", ESP: "ES",
  LKA: "LK", SDN: "SD", SUR: "SR", SWE: "SE", CHE: "CH", SYR: "SY", TWN: "TW",
  TJK: "TJ", TZA: "TZ", THA: "TH", TLS: "TL", TGO: "TG", TTO: "TT", TUN: "TN",
  TUR: "TR", TKM: "TM", UGA: "UG", UKR: "UA", ARE: "AE", GBR: "GB", USA: "US",
  URY: "UY", UZB: "UZ", VEN: "VE", VNM: "VN", YEM: "YE", ZMB: "ZM", ZWE: "ZW",
  PSE: "PS",
};

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!verifyAccess(request, session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let token: string;
    try {
      token = await getAcledToken();
    } catch (authErr: any) {
      return NextResponse.json(
        { error: authErr.message || "ACLED authentication failed" },
        { status: 503 }
      );
    }

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const dateStr = thirtyDaysAgo.toISOString().split("T")[0];
    const todayStr = new Date().toISOString().split("T")[0];

    const url = new URL("https://acleddata.com/api/acled/read");
    url.searchParams.set("_format", "json");
    url.searchParams.set("event_date", `${dateStr}|${todayStr}`);
    url.searchParams.set("event_date_where", "BETWEEN");
    url.searchParams.set("limit", "500");

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401 || response.status === 403) {
      cachedToken = null;
      const errBody = await response.text().catch(() => "");
      throw new Error(
        `ACLED API returned ${response.status}. This usually means your ACLED account ` +
        `needs API access enabled. Log in at https://acleddata.com and check your account settings. ` +
        `Response: ${errBody.slice(0, 200)}`
      );
    }
    if (!response.ok) {
      throw new Error(`ACLED API responded with ${response.status}`);
    }

    const data = await response.json();
    const events = data.data || [];
    let upserted = 0;

    for (const event of events) {
      const lat = parseFloat(event.latitude);
      const lng = parseFloat(event.longitude);
      if (isNaN(lat) || isNaN(lng)) continue;

      const externalId = String(event.data_id);
      const iso3 = event.iso3 || event.iso;
      const countryCode = iso3 ? (ISO3_TO_ISO2[iso3] || iso3.slice(0, 2)) : null;

      await prisma.conflictEvent.upsert({
        where: {
          source_externalId: { source: "ACLED", externalId },
        },
        update: {
          title: event.event_type || "Unknown event",
          description: event.notes || null,
          date: new Date(event.event_date),
          lat,
          lng,
          severity: mapAcledSeverity(event.fatalities),
          sourceUrl: event.source_url || null,
          countryCode,
        },
        create: {
          title: event.event_type || "Unknown event",
          description: event.notes || null,
          date: new Date(event.event_date),
          lat,
          lng,
          severity: mapAcledSeverity(event.fatalities),
          eventType: mapAcledEventType(event.event_type),
          source: "ACLED",
          externalId,
          sourceUrl: event.source_url || null,
          countryCode,
        },
      });
      upserted++;
    }

    return NextResponse.json({
      success: true,
      fetched: events.length,
      upserted,
    });
  } catch (error: any) {
    console.error("ACLED refresh failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to refresh ACLED data" },
      { status: 500 }
    );
  }
}

function mapAcledSeverity(fatalities: string | number): "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" {
  const count = typeof fatalities === "string" ? parseInt(fatalities, 10) : fatalities;
  if (isNaN(count)) return "LOW";
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
