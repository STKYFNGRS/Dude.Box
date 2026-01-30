import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const product = await prisma.product.update({
      where: { id },
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
