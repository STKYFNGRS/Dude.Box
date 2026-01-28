import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { generateReturnLabel, isShippingConfigured } from "@/lib/shipping";
import { sendReturnApprovedEmail } from "@/lib/email";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authorization
    await requireAdmin();

    // Get return request with user and order info
    const returnRecord = await prisma.return.findUnique({
      where: { id: params.id },
      include: {
        order: {
          include: {
            shipping_address: true,
          },
        },
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

    // Check if return can be approved
    if (returnRecord.status === "refunded") {
      return NextResponse.json(
        { error: "Cannot approve a return that has been refunded" },
        { status: 400 }
      );
    }

    if (returnRecord.status === "rejected") {
      return NextResponse.json(
        { error: "Cannot approve a return that has been rejected" },
        { status: 400 }
      );
    }

    // Check if shipping address exists
    if (!returnRecord.order.shipping_address) {
      return NextResponse.json(
        { 
          error: "No shipping address found for this order. The order may have been created before address linking was implemented. Please run the migration script: npm run migrate:link-addresses" 
        },
        { status: 400 }
      );
    }

    // Validate required address fields for shipping label generation
    const addr = returnRecord.order.shipping_address;
    const missingFields: string[] = [];

    if (!addr.first_name?.trim()) missingFields.push("first_name");
    if (!addr.last_name?.trim()) missingFields.push("last_name");
    if (!addr.address1?.trim()) missingFields.push("address1");
    if (!addr.city?.trim()) missingFields.push("city");
    if (!addr.state?.trim()) missingFields.push("state");
    if (!addr.postal_code?.trim()) missingFields.push("postal_code");
    if (!addr.country?.trim()) missingFields.push("country");

    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: `Shipping address is incomplete. Missing required fields: ${missingFields.join(", ")}. Please ask the customer to update their shipping address in the portal.` 
        },
        { status: 400 }
      );
    }

    let updateData: any = {
      status: "approved",
    };

    // Try to generate shipping label if configured
    if (isShippingConfigured()) {
      const shippingAddress = returnRecord.order.shipping_address;
      const customerAddress = {
        name: `${shippingAddress.first_name} ${shippingAddress.last_name}`,
        street1: shippingAddress.address1,
        street2: shippingAddress.address2 || undefined,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zip: shippingAddress.postal_code,
        country: shippingAddress.country,
        phone: shippingAddress.phone || undefined,
      };

      const labelResult = await generateReturnLabel(
        customerAddress,
        Number(returnRecord.order.total)
      );

      if (labelResult.success) {
        // Label generated successfully
        updateData = {
          status: "label_sent",
          tracking_number: labelResult.tracking_number,
          label_url: labelResult.label_url,
          carrier: labelResult.carrier,
        };

        // Send approval email with label
        const customerName =
          `${returnRecord.user.first_name || ""} ${returnRecord.user.last_name || ""}`.trim() ||
          "Customer";
        const orderNumber = returnRecord.order.id.slice(-8);

        if (labelResult.tracking_number && labelResult.label_url && labelResult.carrier) {
          await sendReturnApprovedEmail({
            to: returnRecord.user.email,
            customerName,
            returnId: returnRecord.id,
            orderNumber,
            trackingNumber: labelResult.tracking_number,
            labelUrl: labelResult.label_url,
            carrier: labelResult.carrier,
          });
        }

        console.log(`✅ Return approved with label: ${params.id}`);
      } else {
        // Label generation failed, but still approve
        console.warn(
          `⚠️ Label generation failed for return ${params.id}: ${labelResult.error}`
        );
        updateData.admin_notes = `Label generation failed: ${labelResult.error}`;
      }
    } else {
      // Shipping not configured
      console.warn(
        `⚠️ Shipping not configured. Return ${params.id} approved without label.`
      );
      updateData.admin_notes =
        "Shipping label generation not configured. Please generate label manually or set up EasyPost.";
    }

    // Update return record
    const updatedReturn = await prisma.return.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      return: updatedReturn,
      label_generated: updateData.status === "label_sent",
      message:
        updateData.status === "label_sent"
          ? "Return approved and shipping label sent to customer"
          : "Return approved. Note: Shipping label not generated (EasyPost not configured)",
    });
  } catch (error) {
    console.error("Error approving return:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Failed to approve return" },
      { status: 500 }
    );
  }
}
