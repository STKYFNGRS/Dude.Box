import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { calculatePlatformFees, dollarsToCents } from "@/lib/marketplace";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "You must be logged in to checkout" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { storeId, items } = body;

    if (!storeId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Store ID and items are required" },
        { status: 400 }
      );
    }

    // Fetch store with Stripe Connect account
    const store = await prisma.store.findUnique({
      where: { id: storeId, status: "approved" },
    });

    if (!store) {
      return NextResponse.json(
        { error: "Store not found or not approved" },
        { status: 404 }
      );
    }

    if (!store.stripe_onboarded || !store.stripe_account_id) {
      return NextResponse.json(
        { error: "Store has not connected Stripe yet" },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Fetch products and validate
    const products = await prisma.product.findMany({
      where: {
        id: { in: items.map((item: any) => item.productId) },
        store_id: storeId,
        active: true,
      },
    });

    if (products.length !== items.length) {
      return NextResponse.json(
        { error: "Some products not found or inactive" },
        { status: 400 }
      );
    }

    // Calculate total and fees
    const subtotal = items.reduce((sum: number, item: any) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return sum;
      return sum + parseFloat(product.price.toString()) * item.quantity;
    }, 0);

    const fees = calculatePlatformFees(subtotal);

    console.log(`Creating PaymentIntent for store: ${store.name}`);
    console.log(`Amount: $${subtotal.toFixed(2)}, Platform Fee: $${fees.platformFee.toFixed(2)}, Vendor: $${fees.vendorAmount.toFixed(2)}`);

    // Create PaymentIntent with Stripe Connect
    const paymentIntent = await stripe.paymentIntents.create({
      amount: dollarsToCents(subtotal),
      currency: "usd",
      application_fee_amount: dollarsToCents(fees.platformFee),
      transfer_data: {
        destination: store.stripe_account_id,
      },
      metadata: {
        storeId: store.id,
        storeName: store.name,
        userId: user.id,
        userEmail: user.email,
        items: JSON.stringify(items),
        subtotal: subtotal.toFixed(2),
        platformFee: fees.platformFee.toFixed(2),
        vendorAmount: fees.vendorAmount.toFixed(2),
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log(`✅ PaymentIntent created: ${paymentIntent.id}`);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error("❌ Error creating PaymentIntent:", error);
    
    let errorMessage = "Failed to create payment";
    
    if (error?.type === 'StripeInvalidRequestError') {
      errorMessage = error.message || errorMessage;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
