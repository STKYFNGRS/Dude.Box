import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { sendReturnRejectedEmail } from "@/lib/email";

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authorization
    await requireAdmin();

    const body = await req.json();
    const { reason } = body;

    if (!reason || !reason.trim()) {
      return NextResponse.json(
        { error: "Rejection reason is required" },
        { status: 400 }
      );
    }

    // Get return request with user and order info
    const returnRecord = await prisma.return.findUnique({
      where: { id: params.id },
      include: {
        order: true,
        user: {
          select: {
            email: true,
            first_name: true,
            last_name: true,
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

    // Check if return can be rejected
    if (returnRecord.status === "refunded") {
      return NextResponse.json(
        { error: "Cannot reject a return that has been refunded" },
        { status: 400 }
      );
    }

    // Update return status to rejected
    const updatedReturn = await prisma.return.update({
      where: { id: params.id },
      data: {
        status: "rejected",
        admin_notes: reason,
      },
    });

    // Send rejection email to customer
    const customerName =
      `${returnRecord.user.first_name || ""} ${returnRecord.user.last_name || ""}`.trim() ||
      "Customer";
    const orderNumber = returnRecord.order.id.slice(-8);

    await sendReturnRejectedEmail({
      to: returnRecord.user.email,
      customerName,
      returnId: returnRecord.id,
      orderNumber,
      reason,
    });

    console.log(`✅ Return rejected: ${params.id}`);

    return NextResponse.json({
      success: true,
      return: updatedReturn,
    });
  } catch (error) {
    console.error("Error rejecting return:", error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to reject return" },
      { status: 500 }
    );
  }
}
