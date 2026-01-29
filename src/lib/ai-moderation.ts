import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface ModerationResult {
  isViolation: boolean;
  severity: "severe" | "moderate" | "clean";
  categories: string[];
  reason: string;
  confidence: number;
}

export async function moderateContent(params: {
  productName?: string;
  productDescription?: string;
  storeName?: string;
  storeDescription?: string;
  customText?: string;
}): Promise<ModerationResult> {
  const contentToCheck = Object.entries(params)
    .filter(([_, value]) => value)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");

  const prompt = `You are a content moderation system for an e-commerce marketplace. Analyze the following content for policy violations.

PROHIBITED CONTENT (SEVERE):
- Illegal drugs, drug paraphernalia, or substances
- Weapons, firearms, explosives (unless properly licensed)
- Stolen goods or property
- Counterfeit or fake items
- Adult content or sexually explicit materials
- Live animals, human remains, body parts
- Items promoting violence, hate, or harm
- Illegal services or activities

QUESTIONABLE CONTENT (MODERATE):
- Misleading or deceptive descriptions
- Spam-like content with excessive keywords
- Products in gray-area categories
- Multiple minor policy concerns

CONTENT TO ANALYZE:
${contentToCheck}

Respond ONLY with valid JSON in this exact format:
{
  "isViolation": boolean,
  "severity": "severe" | "moderate" | "clean",
  "categories": ["category1", "category2"],
  "reason": "Brief explanation (max 200 chars)",
  "confidence": 0.0-1.0
}`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseText = message.content[0].type === "text" 
      ? message.content[0].text 
      : "";
    
    const result: ModerationResult = JSON.parse(responseText);
    return result;
  } catch (error) {
    console.error("AI Moderation error:", error);
    // Fail open - allow content but log for manual review
    return {
      isViolation: false,
      severity: "clean",
      categories: [],
      reason: "Moderation system unavailable",
      confidence: 0,
    };
  }
}
