import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { calculatePlatformFees, dollarsToCents } from "@/lib/marketplace";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "You must be logged in to subscribe" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { priceId, storeId } = body;

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 }
      );
    }

    // If storeId provided, fetch store for marketplace checkout
    let store = null;
    if (storeId) {
      store = await prisma.store.findUnique({
        where: { id: storeId, status: "approved" },
      });

      if (!store) {
        return NextResponse.json(
          { error: "Store not found or not approved" },
          { status: 404 }
        );
      }

      if (!store.stripe_onboarded || !store.stripe_account_id) {
        return NextResponse.json(
          { error: "Store has not connected Stripe yet" },
          { status: 400 }
        );
      }
    }

    // Get user from database to include user ID in metadata
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        subscriptions: {
          where: {
            status: {
              in: ["active", "past_due", "trialing"],
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user already has an active subscription
    if (user.subscriptions && user.subscriptions.length > 0) {
      const activeSub = user.subscriptions[0];
      
      // If subscription is cancelled but still active, allow new subscription
      if (!activeSub.cancel_at_period_end) {
        return NextResponse.json(
          { error: "You already have an active subscription. Please manage it from your portal.", redirectTo: "/portal" },
          { status: 400 }
        );
      }
    }

    // Log checkout attempt
    console.log(`Creating checkout session for user: ${user.email}`);
    console.log(`Using Stripe Price ID: ${priceId}`);
    if (store) {
      console.log(`Marketplace checkout for store: ${store.name} (${store.subdomain})`);
    }

    // Build checkout session config
    const checkoutConfig: any = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: session.user.email,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'], // US and Canada
      },
      metadata: {
        userId: user.id,
        ...(storeId && { storeId }),
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          ...(storeId && { storeId }),
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_DOMAIN || "http://localhost:3000"}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_DOMAIN || "http://localhost:3000"}/products/subscription-box`,
    };

    // If marketplace checkout, add Stripe Connect payment_intent_data
    // Note: For subscriptions, we handle the platform fee at the invoice level in webhooks
    // For one-time payments, we would use payment_intent_data here
    if (store && store.stripe_account_id) {
      // For subscription-based marketplace, platform fee is handled via application_fee_percent
      // or via invoice webhooks. We'll track this in the Order/PlatformTransaction models.
      checkoutConfig.metadata.connectedAccountId = store.stripe_account_id;
    }

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create(checkoutConfig);

    console.log(`✅ Checkout session created: ${checkoutSession.id}`);

    return NextResponse.json({ 
      url: checkoutSession.url,
      sessionId: checkoutSession.id 
    });
  } catch (error: any) {
    console.error("❌ Error creating checkout session:", error);
    
    // Provide more helpful error messages
    let errorMessage = "Failed to create checkout session";
    
    if (error?.type === 'StripeInvalidRequestError') {
      if (error.message?.includes('price')) {
        errorMessage = "Invalid Stripe Price ID. Please run: npm run setup:stripe";
      } else if (error.message?.includes('key')) {
        errorMessage = "Stripe API key not configured. Check your .env file";
      } else {
        errorMessage = error.message || errorMessage;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
