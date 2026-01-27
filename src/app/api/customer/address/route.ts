import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
          address1: address.address1,
          address2: address.address2 || "",
          city: address.city,
          province: address.state, // Map state to province for form compatibility
          zip: address.postal_code, // Map postal_code to zip for form compatibility
          country: address.country,
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

    const { address1, address2, city, province, zip, country } = await request.json();

    // Validate required fields
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

    if (existingAddress) {
      // Update existing default address
      await prisma.address.update({
        where: { id: existingAddress.id },
        data: {
          address1: address1.trim(),
          address2: address2?.trim() || null,
          city: city.trim(),
          state: province.trim(), // Map province to state
          postal_code: zip.trim(), // Map zip to postal_code
          country: country.trim(),
        },
      });
    } else {
      // Create new default address
      await prisma.address.create({
        data: {
          user_id: user.id,
          type: "shipping",
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          address1: address1.trim(),
          address2: address2?.trim() || null,
          city: city.trim(),
          state: province.trim(), // Map province to state
          postal_code: zip.trim(), // Map zip to postal_code
          country: country.trim(),
          is_default: true,
        },
      });
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
