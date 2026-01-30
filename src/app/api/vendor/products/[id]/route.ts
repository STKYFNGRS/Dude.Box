import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireVendor } from "@/lib/vendor";
import { moderateContent } from "@/lib/ai-moderation";
import { sendModerationAlertEmail, sendVendorContentFlaggedEmail } from "@/lib/email";
import { applyProductUpdateChanges } from "@/lib/change-requests";

export const dynamic = 'force-dynamic';

// PATCH - Update product (now uses draft system with change requests)
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

    // Collect previous values for change tracking
    const previousData = {
      name: existingProduct.name,
      description: existingProduct.description,
      price: existingProduct.price.toString(),
      interval: existingProduct.interval,
      image_url: existingProduct.image_url,
    };

    // Collect new values
    const newData: Record<string, unknown> = {};
    if (name !== undefined) newData.name = name;
    if (description !== undefined) newData.description = description;
    if (price !== undefined) newData.price = price.toString();
    if (interval !== undefined) newData.interval = interval;
    if (image_url !== undefined) newData.image_url = image_url;

    // Run AI moderation if content changed
    let moderationResult = { 
      isViolation: false, 
      severity: "clean" as "clean" | "moderate" | "severe",
      reason: "",
      categories: [] as string[],
      confidence: 1.0 
    };

    if (name !== undefined || description !== undefined) {
      moderationResult = await moderateContent({
        productName: name || existingProduct.name,
        productDescription: description !== undefined ? description : existingProduct.description || undefined,
      });

      // Log moderation
      await prisma.moderationLog.create({
        data: {
          product_id: id,
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
    }

    // Save to draft fields
    await prisma.product.update({
      where: { id },
      data: {
        has_pending_changes: true,
        ...(name !== undefined && { draft_name: name }),
        ...(description !== undefined && { draft_description: description }),
        ...(price !== undefined && { draft_price: price }),
        ...(image_url !== undefined && { draft_image_url: image_url }),
        // active and interval can be changed immediately (non-content fields)
        ...(active !== undefined && { active }),
        ...(interval !== undefined && { interval }),
      },
    });

    // Create change request
    const changeRequest = await prisma.storeChangeRequest.create({
      data: {
        store_id: store.id,
        product_id: id,
        change_type: "product_update",
        previous_data: previousData,
        new_data: newData,
        moderation_severity: moderationResult.severity,
        moderation_reason: moderationResult.reason,
        status: moderationResult.severity === "clean" ? "approved" : "pending",
        auto_approved: moderationResult.severity === "clean",
      },
    });

    // Handle based on moderation severity
    if (moderationResult.severity === "clean") {
      // Auto-approve clean changes
      await applyProductUpdateChanges(changeRequest.id);
      
      // Get updated product
      const updatedProduct = await prisma.product.findUnique({
        where: { id },
      });

      return NextResponse.json({ 
        product: updatedProduct,
        message: "Changes applied successfully"
      });
    } else if (moderationResult.severity === "moderate") {
      // Queue for review, keep live version active
      await sendModerationAlertEmail({
        type: "product",
        severity: "moderate",
        vendorEmail: store.contact_email,
        storeName: store.name,
        contentName: existingProduct.name,
        reason: moderationResult.reason,
        categories: moderationResult.categories,
      });

      await sendVendorContentFlaggedEmail({
        to: store.contact_email,
        vendorName: store.owner.first_name || "Vendor",
        contentType: "product",
        contentName: existingProduct.name,
        reason: moderationResult.reason,
      });

      // Return product with draft fields
      const productWithDrafts = await prisma.product.findUnique({
        where: { id },
      });

      return NextResponse.json({ 
        product: productWithDrafts,
        message: "Changes submitted for review. Live product unchanged.",
        pending: true
      });
    } else {
      // Severe violation - block changes, clear drafts
      await prisma.product.update({
        where: { id },
        data: {
          has_pending_changes: false,
          draft_name: null,
          draft_description: null,
          draft_price: null,
          draft_image_url: null,
        },
      });

      await prisma.storeChangeRequest.delete({
        where: { id: changeRequest.id },
      });

      await sendModerationAlertEmail({
        type: "product",
        severity: "severe",
        vendorEmail: store.contact_email,
        storeName: store.name,
        contentName: existingProduct.name,
        reason: moderationResult.reason,
        categories: moderationResult.categories,
      });

      await sendVendorContentFlaggedEmail({
        to: store.contact_email,
        vendorName: store.owner.first_name || "Vendor",
        contentType: "product",
        contentName: existingProduct.name,
        reason: moderationResult.reason,
      });

      return NextResponse.json({ 
        product: existingProduct,
        error: "Changes blocked due to policy violation. Live product unchanged.",
        blocked: true,
        reason: moderationResult.reason
      }, { status: 400 });
    }
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
