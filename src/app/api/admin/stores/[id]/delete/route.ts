import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const store = await prisma.store.findUnique({
      where: { id: params.id },
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
      where: { store_id: params.id },
    });

    await prisma.order.deleteMany({
      where: { store_id: params.id },
    });

    // Delete the store
    await prisma.store.delete({
      where: { id: params.id },
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
