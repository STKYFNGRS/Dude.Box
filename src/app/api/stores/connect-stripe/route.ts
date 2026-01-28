import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.redirect(new URL("/portal/login", request.url));
    }

    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get("storeId");

    if (!storeId) {
      return NextResponse.json({ error: "Store ID required" }, { status: 400 });
    }

    // Verify user owns this store
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: { owner: true },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    if (store.owner.email !== session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (store.status !== "approved") {
      return NextResponse.json(
        { error: "Store must be approved before connecting Stripe" },
        { status: 400 }
      );
    }

    // Build Stripe Connect OAuth URL
    const clientId = process.env.STRIPE_CONNECT_CLIENT_ID;
    
    if (!clientId) {
      console.error("STRIPE_CONNECT_CLIENT_ID not configured");
      return NextResponse.json(
        { error: "Stripe Connect not configured. Please contact support." },
        { status: 500 }
      );
    }

    const redirectUri = `${process.env.NEXT_PUBLIC_APP_DOMAIN || "http://localhost:3000"}/api/stores/stripe-callback`;

    const stripeAuthUrl = new URL("https://connect.stripe.com/oauth/authorize");
    stripeAuthUrl.searchParams.set("client_id", clientId);
    stripeAuthUrl.searchParams.set("response_type", "code");
    stripeAuthUrl.searchParams.set("scope", "read_write");
    stripeAuthUrl.searchParams.set("redirect_uri", redirectUri);
    stripeAuthUrl.searchParams.set("state", storeId); // Pass store ID as state

    return NextResponse.redirect(stripeAuthUrl.toString());
  } catch (error) {
    console.error("Error initiating Stripe Connect:", error);
    return NextResponse.json(
      { error: "Failed to initiate Stripe Connect" },
      { status: 500 }
    );
  }
}
