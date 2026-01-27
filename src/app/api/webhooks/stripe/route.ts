import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

// Disable body parser for webhook signature verification
export const runtime = "nodejs";

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

  const userId = session.metadata?.userId;
  const customerEmail = session.customer_email || session.customer_details?.email;

  if (!userId) {
    console.error("No userId in session metadata");
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

  // Create order record
  const order = await prisma.order.create({
    data: {
      user_id: userId,
      stripe_payment_intent_id: session.payment_intent as string,
      total: product.price,
      status: "paid",
    },
  });

  // Create order item
  await prisma.orderItem.create({
    data: {
      order_id: order.id,
      product_id: product.id,
      quantity: 1,
      price: product.price,
    },
  });

  // Sync shipping address to Stripe customer
  const shippingAddress = await prisma.address.findFirst({
    where: {
      user_id: userId,
      is_default: true,
    },
  });

  if (shippingAddress) {
    try {
      await stripe.customers.update(stripeCustomerId, {
        name: `${shippingAddress.first_name} ${shippingAddress.last_name}`,
        phone: shippingAddress.phone || undefined,
        address: {
          line1: shippingAddress.address1,
          line2: shippingAddress.address2 || undefined,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postal_code: shippingAddress.postal_code,
          country: shippingAddress.country,
        },
      });
      console.log(`✅ Synced address to Stripe customer ${stripeCustomerId}`);
    } catch (error) {
      console.error("Error syncing address to Stripe:", error);
      // Don't fail the webhook if address sync fails
    }
  }

  console.log(
    `Created subscription ${subscription.id} and order ${order.id} for user ${userId}`
  );
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log("Processing customer.subscription.updated");

  // Update subscription in database
  // Using any to bypass TypeScript issue with Stripe types
  const sub = subscription as any;
  const updated = await prisma.subscription.updateMany({
    where: { stripe_subscription_id: sub.id },
    data: {
      status: sub.status,
      current_period_end: new Date(sub.current_period_end * 1000),
      cancel_at_period_end: sub.cancel_at_period_end ?? false,
    },
  });

  if (updated.count === 0) {
    console.error(
      `No subscription found with stripe_subscription_id: ${subscription.id}`
    );
  } else {
    console.log(`Updated subscription ${subscription.id}`);
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
