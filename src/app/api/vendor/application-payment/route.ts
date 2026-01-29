import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { owned_stores: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user already has a store
    if (user.owned_stores.length > 0) {
      return NextResponse.json(
        { error: "You already have a store" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { subdomain, name, description, contact_email } = body;

    // Validate required fields
    if (!subdomain || !name || !contact_email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if subdomain is already taken
    const existingStore = await prisma.store.findUnique({
      where: { subdomain },
    });

    if (existingStore) {
      return NextResponse.json(
        { error: "Subdomain already taken" },
        { status: 400 }
      );
    }

    // Query platform products from database
    const [monthlySubscription, applicationFee] = await Promise.all([
      prisma.platformProduct.findFirst({
        where: { type: "monthly_subscription", active: true },
      }),
      prisma.platformProduct.findFirst({
        where: { type: "application_fee", active: true },
      }),
    ]);

    if (!monthlySubscription || !applicationFee) {
      console.error("Platform products not found in database");
      return NextResponse.json(
        { error: "Platform products not configured. Please contact support." },
        { status: 500 }
      );
    }

    // Create Stripe Checkout Session with BOTH subscription and one-time application fee
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: user.email,
      line_items: [
        {
          // Monthly subscription - from database
          price: monthlySubscription.stripe_price_id,
          quantity: 1,
        },
        {
          // One-time application fee - from database
          price: applicationFee.stripe_price_id,
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: {
          type: "vendor_subscription",
          user_id: user.id,
        },
      },
      metadata: {
        type: "vendor_application",
        user_id: user.id,
        subdomain,
        name,
        description: description || "",
        contact_email,
      },
      success_url: `${process.env.NEXTAUTH_URL}/members/become-vendor/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/members/become-vendor?payment=cancelled`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
