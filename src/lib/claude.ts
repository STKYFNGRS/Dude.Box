import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export interface GeneratedArticle {
  title: string;
  content: string;
  excerpt: string;
  suggestedTags: string[];
}

export async function generateArticle(
  prompt: string,
  category: string
): Promise<GeneratedArticle> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: `You are a content writer for Dude.Box, a platform covering defense news, global conflicts, DIY projects, gear reviews, tactical content, and military history. Write engaging, well-researched articles that appeal to defense enthusiasts and "dudes" interested in these topics. Always respond with valid JSON.`,
    messages: [
      {
        role: "user",
        content: `Write an article for the "${category}" category based on this prompt: ${prompt}

Return a JSON object with these fields:
- title: A compelling headline
- content: The full article in markdown format (1000-2000 words)
- excerpt: A 2-3 sentence summary
- suggestedTags: An array of 3-5 relevant tags`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse AI response as JSON");
  }

  return JSON.parse(jsonMatch[0]);
}

export interface CuratedItem {
  title: string;
  summary: string;
  originalUrl: string;
  sourceName: string;
  region: string;
  topic: string;
  importance: number;
}

export async function curateNewsFeed(
  items: { title: string; url: string; source: string; description?: string }[]
): Promise<CuratedItem[]> {
  if (items.length === 0) return [];

  const batch = items.slice(0, 80);
  const itemsList = batch
    .map(
      (item, i) =>
        `[${i + 1}] "${item.title}" — ${item.source} — ${item.url}${item.description ? ` — ${item.description}` : ""}`
    )
    .join("\n");

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 16384,
    system: `You are an intelligence analyst curating a global news briefing. Analyze the headlines provided, select the most important and diverse stories, and create concise summaries. Assign each story a region, topic, and importance score. Always respond with valid JSON.`,
    messages: [
      {
        role: "user",
        content: `Curate these news items into a briefing. For each item worth covering, provide a summary and metadata.

${itemsList}

Return a JSON array of objects with these fields:
- title: A clear, compelling headline (rewrite if needed)
- summary: 2-3 sentence summary of the story and its significance
- originalUrl: The URL from the input
- sourceName: The source name from the input
- region: One of: "Americas", "Europe", "Middle East", "Africa", "Asia Pacific", "Global"
- topic: One of: "Conflict", "Politics", "Economics", "Security", "Technology", "Environment", "Society"
- importance: 1-5 (5 = critical breaking news, 1 = low priority)

Select 30-50 items for a comprehensive global briefing. Cover ALL regions (Americas, Europe, Middle East, Africa, Asia Pacific) and ALL topics (Conflict, Politics, Economics, Security, Technology, Environment, Society). Prioritize diversity of coverage. Skip duplicates but include as many distinct stories as possible.`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) return [];

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export interface ExtractedConflictEvent {
  title: string;
  description: string;
  lat: number;
  lng: number;
  countryCode: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  eventType: "CONFLICT" | "PROTEST" | "MILITARY" | "DISASTER";
}

export async function extractConflictEvents(
  items: { title: string; summary: string; region: string; topic: string }[]
): Promise<ExtractedConflictEvent[]> {
  if (items.length === 0) return [];

  const relevant = items.filter((i) =>
    ["Conflict", "Security", "Politics", "Environment", "Technology", "Society", "Economics"].includes(i.topic)
  );
  if (relevant.length === 0) return [];

  const itemsList = relevant
    .map((item, i) => `[${i + 1}] "${item.title}" — ${item.region} — ${item.summary}`)
    .join("\n");

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8192,
    system: `You are a geopolitical and domestic intelligence analyst. Extract geolocated events from news summaries worldwide, including DOMESTIC events in every country. You must provide accurate latitude/longitude coordinates and ISO 3166-1 alpha-2 country codes. Extract ALL of the following: armed conflicts, military operations, terrorist attacks, protests and civil unrest, police/law enforcement incidents, government policy actions, legislative battles, court rulings with major impact, natural disasters, industrial accidents, major cyber incidents, economic crises, immigration/border events, and significant societal disruptions. Do NOT focus only on international conflicts — domestic US, European, and other events are equally important. Always respond with valid JSON.`,
    messages: [
      {
        role: "user",
        content: `Extract geolocated events from these news summaries. Include BOTH international AND domestic events from every country mentioned. For the United States, extract events at the city level (Washington DC, New York, Los Angeles, etc.) — not just "US" generically.

${itemsList}

Return a JSON array of objects with these fields:
- title: Clear event title (60 chars max)
- description: 1-2 sentence description
- lat: Latitude (float, accurate to the city/region level)
- lng: Longitude (float, accurate to the city/region level)
- countryCode: ISO 3166-1 alpha-2 code (e.g. "US", "IL", "UA")
- severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" based on impact
- eventType: "CONFLICT" | "PROTEST" | "MILITARY" | "DISASTER"

Extract as many locatable events as possible. Include domestic policy events, protests, law enforcement actions, court rulings, economic crises, and disasters — not just wars. Return up to 30 events.`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) return [];

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    return Array.isArray(parsed)
      ? parsed.filter(
          (e: ExtractedConflictEvent) =>
            e.lat && e.lng && e.countryCode && e.title
        )
      : [];
  } catch {
    return [];
  }
}

export async function generateCountryBrief(
  countryName: string,
  headlines: string[]
): Promise<string> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: `You are a geopolitical intelligence analyst. Provide concise, factual intelligence briefs based on recent news headlines. Focus on security implications, regional stability, and strategic significance.`,
    messages: [
      {
        role: "user",
        content: `Generate a brief intelligence summary for ${countryName} based on these recent headlines:\n\n${headlines.map((h, i) => `[${i + 1}] ${h}`).join("\n")}\n\nProvide a 2-3 paragraph analysis covering current situation, key developments, and near-term outlook.`,
      },
    ],
  });

  return message.content[0].type === "text" ? message.content[0].text : "";
}
