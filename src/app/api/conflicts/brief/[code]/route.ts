import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeCII, getCountryFromHeadline } from "@/lib/conflict-data";
import { generateCountryBrief } from "@/lib/claude";

const ONE_HOUR_MS = 60 * 60 * 1000;

const COUNTRY_NAMES: Record<string, string> = {
  US: "United States", RU: "Russia", CN: "China", UA: "Ukraine",
  IR: "Iran", IL: "Israel", TW: "Taiwan", KP: "North Korea",
  SA: "Saudi Arabia", TR: "Turkey", SY: "Syria", YE: "Yemen",
  MM: "Myanmar", PK: "Pakistan", IN: "India", DE: "Germany",
  FR: "France", GB: "United Kingdom", JP: "Japan", KR: "South Korea",
  PL: "Poland", VE: "Venezuela", BR: "Brazil",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const countryCode = code.toUpperCase();

    const cached = await prisma.countryBrief.findUnique({
      where: { countryCode },
    });

    if (cached && Date.now() - cached.computedAt.getTime() < ONE_HOUR_MS) {
      return NextResponse.json(cached);
    }

    const cii = await computeCII(countryCode);

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newsItems = await prisma.newsFeedItem.findMany({
      where: { publishedAt: { gte: sevenDaysAgo } },
      orderBy: { publishedAt: "desc" },
      take: 200,
      select: { title: true },
    });

    const headlines = newsItems
      .filter((item) => getCountryFromHeadline(item.title) === countryCode)
      .map((item) => item.title)
      .slice(0, 15);

    const countryName = COUNTRY_NAMES[countryCode] || countryCode;
    const aiSummary =
      headlines.length > 0
        ? await generateCountryBrief(countryName, headlines)
        : `No recent headlines found for ${countryName}. CII score: ${cii.score}/100.`;

    const brief = await prisma.countryBrief.upsert({
      where: { countryCode },
      update: {
        ciiScore: cii.score,
        ciiBreakdown: cii.breakdown as any,
        aiSummary,
        topHeadlines: headlines as any,
        computedAt: new Date(),
      },
      create: {
        countryCode,
        ciiScore: cii.score,
        ciiBreakdown: cii.breakdown as any,
        aiSummary,
        topHeadlines: headlines as any,
      },
    });

    return NextResponse.json(brief);
  } catch (error) {
    console.error("Failed to generate country brief:", error);
    return NextResponse.json(
      { error: "Failed to generate country brief" },
      { status: 500 }
    );
  }
}
