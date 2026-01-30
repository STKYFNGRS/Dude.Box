import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { requireVendor } from "@/lib/vendor";
import { moderateContent } from "@/lib/ai-moderation";
import { sendModerationAlertEmail, sendVendorContentFlaggedEmail } from "@/lib/email";
import { applyStoreInfoChanges } from "@/lib/change-requests";

export const dynamic = 'force-dynamic';

// PATCH - Update store settings (now uses change request system)
export async function PATCH(request: Request) {
  try {
    const store = await requireVendor();
    const body = await request.json();
    const {
      name,
      description,
      contact_email,
      maker_bio,
      shipping_policy,
      return_policy,
      logo_url,
      banner_url,
      custom_text,
    } = body;

    // Collect previous values for change tracking
    const previousData = {
      name: store.name,
      description: store.description,
      contact_email: store.contact_email,
      maker_bio: store.maker_bio,
      shipping_policy: store.shipping_policy,
      return_policy: store.return_policy,
      logo_url: store.logo_url,
      banner_url: store.banner_url,
      custom_text: store.custom_text,
    };

    // Collect new values
    const newData: Record<string, unknown> = {};
    if (name !== undefined) newData.name = name;
    if (description !== undefined) newData.description = description;
    if (contact_email !== undefined) newData.contact_email = contact_email;
    if (maker_bio !== undefined) newData.maker_bio = maker_bio;
    if (shipping_policy !== undefined) newData.shipping_policy = shipping_policy;
    if (return_policy !== undefined) newData.return_policy = return_policy;
    if (logo_url !== undefined) newData.logo_url = logo_url;
    if (banner_url !== undefined) newData.banner_url = banner_url;
    if (custom_text !== undefined) newData.custom_text = custom_text;

    // Run AI moderation check if content fields changed
    let moderationResult = { 
      isViolation: false, 
      severity: "clean" as "clean" | "moderate" | "severe",
      reason: "",
      categories: [] as string[],
      confidence: 1.0 
    };

    if (name !== undefined || description !== undefined || maker_bio !== undefined || custom_text !== undefined) {
      moderationResult = await moderateContent({
        storeName: name || store.name,
        storeDescription: description !== undefined ? description : store.description || undefined,
        customText: [
          maker_bio !== undefined ? maker_bio : store.maker_bio || "",
          custom_text !== undefined ? custom_text : store.custom_text || ""
        ].filter(Boolean).join("\n"),
      });

      // Log moderation
      await prisma.moderationLog.create({
        data: {
          store_id: store.id,
          content_type: "store",
          is_violation: moderationResult.isViolation,
          severity: moderationResult.severity,
          categories: moderationResult.categories.join(", "),
          reason: moderationResult.reason,
          confidence: moderationResult.confidence,
          checked_at: new Date(),
        },
      });
    }

    // Create change request
    const changeRequest = await prisma.storeChangeRequest.create({
      data: {
        store_id: store.id,
        change_type: "store_info",
        previous_data: previousData as Prisma.InputJsonValue,
        new_data: newData as Prisma.InputJsonValue,
        moderation_severity: moderationResult.severity,
        moderation_reason: moderationResult.reason,
        status: moderationResult.severity === "clean" ? "approved" : "pending",
        auto_approved: moderationResult.severity === "clean",
      },
    });

    // Handle based on moderation severity
    if (moderationResult.severity === "clean") {
      // Auto-approve and apply clean content immediately
      await applyStoreInfoChanges(changeRequest.id);
      
      // Get updated store to return
      const updatedStore = await prisma.store.findUnique({
        where: { id: store.id },
        include: { owner: true },
      });
      
      return NextResponse.json({ 
        store: updatedStore,
        message: "Changes applied successfully"
      });
    } else if (moderationResult.severity === "moderate") {
      // Queue for review, notify admin, keep store live
      await sendModerationAlertEmail({
        type: "store",
        severity: "moderate",
        vendorEmail: store.contact_email,
        storeName: store.name,
        contentName: store.name,
        reason: moderationResult.reason,
        categories: moderationResult.categories,
      });

      await sendVendorContentFlaggedEmail({
        to: store.contact_email,
        vendorName: store.owner.first_name || "Vendor",
        contentType: "store",
        contentName: store.name,
        reason: moderationResult.reason,
      });

      return NextResponse.json({ 
        store,
        message: "Changes submitted for review. Your store remains live with previous content.",
        pending: true
      });
    } else {
      // Severe violation - block changes, queue for review, notify
      await sendModerationAlertEmail({
        type: "store",
        severity: "severe",
        vendorEmail: store.contact_email,
        storeName: store.name,
        contentName: store.name,
        reason: moderationResult.reason,
        categories: moderationResult.categories,
      });

      await sendVendorContentFlaggedEmail({
        to: store.contact_email,
        vendorName: store.owner.first_name || "Vendor",
        contentType: "store",
        contentName: store.name,
        reason: moderationResult.reason,
      });

      return NextResponse.json({ 
        store,
        message: "Changes blocked due to policy violation. Your store remains live. Check email for details.",
        blocked: true,
        reason: moderationResult.reason
      }, { status: 400 });
    }
  } catch (error) {
    console.error("Error updating store:", error);
    return NextResponse.json(
      { error: "Failed to update store" },
      { status: 500 }
    );
  }
}
