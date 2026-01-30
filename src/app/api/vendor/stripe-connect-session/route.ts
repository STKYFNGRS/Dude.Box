import { NextResponse } from "next/server";
import { requireVendor } from "@/lib/vendor";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const store = await requireVendor();
    
    // Create or reuse connected account
    let accountId = store.stripe_account_id;
    
    if (!accountId) {
      // Create new Standard Connect account
      const account = await stripe.accounts.create({
        type: "standard",
        country: "US", // TODO: Add country selection in UI
        email: store.contact_email,
        metadata: {
          store_id: store.id,
          store_name: store.name,
        },
      });
      accountId = account.id;
      
      // Save to database
      await prisma.store.update({
        where: { id: store.id },
        data: { stripe_account_id: accountId },
      });
      
      console.log(`✅ Created new Stripe Connect account: ${accountId} for store: ${store.name}`);
    } else {
      console.log(`♻️ Reusing existing Stripe Connect account: ${accountId} for store: ${store.name}`);
    }
    
    // Create Account Session for embedded component
    const accountSession = await stripe.accountSessions.create({
      account: accountId,
      components: {
        account_onboarding: { enabled: true },
      },
    });
    
    console.log(`🔗 Created Account Session for embedded onboarding`);
    
    return NextResponse.json({
      clientSecret: accountSession.client_secret,
      accountId,
    });
  } catch (error) {
    console.error("Error creating Connect session:", error);
    return NextResponse.json(
      { error: "Failed to initialize Stripe Connect" },
      { status: 500 }
    );
  }
}
