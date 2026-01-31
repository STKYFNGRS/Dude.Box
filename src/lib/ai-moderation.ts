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

  const prompt = `You are a content moderation assistant for an e-commerce marketplace. Analyze the following content and provide guidance for human reviewers.

IMPORTANT: You are assisting human moderators, not making final decisions. Focus on identifying actual policy violations, not flagging legitimate products.

PROHIBITED CONTENT (SEVERE - Flag for urgent review):
- Explicit references to illegal drugs, narcotics, or controlled substances
- Drug paraphernalia or related items with clear drug use context
- Weapons, firearms, explosives (unless clearly for legitimate licensed purposes)
- Stolen goods or property
- Counterfeit or fake branded items (explicitly claiming to be brand name)
- Adult content or sexually explicit materials
- Live animals, human remains, body parts
- Content promoting violence, hate, or harm
- Illegal services or activities

QUESTIONABLE CONTENT (MODERATE - Flag for review):
- Misleading or deceptive product claims
- Spam-like content with excessive keywords or manipulation
- Products in gray-area categories that need clarification
- Suspicious combinations of vague descriptions with unusual pricing

LEGITIMATE PRODUCTS (CLEAN - Auto-approve):
- Normal retail products with reasonable descriptions
- Hobby items, crafts, collectibles, toys, electronics, etc.
- Generic product names are acceptable (e.g., "robot", "powder", "crystals" for legitimate items)
- Brief or simple descriptions are fine for obvious products

CONTENT TO ANALYZE:
${contentToCheck}

IMPORTANT: Only flag content with EXPLICIT violations or strong evidence of deception. Normal marketplace products should be marked as CLEAN, even if descriptions are brief or generic. Human admins will review flagged items.

Respond ONLY with valid JSON in this exact format:
{
  "isViolation": boolean,
  "severity": "severe" | "moderate" | "clean",
  "categories": ["category1", "category2"],
  "reason": "Brief explanation (max 200 chars)",
  "confidence": 0.0-1.0
}`;

  try {
    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("🚨 CRITICAL: ANTHROPIC_API_KEY not configured - FAILING CLOSED");
      // FAIL CLOSED - Treat as violation if moderation unavailable
      return {
        isViolation: true,
        severity: "severe",
        categories: ["moderation_failure"],
        reason: "Moderation system offline - flagged for manual review",
        confidence: 1.0,
      };
    }

    console.log("🔍 Running AI moderation check...");
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
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
    
    console.log("📝 AI moderation raw response:", responseText);
    
    const result: ModerationResult = JSON.parse(responseText);
    console.log("✅ AI moderation result:", {
      isViolation: result.isViolation,
      severity: result.severity,
      categories: result.categories,
      reason: result.reason,
      confidence: result.confidence,
    });
    
    return result;
  } catch (error: any) {
    console.error("🚨 AI Moderation error - FAILING CLOSED:", {
      message: error?.message,
      type: error?.type,
      status: error?.status,
    });
    
    // FAIL CLOSED - Treat as violation if moderation fails
    // This protects the platform when the AI is down
    return {
      isViolation: true,
      severity: "severe",
      categories: ["moderation_failure"],
      reason: "Moderation system error - flagged for manual review",
      confidence: 1.0,
    };
  }
}
