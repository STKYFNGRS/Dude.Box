import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { sendRefundConfirmationEmail } from "@/lib/email";

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authorization
    await requireAdmin();

    const { id } = await params;
    const body = await req.json();
    const { amount } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Valid refund amount is required" },
        { status: 400 }
      );
    }

    // Get return request with order and user info
    const returnRecord = await prisma.return.findUnique({
      where: { id },
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

    // Check if already refunded
    if (returnRecord.stripe_refund_id) {
      return NextResponse.json(
        { error: "Return has already been refunded" },
        { status: 400 }
      );
    }

    // Check if order has payment intent
    if (!returnRecord.order.stripe_payment_intent_id) {
      return NextResponse.json(
        { error: "No payment intent found for this order" },
        { status: 400 }
      );
    }

    // Validate refund amount doesn't exceed order total
    if (amount > Number(returnRecord.order.total)) {
      return NextResponse.json(
        { error: "Refund amount cannot exceed order total" },
        { status: 400 }
      );
    }

    // Create refund via Stripe
    const refund = await stripe.refunds.create({
      payment_intent: returnRecord.order.stripe_payment_intent_id,
      amount: Math.round(amount * 100), // Convert to cents
      reason: "requested_by_customer",
      metadata: {
        order_id: returnRecord.order.id,
        return_id: returnRecord.id,
      },
    });

    // Update return record with refund information
    const updatedReturn = await prisma.return.update({
      where: { id },
      data: {
        status: "refunded",
        refund_amount: amount,
        stripe_refund_id: refund.id,
      },
    });

    // Send refund confirmation email to customer
    const customerName =
      `${returnRecord.user.first_name || ""} ${returnRecord.user.last_name || ""}`.trim() ||
      "Customer";
    const orderNumber = returnRecord.order.id.slice(-8);

    await sendRefundConfirmationEmail({
      to: returnRecord.user.email,
      customerName,
      returnId: returnRecord.id,
      orderNumber,
      refundAmount: amount.toFixed(2),
      stripeRefundId: refund.id,
    });

    console.log(
      `✅ Refund processed: ${refund.id} for return ${id} ($${amount})`
    );

    return NextResponse.json({
      success: true,
      refund: {
        id: refund.id,
        amount,
        status: refund.status,
      },
      return: updatedReturn,
    });
  } catch (error) {
    console.error("Error processing refund:", error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to process refund" },
      { status: 500 }
    );
  }
}
