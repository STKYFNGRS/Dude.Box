import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireVendor } from "@/lib/vendor";
import { moderateContent } from "@/lib/ai-moderation";
import { sendModerationAlertEmail, sendVendorContentHiddenEmail, sendVendorContentFlaggedEmail } from "@/lib/email";

export const dynamic = 'force-dynamic';

// PATCH - Update store settings
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

    const updatedStore = await prisma.store.update({
      where: { id: store.id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(contact_email !== undefined && { contact_email }),
        ...(maker_bio !== undefined && { maker_bio }),
        ...(shipping_policy !== undefined && { shipping_policy }),
        ...(return_policy !== undefined && { return_policy }),
        ...(logo_url !== undefined && { logo_url }),
        ...(banner_url !== undefined && { banner_url }),
        ...(custom_text !== undefined && { custom_text }),
      },
    });

    // Run AI moderation check if name, description, maker_bio, or custom_text changed
    if (name !== undefined || description !== undefined || maker_bio !== undefined || custom_text !== undefined) {
      const moderationResult = await moderateContent({
        storeName: name || updatedStore.name,
        storeDescription: description !== undefined ? description : updatedStore.description || undefined,
        customText: [
          maker_bio !== undefined ? maker_bio : updatedStore.maker_bio || "",
          custom_text !== undefined ? custom_text : updatedStore.custom_text || ""
        ].filter(Boolean).join("\n"),
      });

      // Log moderation
      await prisma.moderationLog.create({
        data: {
          store_id: updatedStore.id,
          content_type: "store",
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
        // AUTO-SUSPEND severe violations for stores
        await prisma.store.update({
          where: { id: updatedStore.id },
          data: {
            status: "suspended",
          },
        });

        // Notify admin
        await sendModerationAlertEmail({
          type: "store",
          severity: "severe",
          vendorEmail: updatedStore.contact_email,
          storeName: updatedStore.name,
          contentName: updatedStore.name,
          reason: moderationResult.reason,
          categories: moderationResult.categories,
        });

        // Notify vendor
        await sendVendorContentHiddenEmail({
          to: updatedStore.contact_email,
          vendorName: store.owner.first_name || "Vendor",
          contentType: "store",
          contentName: updatedStore.name,
          reason: moderationResult.reason,
        });

        return NextResponse.json({ 
          store: updatedStore, 
          warning: "Store suspended due to policy violation. Check your email for details." 
        });
      } else if (moderationResult.isViolation && moderationResult.severity === "moderate") {
        // FLAG moderate violations
        // For stores, we just notify admin for review
        await sendModerationAlertEmail({
          type: "store",
          severity: "moderate",
          vendorEmail: updatedStore.contact_email,
          storeName: updatedStore.name,
          contentName: updatedStore.name,
          reason: moderationResult.reason,
          categories: moderationResult.categories,
        });

        // Notify vendor
        await sendVendorContentFlaggedEmail({
          to: updatedStore.contact_email,
          vendorName: store.owner.first_name || "Vendor",
          contentType: "store",
          contentName: updatedStore.name,
          reason: moderationResult.reason,
        });
      }
    }

    return NextResponse.json({ store: updatedStore });
  } catch (error) {
    console.error("Error updating store:", error);
    return NextResponse.json(
      { error: "Failed to update store" },
      { status: 500 }
    );
  }
}
