import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
      },
    });

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
