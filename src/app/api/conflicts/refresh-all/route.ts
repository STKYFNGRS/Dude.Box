import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

function verifyAccess(request: NextRequest, session: any): boolean {
  if (session?.user && (session.user as any).role === "ADMIN") return true;
  const cronSecret = request.headers.get("x-cron-secret");
  return !!cronSecret && cronSecret === process.env.CRON_SECRET;
}

const SOURCES = ["acled", "usgs", "firms", "gdelt"] as const;

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!verifyAccess(request, session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const origin = request.nextUrl.origin;
    const results: Record<string, { success: boolean; fetched?: number; upserted?: number; error?: string }> = {};

    for (const source of SOURCES) {
      try {
        const res = await fetch(`${origin}/api/conflicts/refresh/${source}`, {
          method: "POST",
          headers: {
            cookie: request.headers.get("cookie") ?? "",
            "x-cron-secret": process.env.CRON_SECRET ?? "",
          },
        });
        const data = await res.json();
        results[source] = res.ok
          ? { success: true, fetched: data.fetched, upserted: data.upserted }
          : { success: false, error: data.error ?? `HTTP ${res.status}` };
      } catch (err) {
        results[source] = { success: false, error: String(err) };
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Refresh-all failed:", error);
    return NextResponse.json({ error: "Refresh-all failed" }, { status: 500 });
  }
}
