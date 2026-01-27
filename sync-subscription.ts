import { stripe } from "./src/lib/stripe";
import { prisma } from "./src/lib/prisma";

async function syncSubscription() {
  try {
    // Get the subscription from your database
    const dbSubscription = await prisma.subscription.findFirst({
      where: {
        status: {
          in: ["active", "past_due", "trialing"],
        },
      },
    });

    if (!dbSubscription) {
      console.log("No active subscription found in database");
      return;
    }

    console.log(`📋 Database subscription: ${dbSubscription.stripe_subscription_id}`);
    console.log(`   - cancel_at_period_end: ${dbSubscription.cancel_at_period_end}`);

    // Fetch the latest state from Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(
      dbSubscription.stripe_subscription_id
    );

    console.log(`\n📋 Stripe subscription: ${stripeSubscription.id}`);
    console.log(`   - status: ${stripeSubscription.status}`);
    console.log(`   - cancel_at_period_end: ${stripeSubscription.cancel_at_period_end}`);
    console.log(`   - current_period_end: ${new Date(stripeSubscription.current_period_end * 1000)}`);

    // Update database to match Stripe
    await prisma.subscription.update({
      where: { id: dbSubscription.id },
      data: {
        status: stripeSubscription.status,
        cancel_at_period_end: stripeSubscription.cancel_at_period_end,
        current_period_end: new Date(stripeSubscription.current_period_end * 1000),
      },
    });

    console.log(`\n✅ Database updated to match Stripe!`);
    console.log(`   - cancel_at_period_end: ${stripeSubscription.cancel_at_period_end}`);
  } catch (error) {
    console.error("Error syncing subscription:", error);
  } finally {
    await prisma.$disconnect();
  }
}

syncSubscription();
