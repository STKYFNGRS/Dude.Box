import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

/**
 * Confirms vendor application after SetupIntent succeeds
 * Charges the one-time fee and creates the subscription
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { setupIntentId } = body;

    if (!setupIntentId) {
      return NextResponse.json(
        { error: "Setup intent ID required" },
        { status: 400 }
      );
    }

    // Retrieve the SetupIntent to get metadata and payment method
    const setupIntent = await stripe.setupIntents.retrieve(setupIntentId);

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

    if (applicationFeeCharge.status !== "succeeded") {
      console.error("Application fee charge failed:", applicationFeeCharge);
      return NextResponse.json(
        { error: "Payment failed. Please try again." },
        { status: 400 }
      );
    }

    // 2. Create the monthly subscription
    const subscription = await stripe.subscriptions.create({
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

    // 3. Create the store in pending status
    const store = await prisma.store.create({
      data: {
        name: metadata.name,
        subdomain: metadata.subdomain,
        description: metadata.description || null,
        contact_email: metadata.contact_email,
        owner_id: user.id,
        status: "pending",
        stripe_onboarded: false,
      },
    });

    // 4. Create subscription record in database
    await prisma.subscription.create({
      data: {
        user_id: user.id,
        product_id: store.id, // Link to store
        stripe_subscription_id: subscription.id,
        stripe_customer_id: subscription.customer as string,
        status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000),
        cancel_at_period_end: false,
      },
    });

    // 5. Update user role to vendor
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "vendor" },
    });

    console.log(`✅ Vendor application completed for user ${user.email}`);
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
