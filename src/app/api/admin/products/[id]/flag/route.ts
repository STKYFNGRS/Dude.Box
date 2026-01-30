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
    const body = await request.json();
    const { reason } = body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        moderation_status: "flagged",
        flagged_reason: reason,
      },
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Error flagging product:", error);
    return NextResponse.json(
      { error: "Failed to flag product" },
      { status: 500 }
    );
  }
}
