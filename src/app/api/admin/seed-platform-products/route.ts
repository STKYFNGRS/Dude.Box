import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // Check if platform products already exist
    const existingCount = await prisma.platformProduct.count();
    
    if (existingCount > 0) {
      // If products exist, require admin access
      await requireAdmin();
    }
    // If no products exist, allow one-time seed without admin (initial setup)

    console.log("🌱 Seeding platform products...");

    // Application Fee Product
    const applicationFee = await prisma.platformProduct.upsert({
      where: { stripe_price_id: "price_1Suxg9In9SFgOJXcePBKNyNz" },
      update: {},
      create: {
        name: "Vendor Application Fee",
        description: "One-time application fee to become a Dude.Box vendor",
        price: 5.00,
        stripe_price_id: "price_1Suxg9In9SFgOJXcePBKNyNz",
        type: "application_fee",
        interval: "one_time",
        active: true,
      },
    });

    console.log(`✅ Created/Updated: ${applicationFee.name} - $${applicationFee.price}`);

    // Monthly Subscription Product
    const monthlySubscription = await prisma.platformProduct.upsert({
      where: { stripe_price_id: "price_1Sum02In9SFgOJXcOYdXRk9D" },
      update: {},
      create: {
        name: "Vendor Monthly Subscription",
        description: "Monthly subscription fee for active vendor stores",
        price: 5.00,
        stripe_price_id: "price_1Sum02In9SFgOJXcOYdXRk9D",
        type: "monthly_subscription",
        interval: "month",
        active: true,
      },
    });

    console.log(`✅ Created/Updated: ${monthlySubscription.name} - $${monthlySubscription.price}/month`);

    const totalCount = await prisma.platformProduct.count();

    return NextResponse.json({
      success: true,
      message: "Platform products seeded successfully",
      products: [
        {
          name: applicationFee.name,
          price: `$${applicationFee.price}`,
          type: applicationFee.type,
        },
        {
          name: monthlySubscription.name,
          price: `$${monthlySubscription.price}/month`,
          type: monthlySubscription.type,
        },
      ],
      totalCount,
    });
  } catch (error) {
    console.error("❌ Error seeding platform products:", error);
    return NextResponse.json(
      { error: "Failed to seed platform products" },
      { status: 500 }
    );
  }
}
