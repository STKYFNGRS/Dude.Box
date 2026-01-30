import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireVendor } from "@/lib/vendor";
import { moderateContent } from "@/lib/ai-moderation";
import { sendModerationAlertEmail, sendVendorContentHiddenEmail, sendVendorContentFlaggedEmail } from "@/lib/email";

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

// POST - Create new product
export async function POST(request: Request) {
  try {
    const store = await requireVendor();
    const body = await request.json();
    const { name, description, price, interval, active, image_url } = body;

    if (!name || !price) {
      return NextResponse.json(
        { error: "Name and price are required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price,
        interval: interval || "one_time",
        active: active !== undefined ? active : true,
        image_url: image_url || null,
        store_id: store.id,
      },
    });

    // Run AI moderation check
    const moderationResult = await moderateContent({
      productName: name,
      productDescription: description || undefined,
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
        contentName: name,
        reason: moderationResult.reason,
        categories: moderationResult.categories,
      });

      // Notify vendor
      await sendVendorContentHiddenEmail({
        to: store.contact_email,
        vendorName: store.owner.first_name || "Vendor",
        contentType: "product",
        contentName: name,
        reason: moderationResult.reason,
      });

      return NextResponse.json(
        { 
          product, 
          warning: "Product hidden due to policy violation. Check your email for details." 
        },
        { status: 201 }
      );
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
        contentName: name,
        reason: moderationResult.reason,
        categories: moderationResult.categories,
      });

      // Notify vendor
      await sendVendorContentFlaggedEmail({
        to: store.contact_email,
        vendorName: store.owner.first_name || "Vendor",
        contentType: "product",
        contentName: name,
        reason: moderationResult.reason,
      });
    }

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
