import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    console.log("🔧 Portal POST request received");
    
    // Get authenticated user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      console.log("❌ No session found");
      return NextResponse.json(
        { error: "You must be logged in to access the customer portal" },
        { status: 401 }
      );
    }

    console.log("✅ User session found:", session.user.email);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        subscriptions: {
          where: {
            status: {
              in: ["active", "past_due", "trialing"],
            },
          },
          take: 1,
        },
      },
    });

    console.log("📊 User query result:", {
      found: !!user,
      subscriptionCount: user?.subscriptions?.length || 0,
      subscriptionData: user?.subscriptions?.[0] ? {
        id: user.subscriptions[0].id,
        stripe_subscription_id: user.subscriptions[0].stripe_subscription_id,
        stripe_customer_id: user.subscriptions[0].stripe_customer_id,
        status: user.subscriptions[0].status,
      } : null
    });

    if (!user) {
      console.log("❌ User not found in database");
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (!user.subscriptions || user.subscriptions.length === 0) {
      console.log("❌ No active subscriptions found for user");
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      );
    }

    const stripeCustomerId = user.subscriptions[0].stripe_customer_id;
    console.log("🎯 Creating portal session for customer:", stripeCustomerId);

    // Create Stripe Customer Portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_DOMAIN || "http://localhost:3000"}/portal`,
    });

    console.log("✅ Portal session created:", portalSession.url);
    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("❌ Error creating portal session:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}
