/**
 * Vendor billing and subscription management
 */

import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { SETUP_FEE, MONTHLY_FEE } from "@/lib/marketplace";

/**
 * Create a billing session for vendor setup fee + monthly subscription
 */
export async function createVendorBillingSession(storeId: string) {
  const store = await prisma.store.findUnique({
    where: { id: storeId },
    include: { owner: true },
  });

  if (!store) throw new Error("Store not found");

  // Create checkout session for setup fee + first month
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: store.owner.email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${store.name} - Monthly Subscription`,
            description: "Monthly marketplace subscription fee",
          },
          unit_amount: Math.round(MONTHLY_FEE * 100),
          recurring: { interval: "month" },
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      setup_future_usage: "off_session",
    },
    metadata: {
      storeId: store.id,
      setupFee: "true",
    },
    success_url: `${process.env.NEXTAUTH_URL}/vendor/settings?billing=success`,
    cancel_url: `${process.env.NEXTAUTH_URL}/vendor/settings?billing=cancelled`,
  });

  return session;
}

/**
 * Process setup fee after subscription creation
 */
export async function chargeSetupFee(storeId: string, customerId: string) {
  const store = await prisma.store.findUnique({
    where: { id: storeId },
  });

  if (!store || store.setup_fee_paid) {
    return null; // Already paid or store not found
  }

  // Charge one-time setup fee
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(SETUP_FEE * 100),
    currency: "usd",
    customer: customerId,
    description: `Setup fee for ${store.name}`,
    metadata: {
      storeId: store.id,
      type: "setup_fee",
    },
  });

  // Mark setup fee as paid
  await prisma.store.update({
    where: { id: storeId },
    data: {
      setup_fee_paid: true,
      setup_fee_date: new Date(),
    },
  });

  return paymentIntent;
}
