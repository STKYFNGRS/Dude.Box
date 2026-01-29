import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { firstName, lastName } = await request.json();

    // Validate input
    if (!firstName?.trim() || !lastName?.trim()) {
      return NextResponse.json(
        { error: "First name and last name are required" },
        { status: 400 }
      );
    }

    // Update user in database
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        phone: true,
      },
    });

    // Sync user profile to Stripe customer - find customer ID from subscriptions or orders
    let stripeCustomerId: string | null = null;

    // Try to find Stripe customer ID from subscriptions
    const subscription = await prisma.subscription.findFirst({
      where: {
        user_id: user.id,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    if (subscription?.stripe_customer_id) {
      stripeCustomerId = subscription.stripe_customer_id;
    } else {
      // Try to find from orders
      const order = await prisma.order.findFirst({
        where: {
          user_id: user.id,
          stripe_payment_intent_id: {
            not: null,
          },
        },
        orderBy: {
          created_at: "desc",
        },
      });

      // If we have a payment intent, get the customer ID from Stripe
      if (order?.stripe_payment_intent_id) {
        try {
          const paymentIntent = await stripe.paymentIntents.retrieve(
            order.stripe_payment_intent_id
          );
          stripeCustomerId = paymentIntent.customer as string;
        } catch (error) {
          console.warn("Could not retrieve payment intent for customer ID:", error);
        }
      }
    }

    // Sync to Stripe if we found a customer ID
    if (stripeCustomerId) {
      try {
        await stripe.customers.update(stripeCustomerId, {
          name: `${user.first_name} ${user.last_name}`,
          metadata: {
            user_id: user.id,
            first_name: user.first_name || "",
            last_name: user.last_name || "",
          },
        });
        console.log(`✅ Synced profile to Stripe customer ${stripeCustomerId}`);
      } catch (error) {
        console.error("Error syncing profile to Stripe:", error);
        // Don't fail the request if Stripe sync fails
      }
    } else {
      console.log("ℹ️ No Stripe customer found for user - skipping Stripe sync");
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Unable to update profile. Please try again." },
      { status: 500 }
    );
  }
}
