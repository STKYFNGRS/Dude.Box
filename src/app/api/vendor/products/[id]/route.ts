import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireVendor } from "@/lib/vendor";
import { moderateContent } from "@/lib/ai-moderation";
import { sendModerationAlertEmail, sendVendorContentHiddenEmail, sendVendorContentFlaggedEmail } from "@/lib/email";

export const dynamic = 'force-dynamic';

// PATCH - Update product
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const store = await requireVendor();
    const { id } = await params;
    const body = await request.json();
    const { name, description, price, interval, active, image_url } = body;

    // Verify product belongs to vendor's store
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct || existingProduct.store_id !== store.id) {
      return NextResponse.json(
        { error: "Product not found or unauthorized" },
        { status: 404 }
      );
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price }),
        ...(interval !== undefined && { interval }),
        ...(active !== undefined && { active }),
        ...(image_url !== undefined && { image_url }),
      },
    });

    // Run AI moderation check if name or description changed
    if (name !== undefined || description !== undefined) {
      const moderationResult = await moderateContent({
        productName: name || product.name,
        productDescription: description !== undefined ? description : product.description || undefined,
      });

      // Log moderation
      await prisma.moderationLog.create({
        data: {
          product_id: product.id,
          store_id: store.id,
          content_type: "product",
          is_violation: moderationResult.isViolation,
          severity: moderationResult.severity,
          categories: moderationResult.categories.join(", "),
          reason: moderationResult.reason,
          confidence: moderationResult.confidence,
          checked_at: new Date(),
        },
      });

      // Take action based on severity
      if (moderationResult.isViolation && moderationResult.severity === "severe") {
        // AUTO-HIDE severe violations
        await prisma.product.update({
          where: { id: product.id },
          data: {
            moderation_status: "hidden",
            flagged_reason: moderationResult.reason,
            active: false, // Also deactivate
          },
        });

        // Notify admin
        await sendModerationAlertEmail({
          type: "product",
          severity: "severe",
          vendorEmail: store.contact_email,
          storeName: store.name,
          contentName: product.name,
          reason: moderationResult.reason,
          categories: moderationResult.categories,
        });

        // Notify vendor
        await sendVendorContentHiddenEmail({
          to: store.contact_email,
          vendorName: store.owner.first_name || "Vendor",
          contentType: "product",
          contentName: product.name,
          reason: moderationResult.reason,
        });

        return NextResponse.json({ 
          product, 
          warning: "Product hidden due to policy violation. Check your email for details." 
        });
      } else if (moderationResult.isViolation && moderationResult.severity === "moderate") {
        // FLAG moderate violations
        await prisma.product.update({
          where: { id: product.id },
          data: {
            moderation_status: "flagged",
            flagged_reason: moderationResult.reason,
          },
        });

        // Notify admin
        await sendModerationAlertEmail({
          type: "product",
          severity: "moderate",
          vendorEmail: store.contact_email,
          storeName: store.name,
          contentName: product.name,
          reason: moderationResult.reason,
          categories: moderationResult.categories,
        });

        // Notify vendor
        await sendVendorContentFlaggedEmail({
          to: store.contact_email,
          vendorName: store.owner.first_name || "Vendor",
          contentType: "product",
          contentName: product.name,
          reason: moderationResult.reason,
        });
      }
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE - Delete product
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const store = await requireVendor();
    const { id } = await params;

    // Verify product belongs to vendor's store
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct || existingProduct.store_id !== store.id) {
      return NextResponse.json(
        { error: "Product not found or unauthorized" },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
