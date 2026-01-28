import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.redirect(
        new URL("/portal/login?redirect=/members/become-vendor", request.url)
      );
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const storeId = searchParams.get("state"); // Store ID passed as state

    if (!code || !storeId) {
      return NextResponse.redirect(
        new URL(
          "/members/become-vendor?error=missing_params",
          request.url
        )
      );
    }

    // Verify user owns this store
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: { owner: true },
    });

    if (!store || store.owner.email !== session.user.email) {
      return NextResponse.redirect(
        new URL("/members/become-vendor?error=unauthorized", request.url)
      );
    }

    // Exchange authorization code for connected account ID
    const response = await stripe.oauth.token({
      grant_type: "authorization_code",
      code,
    });

    const connectedAccountId = response.stripe_user_id;

    if (!connectedAccountId) {
      throw new Error("No Stripe account ID returned");
    }

    // Update store with Stripe account info
    await prisma.store.update({
      where: { id: storeId },
      data: {
        stripe_account_id: connectedAccountId,
        stripe_onboarded: true,
      },
    });

    // Redirect to vendor dashboard
    return NextResponse.redirect(
      new URL("/members/become-vendor?success=stripe_connected", request.url)
    );
  } catch (error) {
    console.error("Error in Stripe Connect callback:", error);
    return NextResponse.redirect(
      new URL(
        "/members/become-vendor?error=stripe_connection_failed",
        request.url
      )
    );
  }
}
