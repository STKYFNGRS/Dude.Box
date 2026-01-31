import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { requireVendor } from "@/lib/vendor";
import { moderateContent } from "@/lib/ai-moderation";
import { sendModerationAlertEmail, sendVendorContentFlaggedEmail } from "@/lib/email";
import { productSchema, validateData } from "@/lib/validation";
import { applyProductCreateChanges } from "@/lib/change-requests";

export const dynamic = 'force-dynamic';

// GET - List vendor's products
export async function GET() {
  try {
    const store = await requireVendor();

    const products = await prisma.product.findMany({
      where: { store_id: store.id },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Unauthorized or failed to fetch products" },
      { status: 401 }
    );
  }
}

// POST - Create new product (now uses change request system)
export async function POST(request: Request) {
  try {
    const store = await requireVendor();
    const body = await request.json();
    
    // Validate input with Zod schema
    const validation = validateData(productSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }
    
    const { name, description, price, interval, active, image_url } = validation.data;

    // Run AI moderation check BEFORE creating product
    const moderationResult = await moderateContent({
      productName: name,
      productDescription: description || undefined,
    });

    // Create product as inactive initially (pending approval)
    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price,
        interval: interval || "one_time",
        active: false, // Inactive until approved
        has_pending_changes: true, // Mark as pending
        image_url: image_url || null,
        store_id: store.id,
        moderation_status: moderationResult.severity === "clean" ? "approved" : "flagged",
        flagged_reason: moderationResult.isViolation ? moderationResult.reason : null,
      },
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

    // Create change request
    const changeRequest = await prisma.storeChangeRequest.create({
      data: {
        store_id: store.id,
        product_id: product.id,
        change_type: "product_create",
        previous_data: Prisma.JsonNull, // Use Prisma.JsonNull for nullable JSON fields
        new_data: {
          name,
          description,
          price: price.toString(),
          interval,
          image_url,
        } as Prisma.InputJsonValue,
        moderation_severity: moderationResult.severity,
        moderation_reason: moderationResult.reason,
        status: moderationResult.severity === "clean" ? "approved" : "pending",
        auto_approved: moderationResult.severity === "clean",
      },
    });

    // Handle based on moderation severity
    if (moderationResult.severity === "clean") {
      // Auto-approve clean content
      await applyProductCreateChanges(changeRequest.id);
      
      // Get updated product
      const updatedProduct = await prisma.product.findUnique({
        where: { id: product.id },
      });

      return NextResponse.json({ 
        product: updatedProduct,
        message: "Product created and published"
      }, { status: 201 });
    } else if (moderationResult.severity === "moderate") {
      // Queue for review
      await sendModerationAlertEmail({
        type: "product",
        severity: "moderate",
        vendorEmail: store.contact_email,
        storeName: store.name,
        contentName: name,
        reason: moderationResult.reason,
        categories: moderationResult.categories,
      });

      await sendVendorContentFlaggedEmail({
        to: store.contact_email,
        vendorName: store.owner.first_name || "Vendor",
        contentType: "product",
        contentName: name,
        reason: moderationResult.reason,
      });

      return NextResponse.json({ 
        product,
        message: "Product created and queued for review. It will be visible once approved.",
        pending: true
      }, { status: 201 });
    } else {
      // Severe violation - queue for urgent review (don't auto-delete)
      await sendModerationAlertEmail({
        type: "product",
        severity: "severe",
        vendorEmail: store.contact_email,
        storeName: store.name,
        contentName: name,
        reason: moderationResult.reason,
        categories: moderationResult.categories,
      });

      await sendVendorContentFlaggedEmail({
        to: store.contact_email,
        vendorName: store.owner.first_name || "Vendor",
        contentType: "product",
        contentName: name,
        reason: moderationResult.reason,
      });

      return NextResponse.json({ 
        product,
        message: "Product requires admin review before publishing. Check your email for details.",
        pending: true,
        severity: "severe"
      }, { status: 201 });
    }
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
