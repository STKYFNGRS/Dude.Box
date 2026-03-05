import { NextRequest, NextResponse } from "next/server";
import { getAggregatedFeed } from "@/lib/rss";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const categoryId = searchParams.get("categoryId") ?? undefined;
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    const items = await getAggregatedFeed({ categoryId, limit });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Failed to fetch news feed:", error);
    return NextResponse.json(
      { error: "Failed to fetch news feed" },
      { status: 500 }
    );
  }
}
