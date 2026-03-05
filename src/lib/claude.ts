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

  const batch = items.slice(0, 30);
  const itemsList = batch
    .map(
      (item, i) =>
        `[${i + 1}] "${item.title}" — ${item.source} — ${item.url}${item.description ? ` — ${item.description}` : ""}`
    )
    .join("\n");

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
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

Select the 10-20 most newsworthy items. Skip duplicates and trivial stories.`,
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
