import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

async function createPortalSession(): Promise<string> {
  // Get authenticated user session
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

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

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.subscriptions || user.subscriptions.length === 0) {
    throw new Error("No active subscription found");
  }

  const stripeCustomerId = user.subscriptions[0].stripe_customer_id;

  // Create Stripe Customer Portal session
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_DOMAIN || "http://localhost:3000"}/portal`,
  });

  return portalSession.url;
}

export async function GET(req: NextRequest) {
  try {
    const portalUrl = await createPortalSession();
    redirect(portalUrl);
  } catch (error) {
    console.error("Error in GET portal:", error);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const portalUrl = await createPortalSession();
    return NextResponse.json({ url: portalUrl });
  } catch (error) {
    console.error("Error in POST portal:", error);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}
