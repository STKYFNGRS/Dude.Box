import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST() {
  try {
    // Get the subscription from database
    const dbSubscription = await prisma.subscription.findFirst({
      where: {
        status: {
          in: ["active", "past_due", "trialing"],
        },
      },
    });

    if (!dbSubscription) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 404 });
    }

    console.log(`📋 Database subscription: ${dbSubscription.stripe_subscription_id}`);
    console.log(`   - cancel_at_period_end: ${dbSubscription.cancel_at_period_end}`);

    // Fetch the latest state from Stripe
    const stripeSubscription: Stripe.Subscription = await stripe.subscriptions.retrieve(
      dbSubscription.stripe_subscription_id
    );

    // Get current_period_end from the subscription item (same pattern as webhook handler)
    const subscriptionItem = stripeSubscription.items.data[0];
    const currentPeriodEnd = (subscriptionItem as any).current_period_end;

    if (!currentPeriodEnd) {
      console.error("❌ No current_period_end found in subscription");
      return NextResponse.json({ error: "Invalid subscription data" }, { status: 500 });
    }

    console.log(`\n📋 Stripe subscription: ${stripeSubscription.id}`);
    console.log(`   - status: ${stripeSubscription.status}`);
    console.log(`   - cancel_at_period_end: ${stripeSubscription.cancel_at_period_end}`);
    console.log(`   - current_period_end: ${new Date(currentPeriodEnd * 1000)}`);

    // Update database to match Stripe
    const updated = await prisma.subscription.update({
      where: { id: dbSubscription.id },
      data: {
        status: stripeSubscription.status,
        cancel_at_period_end: stripeSubscription.cancel_at_period_end,
        current_period_end: new Date(currentPeriodEnd * 1000),
      },
    });

    console.log(`\n✅ Database updated to match Stripe!`);

    return NextResponse.json({
      success: true,
      before: {
        cancel_at_period_end: dbSubscription.cancel_at_period_end,
      },
      after: {
        cancel_at_period_end: updated.cancel_at_period_end,
        status: updated.status,
      },
    });
  } catch (error) {
    console.error("Error syncing subscription:", error);
    return NextResponse.json(
      { error: "Failed to sync subscription" },
      { status: 500 }
    );
  }
}
