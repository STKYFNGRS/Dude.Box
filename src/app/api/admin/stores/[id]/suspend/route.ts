import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();

    const { id } = await params;
    const store = await prisma.store.update({
      where: { id },
      data: {
        status: "suspended",
      },
      include: {
        owner: true,
      },
    });

    // TODO: Send suspension notification email to store owner

    return NextResponse.json({ store });
  } catch (error) {
    console.error("Error suspending store:", error);
    return NextResponse.json(
      { error: "Failed to suspend store" },
      { status: 500 }
    );
  }
}
