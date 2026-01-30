import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const dynamic = "force-dynamic";

// Knowledge base for common questions
const KNOWLEDGE_BASE = `
You are a helpful customer support assistant for Dude.Box, an e-commerce marketplace platform.

ABOUT DUDE.BOX:
- We're a marketplace connecting vendors with customers
- Vendors get custom subdomains (storename.dude.box)
- We handle payments via Stripe
- Platform fee: 1% per sale
- Monthly vendor subscription: $5
- Application fee: $5 (non-refundable)

CUSTOMER FAQS:
- How to create an account: Go to dude.box/portal/register
- How to reset password: Use "Forgot Password" on login page
- How to track orders: Log into your account at dude.box/members
- Return policy: Check the specific store's return policy on their store page
- Payment issues: Contact dude@dude.box

VENDOR FAQS:
- How to become a vendor: Apply at dude.box/members/become-vendor
- How to connect Stripe: After approval, go to vendor dashboard > settings
- How to add products: Vendor dashboard > Products > Add New
- Payout schedule: Stripe standard (typically 2 business days)
- Store customization: Vendor dashboard > Settings

PROHIBITED ITEMS (Vendors):
- Illegal drugs or drug paraphernalia
- Weapons without proper licensing
- Counterfeit goods
- Adult content
- Stolen items
- Live animals
- Human remains

CONTACT:
- Support email: dude@dude.box
- Website: https://www.dude.box

IMPORTANT RULES:
- Be helpful, friendly, and concise
- If you don't know something, admit it and suggest contacting dude@dude.box
- Never make up information
- For order-specific issues, direct users to contact support with order details
- For technical issues, suggest emailing support
`;

export async function POST(request: Request) {
  try {
    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY is not configured");
      return NextResponse.json(
        { error: "Chat service is not configured. Please contact support at dude@dude.box" },
        { status: 503 }
      );
    }

    // Initialize Anthropic SDK after verifying API key exists
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const body = await request.json();
    const { messages } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 }
      );
    }

    console.log("Processing chat request with", messages.length, "messages");

    // Use Brave Search for real-time info if question seems to need it
    let searchContext = "";
    const lastMessage = messages[messages.length - 1].content.toLowerCase();
    if (
      lastMessage.includes("latest") ||
      lastMessage.includes("current") ||
      lastMessage.includes("recent")
    ) {
      try {
        if (process.env.BRAVE_API_KEY) {
          const braveResponse = await fetch(
            `https://api.search.brave.com/res/v1/web/search?q=dude.box ${lastMessage.substring(0, 100)}`,
            {
              headers: {
                "X-Subscription-Token": process.env.BRAVE_API_KEY,
              },
            }
          );
          const braveData = await braveResponse.json();
          if (braveData.web?.results?.length > 0) {
            searchContext = `\n\nRECENT SEARCH RESULTS:\n${braveData.web.results
              .slice(0, 2)
              .map((r: any) => `- ${r.title}: ${r.description}`)
              .join("\n")}`;
          }
        }
      } catch (error) {
        console.error("Brave search error:", error);
        // Continue without search results
      }
    }

    console.log("Calling Anthropic API...");
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: KNOWLEDGE_BASE + searchContext,
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
    });

    console.log("Anthropic API response received");
    const messageContent =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ message: messageContent });
  } catch (error: any) {
    console.error("Chat API error details:", {
      message: error?.message,
      status: error?.status,
      type: error?.type,
      error: error
    });
    
    // Provide user-friendly error message
    return NextResponse.json(
      { error: "I'm having trouble connecting right now. Please try again or email dude@dude.box for assistance." },
      { status: 500 }
    );
  }
}
