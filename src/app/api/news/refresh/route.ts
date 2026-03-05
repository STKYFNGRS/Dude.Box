import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { fetchAndStoreFeeds } from "@/lib/rss";

export async function POST(request: NextRequest) {
  try {
    const cronSecret = request.headers.get("x-cron-secret");
    const isAuthorizedCron =
      cronSecret && cronSecret === process.env.CRON_SECRET;

    if (!isAuthorizedCron) {
      const session = await auth();
      if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const results = await fetchAndStoreFeeds();

    return NextResponse.json({ message: "Feed refresh complete", results });
  } catch (error) {
    console.error("Failed to refresh feeds:", error);
    return NextResponse.json(
      { error: "Failed to refresh feeds" },
      { status: 500 }
    );
  }
}
