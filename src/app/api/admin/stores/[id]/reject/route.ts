import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin";
import { sendStoreRejected } from "@/lib/email";

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { reason } = body;

    // Get store info before deleting
    const store = await prisma.store.findUnique({
      where: { id },
      include: { owner: true },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // Send rejection email before deleting
    try {
      await sendStoreRejected({
        to: store.owner.email,
        vendorName: store.owner.first_name || "Vendor",
        storeName: store.name,
        reason: reason || "Did not meet marketplace guidelines",
      });
    } catch (error) {
      console.error("Failed to send rejection email:", error);
    }

    // Delete the store
    await prisma.store.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error rejecting store:", error);
    return NextResponse.json(
      { error: "Failed to reject store" },
      { status: 500 }
    );
  }
}
