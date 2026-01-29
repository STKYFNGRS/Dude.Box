import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin";

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        moderation_status: "hidden",
        active: false, // Also mark as inactive
      },
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Error hiding product:", error);
    return NextResponse.json(
      { error: "Failed to hide product" },
      { status: 500 }
    );
  }
}
