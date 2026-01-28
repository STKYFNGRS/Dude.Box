import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get default address
    const address = await prisma.address.findFirst({
      where: {
        user_id: user.id,
        is_default: true,
      },
    });

    // Return address in format expected by EditAddressForm
    if (address) {
      return NextResponse.json({
        address: {
          id: address.id,
          first_name: address.first_name,
          last_name: address.last_name,
          address1: address.address1,
          address2: address.address2 || "",
          city: address.city,
          province: address.state, // Map state to province for form compatibility
          zip: address.postal_code, // Map postal_code to zip for form compatibility
          country: address.country,
          phone: address.phone || "",
        },
      });
    }

    return NextResponse.json({ address: null });
  } catch (error) {
    console.error("Error fetching address:", error);
    return NextResponse.json(
      { error: "Unable to fetch address." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { first_name, last_name, address1, address2, city, province, zip, country, phone } = await request.json();

    // Validate required fields (first_name and last_name are mandatory)
    if (!first_name?.trim() || !last_name?.trim()) {
      return NextResponse.json(
        { error: "First name and last name are required" },
        { status: 400 }
      );
    }

    if (!address1?.trim() || !city?.trim() || !province?.trim() || !zip?.trim() || !country?.trim()) {
      return NextResponse.json(
        { error: "Address, city, state, zip code, and country are required" },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has a default address
    const existingAddress = await prisma.address.findFirst({
      where: {
        user_id: user.id,
        is_default: true,
      },
    });

    let updatedAddress;
    
    if (existingAddress) {
      // Update existing default address
      updatedAddress = await prisma.address.update({
        where: { id: existingAddress.id },
        data: {
          first_name: first_name.trim(),
          last_name: last_name.trim(),
          address1: address1.trim(),
          address2: address2?.trim() || null,
          city: city.trim(),
          state: province.trim(), // Map province to state
          postal_code: zip.trim(), // Map zip to postal_code
          country: country.trim(),
          phone: phone?.trim() || null,
        },
      });
    } else {
      // Create new default address
      updatedAddress = await prisma.address.create({
        data: {
          user_id: user.id,
          type: "shipping",
          first_name: first_name.trim(),
          last_name: last_name.trim(),
          address1: address1.trim(),
          address2: address2?.trim() || null,
          city: city.trim(),
          state: province.trim(), // Map province to state
          postal_code: zip.trim(), // Map zip to postal_code
          country: country.trim(),
          phone: phone?.trim() || null,
          is_default: true,
        },
      });
    }

    // Sync address to Stripe customer - find customer ID from subscriptions or orders
    let stripeCustomerId: string | null = null;

    // Try to find Stripe customer ID from active subscriptions
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

      // If we have a payment intent, we can get the customer ID from Stripe
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
          name: `${updatedAddress.first_name} ${updatedAddress.last_name}`,
          phone: updatedAddress.phone || undefined,
          address: {
            line1: updatedAddress.address1,
            line2: updatedAddress.address2 || undefined,
            city: updatedAddress.city,
            state: updatedAddress.state,
            postal_code: updatedAddress.postal_code,
            country: updatedAddress.country,
          },
        });
        console.log(`✅ Synced address to Stripe customer ${stripeCustomerId}`);
      } catch (error) {
        console.error("Error syncing address to Stripe:", error);
        // Don't fail the request if Stripe sync fails
      }
    } else {
      console.log("ℹ️ No Stripe customer found for user - skipping Stripe sync");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { error: "Unable to update address. Please try again." },
      { status: 500 }
    );
  }
}
