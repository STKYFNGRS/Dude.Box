import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireVendor } from "@/lib/vendor";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const store = await requireVendor();
    const body = await request.json();
    const { tracking_number } = body;

    // Verify order belongs to vendor's store
    const existingOrder = await prisma.order.findUnique({
      where: { id: params.id },
    });

    if (!existingOrder || existingOrder.store_id !== store.id) {
      return NextResponse.json(
        { error: "Order not found or unauthorized" },
        { status: 404 }
      );
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: "shipped",
      },
    });

    // TODO: Send shipping confirmation email to customer with tracking number

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error marking order as shipped:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
