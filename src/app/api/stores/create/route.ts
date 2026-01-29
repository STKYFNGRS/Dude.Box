import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  isValidSubdomain,
  isReservedSubdomain,
} from "@/lib/marketplace";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { owned_stores: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user already has a store
    if (user.owned_stores.length > 0) {
      return NextResponse.json(
        { error: "You already have a store" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { subdomain, name, description, contact_email } = body;

    // Validate required fields
    if (!subdomain || !name || !contact_email) {
      return NextResponse.json(
        { error: "Subdomain, name, and contact email are required" },
        { status: 400 }
      );
    }

    // Validate subdomain format
    if (!isValidSubdomain(subdomain)) {
      return NextResponse.json(
        {
          error:
            "Invalid subdomain format. Must be 3-63 lowercase letters, numbers, and hyphens.",
        },
        { status: 400 }
      );
    }

    // Check if subdomain is reserved
    if (isReservedSubdomain(subdomain)) {
      return NextResponse.json(
        { error: "This subdomain is reserved and cannot be used" },
        { status: 400 }
      );
    }

    // Check if subdomain is already taken
    const existingStore = await prisma.store.findUnique({
      where: { subdomain },
    });

    if (existingStore) {
      return NextResponse.json(
        { error: "This subdomain is already taken" },
        { status: 400 }
      );
    }

    // Create the store (shipping/return policies set later in vendor settings)
    const store = await prisma.store.create({
      data: {
        subdomain,
        name,
        description: description || null,
        contact_email,
        shipping_policy: null, // Set later in /vendor/settings
        return_policy: null,    // Set later in /vendor/settings
        owner_id: user.id,
        status: "pending", // Requires admin approval
      },
    });

    // Update user role to vendor
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "vendor" },
    });

    return NextResponse.json({ store }, { status: 201 });
  } catch (error) {
    console.error("Error creating store:", error);
    return NextResponse.json(
      { error: "Failed to create store" },
      { status: 500 }
    );
  }
}
