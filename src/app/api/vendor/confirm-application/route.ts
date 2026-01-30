import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export const dynamic = 'force-dynamic';

/**
 * Confirms vendor application after SetupIntent succeeds
 * Charges the one-time fee and creates the subscription
 */
export async function POST(request: Request) {
  try {
    console.log("🔵 confirm-application: Starting...");
    
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      console.error("❌ confirm-application: No session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("✅ confirm-application: Session found for", session.user.email);

    const body = await request.json();
    const { setupIntentId } = body;

    console.log("🔵 confirm-application: SetupIntent ID:", setupIntentId);

    if (!setupIntentId) {
      console.error("❌ confirm-application: No setupIntentId provided");
      return NextResponse.json(
        { error: "Setup intent ID required" },
        { status: 400 }
      );
    }

    // Retrieve the SetupIntent to get metadata and payment method
    console.log("🔵 confirm-application: Retrieving SetupIntent from Stripe...");
    const setupIntent = await stripe.setupIntents.retrieve(setupIntentId);
    console.log("✅ confirm-application: SetupIntent retrieved, status:", setupIntent.status);

    if (setupIntent.status !== "succeeded") {
      return NextResponse.json(
        { error: "Payment method not confirmed" },
        { status: 400 }
      );
    }

    const metadata = setupIntent.metadata;
    const paymentMethodId = setupIntent.payment_method as string;

    if (!metadata || !metadata.user_id) {
      return NextResponse.json(
        { error: "Invalid setup intent" },
        { status: 400 }
      );
    }

    // Validate all required metadata fields exist
    const requiredFields = [
      'user_id', 'subdomain', 'name', 'contact_email',
      'application_fee_price', 'monthly_subscription_stripe_price_id'
    ];

    for (const field of requiredFields) {
      if (!metadata[field]) {
        console.error(`❌ confirm-application: Missing required metadata field: ${field}`);
        return NextResponse.json(
          { error: `Invalid application data: missing ${field}` },
          { status: 400 }
        );
      }
    }

    console.log("✅ confirm-application: All metadata fields validated");

    const user = await prisma.user.findUnique({
      where: { id: metadata.user_id },
      include: { owned_stores: true },
    });

    if (!user || user.email !== session.user.email) {
      return NextResponse.json(
        { error: "Invalid setup intent or unauthorized" },
        { status: 400 }
      );
    }

    // Check if user already has a store
    if (user.owned_stores.length > 0) {
      return NextResponse.json(
        { error: "You already have a store" },
        { status: 400 }
      );
    }

    // 1. Charge the one-time application fee
    console.log("🔵 confirm-application: Charging application fee...");
    const applicationFeeCharge = await stripe.paymentIntents.create({
      amount: Math.round(parseFloat(metadata.application_fee_price) * 100),
      currency: "usd",
      customer: setupIntent.customer as string,
      payment_method: paymentMethodId,
      off_session: true,
      confirm: true,
      description: "Vendor Application Fee - Dude.Box",
      metadata: {
        type: "application_fee",
        user_id: user.id,
      },
    });

    if (applicationFeeCharge.status === "requires_action") {
      console.error("❌ confirm-application: Payment requires additional authentication");
      return NextResponse.json(
        { error: "Payment requires additional authentication" },
        { status: 400 }
      );
    }

    if (applicationFeeCharge.status === "processing") {
      console.error("❌ confirm-application: Payment is still processing");
      return NextResponse.json(
        { error: "Payment is still processing. Please wait." },
        { status: 400 }
      );
    }

    if (applicationFeeCharge.status !== "succeeded") {
      console.error("❌ confirm-application: Application fee charge failed:", applicationFeeCharge.status);
      return NextResponse.json(
        { error: "Payment failed. Please try again." },
        { status: 400 }
      );
    }

    console.log("✅ confirm-application: Application fee charged successfully");

    // 2. Create the monthly subscription
    console.log("🔵 confirm-application: Creating subscription...");
    const subscription: Stripe.Subscription = await stripe.subscriptions.create({
      customer: setupIntent.customer as string,
      items: [
        {
          price: metadata.monthly_subscription_stripe_price_id,
        },
      ],
      default_payment_method: paymentMethodId,
      metadata: {
        type: "vendor_subscription",
        user_id: user.id,
      },
    });

    console.log("✅ confirm-application: Subscription created:", subscription.id);

    // Access current_period_end safely for later use
    const periodEnd = (subscription as any).current_period_end || Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60);
    const currentPeriodEnd = new Date(periodEnd * 1000);

    // 3-5. Wrap all database operations in a transaction for consistency
    console.log("🔵 confirm-application: Creating store and updating records in transaction...");
    const store = await prisma.$transaction(async (tx) => {
      // Create the store in pending status with complete payment tracking
      const newStore = await tx.store.create({
        data: {
          name: metadata.name,
          subdomain: metadata.subdomain,
          description: metadata.description || null,
          contact_email: metadata.contact_email,
          owner_id: user.id,
          status: "pending",
          stripe_onboarded: false,
          // Payment tracking fields
          application_paid: true,
          application_payment_id: applicationFeeCharge.id,
          monthly_subscription_id: subscription.id,
          subscription_status: "active",
          terms_accepted_at: new Date(),
        },
      });

      // Create subscription record in database
      await tx.subscription.create({
        data: {
          user_id: user.id,
          product_id: newStore.id, // Link to store
          stripe_subscription_id: subscription.id,
          stripe_customer_id: subscription.customer as string,
          status: subscription.status,
          current_period_end: currentPeriodEnd,
          cancel_at_period_end: false,
        },
      });

      // Update user role to vendor
      await tx.user.update({
        where: { id: user.id },
        data: { role: "vendor" },
      });

      return newStore;
    });

    console.log("✅ confirm-application: Store created:", store.id);
    console.log("🔵 confirm-application: Updating user role to vendor...");
    console.log(`✅✅✅ Vendor application completed for user ${user.email}`);
    console.log(`   Store: ${store.name} (${store.subdomain})`);
    console.log(`   Application fee: $${metadata.application_fee_price}`);
    console.log(`   Subscription: ${subscription.id}`);

    return NextResponse.json({
      success: true,
      storeId: store.id,
      storeName: store.name,
      subdomain: store.subdomain,
    });
  } catch (error: any) {
    console.error("Error confirming vendor application:", error);
    
    // Handle specific Stripe errors
    if (error.type === "StripeCardError") {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to process application. Please contact support." },
      { status: 500 }
    );
  }
}
