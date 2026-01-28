import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || "dude@dude.box";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "You must be logged in to request a return" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { orderId, reason } = body;

    if (!orderId || !reason) {
      return NextResponse.json(
        { error: "Order ID and reason are required" },
        { status: 400 }
      );
    }

    // Get user and verify order belongs to them
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        orders: {
          where: { id: orderId },
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

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const order = user.orders[0];

    if (!order) {
      return NextResponse.json(
        { error: "Order not found or does not belong to you" },
        { status: 403 }
      );
    }

    // Create return request record (optional - you could add a returns table later)
    // For now, we'll just send an email notification

    const customerName = `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Customer";
    const orderNumber = order.id.slice(-8);
    const itemsList = order.items
      .map((item) => `${item.quantity}x ${item.product.name} - $${Number(item.price).toFixed(2)}`)
      .join("\n");

    // Send email notification to support
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "noreply@dude.box",
      to: SUPPORT_EMAIL,
      subject: `Return Request - Order #${orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #e5e7eb; max-width: 600px; margin: 0 auto; padding: 0; background: #0f172a;">
            <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.02em;">Return Request</h1>
            </div>
            
            <div style="background: #1e293b; padding: 30px;">
              <p style="font-size: 16px; margin-bottom: 20px; color: #e5e7eb;">
                A customer has requested a return for order #${orderNumber}.
              </p>
              
              <div style="background: #0f172a; border: 1px solid #334155; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="margin-top: 0; font-size: 20px; color: #818cf8; font-weight: 600;">Customer Details</h2>
                <p style="margin: 8px 0; color: #cbd5e1;"><strong style="color: #e5e7eb;">Name:</strong> ${customerName}</p>
                <p style="margin: 8px 0; color: #cbd5e1;"><strong style="color: #e5e7eb;">Email:</strong> ${user.email}</p>
              </div>
              
              <div style="background: #0f172a; border: 1px solid #334155; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="margin-top: 0; font-size: 20px; color: #818cf8; font-weight: 600;">Order Details</h2>
                <p style="margin: 8px 0; color: #cbd5e1;"><strong style="color: #e5e7eb;">Order ID:</strong> ${order.id}</p>
                <p style="margin: 8px 0; color: #cbd5e1;"><strong style="color: #e5e7eb;">Order Number:</strong> #${orderNumber}</p>
                <p style="margin: 8px 0; color: #cbd5e1;"><strong style="color: #e5e7eb;">Date:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>
                <p style="margin: 8px 0; color: #cbd5e1;"><strong style="color: #e5e7eb;">Total:</strong> $${Number(order.total).toFixed(2)}</p>
                <p style="margin: 8px 0; color: #cbd5e1;"><strong style="color: #e5e7eb;">Status:</strong> ${order.status}</p>
              </div>
              
              <div style="background: #0f172a; border: 1px solid #334155; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="margin-top: 0; font-size: 20px; color: #818cf8; font-weight: 600;">Items to Return</h2>
                <p style="margin: 8px 0; color: #cbd5e1; white-space: pre-line;">${itemsList}</p>
              </div>
              
              <div style="background: #0f172a; border: 1px solid #334155; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="margin-top: 0; font-size: 20px; color: #818cf8; font-weight: 600;">Return Reason</h2>
                <p style="margin: 8px 0; color: #cbd5e1; white-space: pre-line;">${reason}</p>
              </div>
              
              ${
                order.shipping_address
                  ? `
              <div style="background: #0f172a; border: 1px solid #334155; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="margin-top: 0; font-size: 20px; color: #818cf8; font-weight: 600;">Shipping Address</h2>
                <p style="margin: 8px 0; color: #cbd5e1;">
                  ${order.shipping_address.address1}<br>
                  ${order.shipping_address.address2 ? order.shipping_address.address2 + "<br>" : ""}
                  ${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.postal_code}<br>
                  ${order.shipping_address.country}
                </p>
              </div>
              `
                  : ""
              }
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXT_PUBLIC_APP_DOMAIN || "http://localhost:3000"}/admin/orders" 
                   style="display: inline-block; background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                  View in Admin Dashboard
                </a>
              </div>
              
              <p style="font-size: 12px; color: #64748b; margin-top: 30px; text-align: center; border-top: 1px solid #334155; padding-top: 20px;">
                Please contact the customer at ${user.email} to process this return.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    console.log(`✅ Return request email sent for order ${orderNumber}`);

    return NextResponse.json({
      success: true,
      message: "Return request submitted successfully",
    });
  } catch (error) {
    console.error("Error processing return request:", error);
    return NextResponse.json(
      { error: "Failed to process return request" },
      { status: 500 }
    );
  }
}
