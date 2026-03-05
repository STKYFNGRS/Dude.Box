import Parser from "rss-parser";
import { prisma } from "./prisma";

const parser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent": "DudeBox/2.0 RSS Aggregator",
  },
});

export async function fetchAndStoreFeeds() {
  const sources = await prisma.newsSource.findMany({
    where: { active: true },
  });

  const results = await Promise.allSettled(
    sources.map(async (source) => {
      try {
        const feed = await parser.parseURL(source.feedUrl);
        const items = (feed.items || []).slice(0, 20);

        for (const item of items) {
          if (!item.title || !item.link) continue;

          await prisma.newsFeedItem.upsert({
            where: {
              sourceId_url: {
                sourceId: source.id,
                url: item.link,
              },
            },
            update: {},
            create: {
              sourceId: source.id,
              title: item.title,
              url: item.link,
              description: item.contentSnippet || item.content || null,
              imageUrl: item.enclosure?.url || null,
              publishedAt: item.pubDate
                ? new Date(item.pubDate)
                : new Date(),
            },
          });
        }

        await prisma.newsSource.update({
          where: { id: source.id },
          data: { lastFetched: new Date() },
        });

        return { source: source.name, count: items.length };
      } catch (error) {
        console.error(`Failed to fetch ${source.name}:`, error);
        return { source: source.name, error: true };
      }
    })
  );

  return results;
}

export async function getAggregatedFeed(options?: {
  categoryId?: string;
  limit?: number;
}) {
  const rawLimit = (options?.limit || 50) * 3;
  const items = await prisma.newsFeedItem.findMany({
    where: options?.categoryId
      ? { source: { categoryId: options.categoryId } }
      : undefined,
    include: { source: { select: { name: true, url: true } } },
    orderBy: { publishedAt: "desc" },
    take: rawLimit,
  });

  const seen = new Set<string>();
  const deduped = [];
  for (const item of items) {
    const key = item.title.toLowerCase().trim();
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
    if (deduped.length >= (options?.limit || 50)) break;
  }
  return deduped;
}
