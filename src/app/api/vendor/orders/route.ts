import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireVendor } from "@/lib/vendor";

export const dynamic = 'force-dynamic';

// GET - List vendor's orders
export async function GET() {
  try {
    const store = await requireVendor();

    const orders = await prisma.order.findMany({
      where: { store_id: store.id },
      orderBy: { created_at: "desc" },
      include: {
        user: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
          },
        },
        shipping_address: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Unauthorized or failed to fetch orders" },
      { status: 401 }
    );
  }
}
