import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const store = await prisma.store.findUnique({
      where: { id },
      include: {
        products: true,
        orders: true,
      },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // Delete related records first
    await prisma.product.deleteMany({
      where: { store_id: id },
    });

    await prisma.order.deleteMany({
      where: { store_id: id },
    });

    // Delete the store
    await prisma.store.delete({
      where: { id },
    });

    // Optionally update user role back to customer
    await prisma.user.update({
      where: { id: store.owner_id },
      data: { role: "customer" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting store:", error);
    return NextResponse.json(
      { error: "Failed to delete store" },
      { status: 500 }
    );
  }
}
