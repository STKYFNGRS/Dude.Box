import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

/**
 * Creates a Stripe SetupIntent for vendor application payment
 * This collects payment method info for both the one-time fee and monthly subscription
 */
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

    // Get or create Stripe customer
    let customerId = user.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || undefined,
        metadata: {
          user_id: user.id,
        },
      });
      
      customerId = customer.id;
      
      // Update user with Stripe customer ID
      await prisma.user.update({
        where: { id: user.id },
        data: { stripe_customer_id: customerId },
      });
    }

    // Create SetupIntent to collect payment method for future charges
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        type: "vendor_application",
        user_id: user.id,
        subdomain,
        name,
        description: description || "",
        contact_email,
        application_fee_price: applicationFee.price.toString(),
        monthly_subscription_price: monthlySubscription.price.toString(),
        monthly_subscription_stripe_price_id: monthlySubscription.stripe_price_id,
      },
    });

    return NextResponse.json({
      clientSecret: setupIntent.client_secret,
      customerId,
      applicationFee: {
        amount: applicationFee.price,
        name: applicationFee.name,
      },
      monthlySubscription: {
        amount: monthlySubscription.price,
        name: monthlySubscription.name,
      },
    });
  } catch (error) {
    console.error("Error creating setup intent:", error);
    return NextResponse.json(
      { error: "Failed to create setup intent" },
      { status: 500 }
    );
  }
}
