import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { randomUUID } from "crypto";

export const dynamic = 'force-dynamic';

/**
 * Confirms vendor application after SetupIntent succeeds
 * DATABASE-FIRST APPROACH: Creates records before charging to prevent data loss
 * 
 * Flow:
 * 1. Validate session and setupIntent
 * 2. Check idempotency (prevent duplicate processing)
 * 3. Create store with "pending_payment" status
 * 4. Charge Stripe application fee
 * 5. Create Stripe subscription
 * 6. Update store to "pending" status with payment IDs
 * 7. Create subscription record in DB
 * 8. Update user role to vendor
 * 
 * If Stripe fails after step 3, we can clean up the pending_payment store
 * If DB fails after Stripe succeeds, we have payment_id to reconcile manually
 */
export async function POST(request: Request) {
  const requestId = randomUUID();
  let setupIntentId = "unknown";
  let createdStoreId: string | null = null;
  
  try {
    console.log(`🔵 [${requestId}] confirm-application: Starting...`);
    
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      console.error(`❌ [${requestId}] No session`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(`✅ [${requestId}] Session found for ${session.user.email}`);

    const body = await request.json();
    setupIntentId = body.setupIntentId;

    console.log(`🔵 [${requestId}] SetupIntent ID: ${setupIntentId}`);

    if (!setupIntentId) {
      console.error(`❌ [${requestId}] No setupIntentId provided`);
      return NextResponse.json(
        { error: "Setup intent ID required" },
        { status: 400 }
      );
    }

    // STEP 1: Retrieve the SetupIntent to get metadata and payment method
    console.log(`🔵 [${requestId}] Retrieving SetupIntent from Stripe...`);
    const setupIntent = await stripe.setupIntents.retrieve(setupIntentId);
    console.log(`✅ [${requestId}] SetupIntent retrieved, status: ${setupIntent.status}`);

    if (setupIntent.status !== "succeeded") {
      console.error(`❌ [${requestId}] SetupIntent not succeeded: ${setupIntent.status}`);
      return NextResponse.json(
        { error: "Payment method not confirmed" },
        { status: 400 }
      );
    }

    const metadata = setupIntent.metadata;
    const paymentMethodId = setupIntent.payment_method as string;

    // STEP 2: Validate metadata
    if (!metadata || !metadata.user_id) {
      console.error(`❌ [${requestId}] Missing metadata or user_id`);
      return NextResponse.json(
        { error: "Invalid setup intent" },
        { status: 400 }
      );
    }

    const requiredFields = [
      'user_id', 'subdomain', 'name', 'contact_email',
      'application_fee_price', 'monthly_subscription_stripe_price_id'
    ];

    for (const field of requiredFields) {
      if (!metadata[field]) {
        console.error(`❌ [${requestId}] Missing required metadata field: ${field}`);
        return NextResponse.json(
          { error: `Invalid application data: missing ${field}` },
          { status: 400 }
        );
      }
    }

    console.log(`✅ [${requestId}] All metadata fields validated`);

    const user = await prisma.user.findUnique({
      where: { id: metadata.user_id },
      include: { owned_stores: true },
    });

    if (!user || user.email !== session.user.email) {
      console.error(`❌ [${requestId}] User not found or email mismatch`);
      return NextResponse.json(
        { error: "Invalid setup intent or unauthorized" },
        { status: 400 }
      );
    }

    // STEP 3: Check idempotency - has this setupIntent been processed?
    const existingStoreBySetupIntent = await prisma.store.findFirst({
      where: {
        OR: [
          { application_payment_id: setupIntentId },
          { monthly_subscription_id: setupIntentId }
        ]
      }
    });

    if (existingStoreBySetupIntent) {
      console.log(`⚠️ [${requestId}] SetupIntent already processed, returning existing store`);
      return NextResponse.json({
        success: true,
        storeId: existingStoreBySetupIntent.id,
        storeName: existingStoreBySetupIntent.name,
        subdomain: existingStoreBySetupIntent.subdomain,
        note: "Application already processed"
      });
    }

    // Check if user already has a store
    if (user.owned_stores.length > 0) {
      console.error(`❌ [${requestId}] User already has a store: ${user.owned_stores[0].id}`);
      return NextResponse.json(
        { error: "You already have a store" },
        { status: 400 }
      );
    }

    // Get the monthly subscription platform product
    console.log(`🔵 [${requestId}] Fetching platform product...`);
    const monthlyProduct = await prisma.platformProduct.findFirst({
      where: { 
        stripe_price_id: metadata.monthly_subscription_stripe_price_id,
        active: true 
      },
    });

    if (!monthlyProduct) {
      console.error(`❌ [${requestId}] Monthly subscription product not found`);
      return NextResponse.json(
        { error: "Platform configuration error. Please contact support." },
        { status: 500 }
      );
    }

    console.log(`✅ [${requestId}] Platform product found: ${monthlyProduct.id}`);

    // STEP 4: DATABASE-FIRST - Create store with pending_payment status
    // This creates the record BEFORE charging, so we can track partial completions
    console.log(`🔵 [${requestId}] Creating store with pending_payment status...`);
    
    const pendingStore = await prisma.store.create({
      data: {
        name: metadata.name,
        subdomain: metadata.subdomain,
        description: metadata.description || null,
        contact_email: metadata.contact_email,
        owner_id: user.id,
        status: "pending_payment", // Special status to indicate payment in progress
        stripe_onboarded: false,
        application_paid: false,
        terms_accepted_at: new Date(),
      },
    });

    createdStoreId = pendingStore.id;
    console.log(`✅ [${requestId}] Store created with pending_payment status: ${createdStoreId}`);

    // STEP 5: Now charge Stripe application fee
    console.log(`🔵 [${requestId}] Charging application fee...`);
    let applicationFeeCharge: Stripe.PaymentIntent;
    
    try {
      applicationFeeCharge = await stripe.paymentIntents.create({
        amount: Math.round(parseFloat(metadata.application_fee_price) * 100),
        currency: "usd",
        customer: setupIntent.customer as string,
        payment_method: paymentMethodId,
        off_session: true,
        confirm: true,
        description: `Vendor Application Fee - ${metadata.name}`,
        metadata: {
          type: "application_fee",
          user_id: user.id,
          store_id: pendingStore.id,
          request_id: requestId,
          setupIntent_id: setupIntentId,
        },
      });

      if (applicationFeeCharge.status === "requires_action") {
        console.error(`❌ [${requestId}] Payment requires additional authentication`);
        // Clean up pending store
        await prisma.store.delete({ where: { id: pendingStore.id } });
        return NextResponse.json(
          { error: "Payment requires additional authentication" },
          { status: 400 }
        );
      }

      if (applicationFeeCharge.status === "processing") {
        console.error(`❌ [${requestId}] Payment is still processing`);
        // Clean up pending store
        await prisma.store.delete({ where: { id: pendingStore.id } });
        return NextResponse.json(
          { error: "Payment is still processing. Please wait." },
          { status: 400 }
        );
      }

      if (applicationFeeCharge.status !== "succeeded") {
        console.error(`❌ [${requestId}] Application fee charge failed: ${applicationFeeCharge.status}`);
        // Clean up pending store
        await prisma.store.delete({ where: { id: pendingStore.id } });
        return NextResponse.json(
          { error: "Payment failed. Please try again." },
          { status: 400 }
        );
      }

      console.log(`✅ [${requestId}] Application fee charged successfully: ${applicationFeeCharge.id}`);
    } catch (stripeError: any) {
      console.error(`❌ [${requestId}] Stripe application fee error:`, stripeError.message);
      // Clean up pending store
      await prisma.store.delete({ where: { id: pendingStore.id } });
      throw stripeError;
    }

    // STEP 6: Create the monthly subscription
    console.log(`🔵 [${requestId}] Creating subscription...`);
    let subscription: Stripe.Subscription;
    
    try {
      subscription = await stripe.subscriptions.create({
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
          store_id: pendingStore.id,
          request_id: requestId,
        },
      });

      console.log(`✅ [${requestId}] Subscription created: ${subscription.id}`);
    } catch (stripeError: any) {
      console.error(`❌ [${requestId}] Stripe subscription error:`, stripeError.message);
      console.error(`⚠️ [${requestId}] CRITICAL: Application fee charged but subscription failed!`);
      console.error(`⚠️ [${requestId}] Payment ID: ${applicationFeeCharge.id}`);
      console.error(`⚠️ [${requestId}] Store ID: ${pendingStore.id}`);
      console.error(`⚠️ [${requestId}] Manual intervention required to refund or retry`);
      
      // Don't delete store - mark as payment_failed for manual review
      await prisma.store.update({
        where: { id: pendingStore.id },
        data: {
          status: "payment_failed",
          application_payment_id: applicationFeeCharge.id,
        },
      });
      
      throw stripeError;
    }

    // Access current_period_end safely
    const periodEnd = (subscription as any).current_period_end || Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60);
    const currentPeriodEnd = new Date(periodEnd * 1000);

    // STEP 7: Update store and create related records in transaction
    console.log(`🔵 [${requestId}] Updating store and creating records in transaction...`);
    
    const finalStore = await prisma.$transaction(async (tx) => {
      // Update store to pending status with payment info
      const updatedStore = await tx.store.update({
        where: { id: pendingStore.id },
        data: {
          status: "pending", // Now pending admin approval
          application_paid: true,
          application_payment_id: applicationFeeCharge.id,
          monthly_subscription_id: subscription.id,
          subscription_status: "active",
          next_billing_date: currentPeriodEnd,
        },
      });

      // Create subscription record in database
      await tx.subscription.create({
        data: {
          user_id: user.id,
          product_id: monthlyProduct.id,
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

      return updatedStore;
    });

    console.log(`✅ [${requestId}] Transaction completed successfully`);
    console.log(`🎉🎉🎉 [${requestId}] Vendor application completed for ${user.email}`);
    console.log(`   Store: ${finalStore.name} (${finalStore.subdomain})`);
    console.log(`   Application fee: $${metadata.application_fee_price} - ${applicationFeeCharge.id}`);
    console.log(`   Subscription: ${subscription.id}`);

    return NextResponse.json({
      success: true,
      storeId: finalStore.id,
      storeName: finalStore.name,
      subdomain: finalStore.subdomain,
    });
    
  } catch (error: any) {
    console.error(`❌❌❌ [${requestId}] Error confirming vendor application`);
    console.error(`   SetupIntent: ${setupIntentId}`);
    console.error(`   Store ID: ${createdStoreId || "not created"}`);
    console.error(`   Error type: ${error.type || "Unknown"}`);
    console.error(`   Error message: ${error.message}`);
    if (error.stack) {
      console.error(`   Error stack: ${error.stack}`);
    }
    
    // Handle specific Stripe errors
    if (error.type === "StripeCardError") {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    // Return detailed error for debugging
    return NextResponse.json(
      { 
        error: "Failed to process application. Please contact support.",
        details: error.message,
        type: error.type || "Unknown",
        requestId: requestId,
      },
      { status: 500 }
    );
  }
}
