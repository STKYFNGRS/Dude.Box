import { prisma } from "./prisma";

const COUNTRY_ALIASES: Record<string, string[]> = {
  US: ["united states", "america", "usa", "washington", "pentagon"],
  RU: ["russia", "moscow", "kremlin", "russian"],
  CN: ["china", "beijing", "chinese", "prc"],
  UA: ["ukraine", "kyiv", "ukrainian"],
  IR: ["iran", "tehran", "iranian"],
  IL: ["israel", "jerusalem", "tel aviv", "israeli"],
  TW: ["taiwan", "taipei", "taiwanese"],
  KP: ["north korea", "pyongyang", "dprk"],
  SA: ["saudi arabia", "riyadh", "saudi"],
  TR: ["turkey", "ankara", "turkish", "türkiye"],
  SY: ["syria", "damascus", "syrian"],
  YE: ["yemen", "sanaa", "yemeni"],
  MM: ["myanmar", "burma", "burmese"],
  PK: ["pakistan", "islamabad", "pakistani"],
  IN: ["india", "delhi", "indian"],
  DE: ["germany", "berlin", "german"],
  FR: ["france", "paris", "french"],
  GB: ["united kingdom", "britain", "london", "british", "uk"],
  JP: ["japan", "tokyo", "japanese"],
  KR: ["south korea", "seoul", "korean"],
  PL: ["poland", "warsaw", "polish"],
  VE: ["venezuela", "caracas", "venezuelan"],
  BR: ["brazil", "brasilia", "brazilian"],
};

export function getCountryFromHeadline(headline: string): string | null {
  const lower = headline.toLowerCase();
  for (const [code, aliases] of Object.entries(COUNTRY_ALIASES)) {
    for (const alias of aliases) {
      if (lower.includes(alias)) return code;
    }
  }
  return null;
}

interface CIIComponents {
  baselineRisk: number;
  conflictScore: number;
  unrestScore: number;
  newsVelocity: number;
}

export async function computeCII(countryCode: string): Promise<{
  score: number;
  breakdown: CIIComponents;
}> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const zone = await prisma.conflictZone.findFirst({
    where: { countryCode },
    orderBy: { severity: "asc" },
  });

  const baselineRisk = zone?.baselineRisk ?? 15;

  const conflictEvents = await prisma.conflictEvent.count({
    where: {
      zone: { countryCode },
      eventType: "CONFLICT",
      date: { gte: thirtyDaysAgo },
    },
  });

  const protestEvents = await prisma.conflictEvent.count({
    where: {
      zone: { countryCode },
      eventType: "PROTEST",
      date: { gte: thirtyDaysAgo },
    },
  });

  const newsItems = await prisma.newsFeedItem.count({
    where: {
      publishedAt: { gte: sevenDaysAgo },
      OR: (COUNTRY_ALIASES[countryCode] || [countryCode.toLowerCase()]).map(
        (alias) => ({
          title: { contains: alias, mode: "insensitive" as const },
        })
      ),
    },
  });

  const conflictScore = Math.min(100, conflictEvents * 5);
  const unrestScore = Math.min(100, protestEvents * 3);
  const newsVelocity = Math.min(100, newsItems * 2);

  const score = Math.round(
    baselineRisk * 0.4 +
      conflictScore * 0.25 +
      unrestScore * 0.15 +
      newsVelocity * 0.2
  );

  return {
    score: Math.min(100, Math.max(0, score)),
    breakdown: { baselineRisk, conflictScore, unrestScore, newsVelocity },
  };
}

export async function computeAllCII(): Promise<
  Record<string, { score: number; breakdown: CIIComponents }>
> {
  const countryCodes = Object.keys(COUNTRY_ALIASES);
  const results: Record<string, { score: number; breakdown: CIIComponents }> =
    {};

  await Promise.all(
    countryCodes.map(async (code) => {
      results[code] = await computeCII(code);
    })
  );

  return results;
}
