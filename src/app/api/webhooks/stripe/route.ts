import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmation, sendSubscriptionConfirmation } from "@/lib/email";
import { calculatePlatformFees } from "@/lib/marketplace";
import Stripe from "stripe";

// Disable body parser for webhook signature verification
export const runtime = "nodejs";
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get("stripe-signature");

  if (!signature) {
    console.error("No stripe-signature header found");
    return NextResponse.json(
      { error: "No signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  console.log(`✅ Received webhook event: ${event.type}`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`📦 Processing checkout for session: ${session.id}`);
        await handleCheckoutSessionCompleted(session);
        console.log(`✅ Successfully processed checkout.session.completed`);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`🔄 Processing subscription update: ${subscription.id}`);
        await handleSubscriptionUpdated(subscription);
        console.log(`✅ Successfully processed customer.subscription.updated`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`❌ Processing subscription deletion: ${subscription.id}`);
        await handleSubscriptionDeleted(subscription);
        console.log(`✅ Successfully processed customer.subscription.deleted`);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`⚠️  Processing payment failure for invoice: ${invoice.id}`);
        await handlePaymentFailed(invoice);
        console.log(`✅ Successfully processed invoice.payment_failed`);
        break;
      }

      default:
        console.log(`ℹ️  Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`❌ Error processing webhook event ${event.type}:`, error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  console.log("Processing checkout.session.completed");

  // Support both userId and user_id for backwards compatibility
  const userId = session.metadata?.userId || session.metadata?.user_id;
  const customerEmail = session.customer_email || session.customer_details?.email;

  if (!userId) {
    console.error("No userId in session metadata");
    return;
  }

  // Check if this is a vendor application payment
  if (session.metadata?.type === "vendor_application") {
    console.log("🏪 Processing vendor application payment");
    await handleVendorApplicationPayment(session);
    return;
  }

  // Get the subscription object to access subscription details
  const subscriptionId = session.subscription as string;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Find the product in our database by matching the Stripe price ID
  const priceId = subscription.items.data[0]?.price?.id;
  const product = await prisma.product.findFirst({
    where: { stripe_price_id: priceId },
  });

  if (!product) {
    console.error(`No product found for price ID: ${priceId}`);
    return;
  }

  // Get Stripe customer ID
  const stripeCustomerId = session.customer as string;

  // Get current_period_end from the subscription item (not the subscription itself)
  const subscriptionItem = subscription.items.data[0];
  const currentPeriodEnd = (subscriptionItem as any).current_period_end;
  const cancelAtPeriodEnd = subscription.cancel_at_period_end ?? false;

  if (!currentPeriodEnd) {
    console.error("No current_period_end in subscription item:", JSON.stringify(subscriptionItem, null, 2));
    throw new Error("Invalid subscription data: missing current_period_end in subscription item");
  }

  console.log(`✅ Creating subscription with current_period_end: ${currentPeriodEnd}, date: ${new Date(currentPeriodEnd * 1000)}`);

  // Create subscription record in database
  await prisma.subscription.create({
    data: {
      user_id: userId,
      product_id: product.id,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: stripeCustomerId,
      status: subscription.status,
      current_period_end: new Date(currentPeriodEnd * 1000),
      cancel_at_period_end: cancelAtPeriodEnd,
    },
  });


  // STEP 1: Update user profile if first_name/last_name are empty (use Stripe data)
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { first_name: true, last_name: true },
  });

  // Parse name from Stripe shipping details
  const shippingDetails = (session as any).shipping_details || (session as any).shipping || session.customer_details;
  const name = shippingDetails?.name || session.customer_details?.name || "";
  
  // Better name parsing: handle single names, multiple names, etc.
  let firstName = "";
  let lastName = "";
  
  if (name) {
    const nameParts = name.trim().split(/\s+/); // Split on any whitespace
    if (nameParts.length === 1) {
      // Single name: use as first name, placeholder for last name
      firstName = nameParts[0];
      lastName = ".";
    } else if (nameParts.length === 2) {
      // Two names: first and last
      firstName = nameParts[0];
      lastName = nameParts[1];
    } else {
      // Multiple names: first is first name, rest is last name
      firstName = nameParts[0];
      lastName = nameParts.slice(1).join(" ");
    }
  }

  // Update user profile if names are empty
  if (firstName && (!currentUser?.first_name || !currentUser?.last_name)) {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          first_name: currentUser?.first_name || firstName,
          last_name: currentUser?.last_name || lastName,
        },
      });
      console.log(`✅ Updated user profile with name from Stripe: ${firstName} ${lastName}`);
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  }

  // STEP 2: Save shipping address from Stripe Checkout to database (before creating order)
  let addressId: string | null = null;
  
  if (shippingDetails?.address) {
    const addr = shippingDetails.address;

    try {
      // Check if user already has an address
      const existingAddress = await prisma.address.findFirst({
        where: {
          user_id: userId,
          is_default: true,
        },
      });

      if (existingAddress) {
        // Update existing default address
        const updatedAddress = await prisma.address.update({
          where: { id: existingAddress.id },
          data: {
            first_name: firstName || existingAddress.first_name,
            last_name: lastName || existingAddress.last_name,
            address1: addr.line1 || "",
            address2: addr.line2 || "",
            city: addr.city || "",
            state: addr.state || "",
            postal_code: addr.postal_code || "",
            country: addr.country || "US",
            phone: shippingDetails.phone || existingAddress.phone || "",
          },
        });
        addressId = updatedAddress.id;
        console.log(`✅ Updated existing address for user ${userId}`);
      } else {
        // Create new default address - use first/last name or fallback to "Customer"
        const newAddress = await prisma.address.create({
          data: {
            user_id: userId,
            type: "shipping",
            first_name: firstName || "Customer",
            last_name: lastName || ".",
            address1: addr.line1 || "",
            address2: addr.line2 || "",
            city: addr.city || "",
            state: addr.state || "",
            postal_code: addr.postal_code || "",
            country: addr.country || "US",
            phone: shippingDetails.phone || "",
            is_default: true,
          },
        });
        addressId = newAddress.id;
        console.log(`✅ Created new address for user ${userId}`);
      }

      // Sync to Stripe customer for consistency (database is source of truth)
      await stripe.customers.update(stripeCustomerId, {
        name: firstName && lastName ? `${firstName} ${lastName}` : name,
        phone: shippingDetails.phone || undefined,
        address: {
          line1: addr.line1,
          line2: addr.line2 || undefined,
          city: addr.city,
          state: addr.state,
          postal_code: addr.postal_code,
          country: addr.country,
        },
        metadata: {
          user_id: userId,
          first_name: firstName,
          last_name: lastName,
        },
      });
      console.log(`✅ Synced address and profile to Stripe customer ${stripeCustomerId}`);
    } catch (error) {
      console.error("Error saving/syncing address:", error);
      // Don't fail the webhook if address operations fail
    }
  } else {
    console.warn("No shipping address in session for order");
  }

  // STEP 3: Create order record WITH shipping address link
  const order = await prisma.order.create({
    data: {
      user_id: userId,
      stripe_payment_intent_id: session.payment_intent as string,
      total: product.price,
      status: "paid",
      shipping_address_id: addressId, // Link the address to the order
    },
  });
  console.log(`✅ Created order ${order.id.slice(-8)} with address ${addressId ? addressId.slice(-8) : 'none'}`);

  // Create order item
  await prisma.orderItem.create({
    data: {
      order_id: order.id,
      product_id: product.id,
      quantity: 1,
      price: product.price,
    },
  });

  // STEP 4: Handle marketplace order (if storeId present)
  const storeId = session.metadata?.storeId;
  if (storeId) {
    console.log(`📦 Processing marketplace order for store: ${storeId}`);
    
    try {
      const fees = calculatePlatformFees(parseFloat(product.price.toString()));
      
      // Update order with marketplace data
      await prisma.order.update({
        where: { id: order.id },
        data: {
          store_id: storeId,
          platform_fee: fees.platform_fee,
          vendor_amount: fees.vendor_amount,
        },
      });

      // Create platform transaction record
      await prisma.platformTransaction.create({
        data: {
          order_id: order.id,
          store_id: storeId,
          gross_amount: fees.gross_amount,
          platform_fee: fees.platform_fee,
          vendor_amount: fees.vendor_amount,
          fee_percentage: fees.fee_percentage,
          status: "completed",
        },
      });

      console.log(`✅ Created platform transaction for order ${order.id.slice(-8)}`);
      console.log(`   Platform fee: $${fees.platform_fee.toFixed(2)}`);
      console.log(`   Vendor amount: $${fees.vendor_amount.toFixed(2)}`);
    } catch (error) {
      console.error("Error creating platform transaction:", error);
      // Don't fail webhook if platform transaction fails
    }
  }

  // Send confirmation emails
  if (customerEmail) {
    try {
      // Get user info for personalized emails
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          first_name: true,
          last_name: true,
          email: true,
        },
      });

      const customerName = user?.first_name || user?.email?.split("@")[0] || "there";
      const nextBillingDate = new Date(currentPeriodEnd * 1000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Send subscription confirmation email
      await sendSubscriptionConfirmation({
        to: customerEmail,
        customerName,
        subscriptionId: subscription.id,
        nextBillingDate,
        amount: product.price.toString(),
      });

      // Send order confirmation email
      await sendOrderConfirmation({
        to: customerEmail,
        customerName,
        orderId: order.id,
        orderTotal: product.price.toString(),
        orderDate: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        items: [
          {
            name: product.name,
            quantity: 1,
            price: product.price.toString(),
          },
        ],
      });

      console.log(`✅ Sent confirmation emails to ${customerEmail}`);
    } catch (error) {
      console.error("Error sending confirmation emails:", error);
      // Don't fail the webhook if email sending fails
    }
  }

  console.log(
    `Created subscription ${subscription.id} and order ${order.id} for user ${userId}`
  );
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log("🔄 Processing customer.subscription.updated");
  console.log(`📋 Subscription ID: ${subscription.id}`);
  console.log(`📊 Status: ${subscription.status}`);
  console.log(`🚫 Cancel at period end: ${subscription.cancel_at_period_end}`);
  console.log(`📅 Cancel at timestamp: ${subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : 'null'}`);

  // Get current_period_end from the subscription item (same pattern as checkout handler)
  const subscriptionItem = subscription.items.data[0];
  const currentPeriodEnd = (subscriptionItem as any).current_period_end;

  if (currentPeriodEnd) {
    console.log(`📅 Current period end: ${new Date(currentPeriodEnd * 1000)}`);
  }

  // Determine if subscription is set to cancel
  // Stripe uses either cancel_at_period_end (boolean) OR cancel_at (timestamp)
  const willCancelAtPeriodEnd = subscription.cancel_at_period_end || (subscription.cancel_at !== null);

  console.log(`✅ Will cancel: ${willCancelAtPeriodEnd}`);

  // Update subscription in database
  const updated = await prisma.subscription.updateMany({
    where: { stripe_subscription_id: subscription.id },
    data: {
      status: subscription.status,
      ...(currentPeriodEnd && { current_period_end: new Date(currentPeriodEnd * 1000) }),
      cancel_at_period_end: willCancelAtPeriodEnd,
    },
  });

  if (updated.count === 0) {
    console.error(
      `❌ No subscription found with stripe_subscription_id: ${subscription.id}`
    );
  } else {
    console.log(`✅ Updated ${updated.count} subscription(s) - ID: ${subscription.id}`);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log("Processing customer.subscription.deleted");

  // Update subscription status to cancelled
  const updated = await prisma.subscription.updateMany({
    where: { stripe_subscription_id: subscription.id },
    data: {
      status: "cancelled",
    },
  });

  if (updated.count === 0) {
    console.error(
      `No subscription found with stripe_subscription_id: ${subscription.id}`
    );
  } else {
    console.log(`Cancelled subscription ${subscription.id}`);
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log("Processing invoice.payment_failed");

  // Using any to bypass TypeScript issue with Stripe types
  const inv = invoice as any;
  const subscriptionId = inv.subscription as string;

  if (!subscriptionId) {
    console.error("No subscription ID in invoice");
    return;
  }

  // Update subscription status to past_due
  const updated = await prisma.subscription.updateMany({
    where: { stripe_subscription_id: subscriptionId },
    data: {
      status: "past_due",
    },
  });

  if (updated.count === 0) {
    console.error(
      `No subscription found with stripe_subscription_id: ${subscriptionId}`
    );
  } else {
    console.log(`Marked subscription ${subscriptionId} as past_due`);
  }

  // TODO: Send email notification to customer about payment failure
}

async function handleVendorApplicationPayment(
  session: Stripe.Checkout.Session
) {
  console.log("Processing vendor application payment");

  // Support both userId and user_id for backwards compatibility
  const userId = session.metadata?.userId || session.metadata?.user_id;
  const subdomain = session.metadata?.subdomain;
  const name = session.metadata?.name;
  const description = session.metadata?.description;
  const contact_email = session.metadata?.contact_email;

  if (!userId || !subdomain || !name || !contact_email) {
    console.error("Missing required metadata for vendor application");
    return;
  }

  try {
    // Check if user already has a store
    const existingStore = await prisma.store.findFirst({
      where: { owner_id: userId },
    });

    if (existingStore) {
      console.log(`User ${userId} already has a store, skipping creation`);
      return;
    }

    // Check if subdomain is already taken
    const subdomainTaken = await prisma.store.findUnique({
      where: { subdomain },
    });

    if (subdomainTaken) {
      console.error(`Subdomain ${subdomain} is already taken`);
      // TODO: Send email to user about subdomain conflict
      return;
    }

    // Get subscription ID and payment intent ID
    const subscriptionId = session.subscription as string;
    const paymentIntentId = session.payment_intent as string;

    // Create the store with status "pending" for admin approval
    const store = await prisma.store.create({
      data: {
        owner_id: userId,
        subdomain,
        name,
        description: description || null,
        contact_email,
        status: "pending", // Requires admin approval
        application_paid: true,
        application_payment_id: paymentIntentId,
        monthly_subscription_id: subscriptionId,
        subscription_status: "active",
        setup_fee_paid: true,
        setup_fee_date: new Date(),
        terms_accepted_at: new Date(),
      },
    });

    console.log(`✅ Created vendor store: ${store.name} (${store.subdomain})`);

    // Update user role to vendor
    await prisma.user.update({
      where: { id: userId },
      data: { role: "vendor" },
    });

    console.log(`✅ Updated user ${userId} role to vendor`);

    // TODO: Send confirmation email to vendor
    // TODO: Send notification to admins for review

    console.log(`✅ Successfully processed vendor application for ${store.name}`);
  } catch (error) {
    console.error("Error processing vendor application:", error);
    throw error;
  }
}
