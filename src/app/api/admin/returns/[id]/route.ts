import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authorization
    await requireAdmin();

    const { id } = await params;
    const returnRecord = await prisma.return.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
            phone: true,
          },
        },
        order: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
            shipping_address: true,
          },
        },
      },
    });

    if (!returnRecord) {
      return NextResponse.json(
        { error: "Return request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ return: returnRecord });
  } catch (error) {
    console.error("Error fetching return:", error);
    return NextResponse.json(
      { error: "Failed to fetch return" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authorization
    await requireAdmin();

    const { id } = await params;
    const body = await req.json();
    const { status, admin_notes } = body;

    // Validate status if provided
    const validStatuses = [
      "requested",
      "approved",
      "rejected",
      "label_sent",
      "in_transit",
      "received",
      "refunded",
      "cancelled",
    ];

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    // Get current return
    const currentReturn = await prisma.return.findUnique({
      where: { id },
    });

    if (!currentReturn) {
      return NextResponse.json(
        { error: "Return request not found" },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    if (status) updateData.status = status;
    if (admin_notes !== undefined) updateData.admin_notes = admin_notes;

    // Update return
    const updatedReturn = await prisma.return.update({
      where: { id },
      data: updateData,
    });

    console.log(`✅ Return updated: ${id}`);

    return NextResponse.json({
      success: true,
      return: updatedReturn,
    });
  } catch (error) {
    console.error("Error updating return:", error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to update return" },
      { status: 500 }
    );
  }
}
