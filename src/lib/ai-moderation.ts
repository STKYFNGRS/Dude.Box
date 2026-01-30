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

CRITICAL: Be VERY suspicious of vague or coded language that could be hiding illegal items.

PROHIBITED CONTENT (SEVERE - AUTO-HIDE):
- Illegal drugs, narcotics, or controlled substances (including vague references like "powder", "crystals", "snow", "white", "pure", slang terms, or euphemisms)
- Drug paraphernalia or related items
- Weapons, firearms, explosives (unless clearly for legitimate licensed purposes)
- Stolen goods or property
- Counterfeit or fake branded items
- Adult content or sexually explicit materials
- Live animals, human remains, body parts
- Items promoting violence, hate, or harm
- Illegal services or activities

RED FLAGS (treat as SEVERE if present):
- Vague product names combined with suspicious descriptions ("the real deal", "pure", "fresh", "imported")
- Geographic references commonly associated with drugs (Colombian, Peruvian, etc.) + vague product terms
- Unusually low prices for vague products
- Coded language or intentional misspellings to evade detection

QUESTIONABLE CONTENT (MODERATE - FLAG FOR REVIEW):
- Extremely vague product descriptions that could be hiding something
- Misleading or deceptive descriptions
- Spam-like content with excessive keywords
- Products in gray-area categories
- Multiple minor policy concerns

CONTENT TO ANALYZE:
${contentToCheck}

BE STRICT: When in doubt about vague content, flag it as at least MODERATE. If it combines multiple red flags, mark as SEVERE.

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
      model: "claude-3-5-sonnet-latest",
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
