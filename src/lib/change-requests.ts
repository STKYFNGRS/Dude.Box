import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

/**
 * Apply a store information change request
 */
export async function applyStoreInfoChanges(changeRequestId: string) {
  const changeRequest = await prisma.storeChangeRequest.findUnique({
    where: { id: changeRequestId },
    include: { store: true },
  });

  if (!changeRequest || changeRequest.change_type !== "store_info") {
    throw new Error("Invalid change request");
  }

  if (changeRequest.status !== "pending" && changeRequest.status !== "approved") {
    throw new Error("Change request is not in a valid state to apply");
  }

  const newData = changeRequest.new_data as Prisma.JsonObject;

  // Apply changes to store
  await prisma.store.update({
    where: { id: changeRequest.store_id },
    data: {
      ...(newData.name && { name: newData.name as string }),
      ...(newData.description !== undefined && { 
        description: newData.description as string | null 
      }),
      ...(newData.contact_email && { contact_email: newData.contact_email as string }),
      ...(newData.maker_bio !== undefined && { 
        maker_bio: newData.maker_bio as string | null 
      }),
      ...(newData.shipping_policy !== undefined && { 
        shipping_policy: newData.shipping_policy as string | null 
      }),
      ...(newData.return_policy !== undefined && { 
        return_policy: newData.return_policy as string | null 
      }),
      ...(newData.logo_url !== undefined && { 
        logo_url: newData.logo_url as string | null 
      }),
      ...(newData.banner_url !== undefined && { 
        banner_url: newData.banner_url as string | null 
      }),
      ...(newData.custom_text !== undefined && { 
        custom_text: newData.custom_text as string | null 
      }),
    },
  });

  console.log(`✅ Applied store info changes for request ${changeRequestId}`);
}

/**
 * Apply a product creation change request
 */
export async function applyProductCreateChanges(changeRequestId: string) {
  const changeRequest = await prisma.storeChangeRequest.findUnique({
    where: { id: changeRequestId },
  });

  if (!changeRequest || changeRequest.change_type !== "product_create") {
    throw new Error("Invalid change request");
  }

  if (!changeRequest.product_id) {
    throw new Error("Product ID is required for product create changes");
  }

  // Mark product as active and clear pending changes flag
  await prisma.product.update({
    where: { id: changeRequest.product_id },
    data: {
      active: true,
      has_pending_changes: false,
      moderation_status: "approved",
    },
  });

  console.log(`✅ Approved product creation for request ${changeRequestId}`);
}

/**
 * Apply a product update change request
 */
export async function applyProductUpdateChanges(changeRequestId: string) {
  const changeRequest = await prisma.storeChangeRequest.findUnique({
    where: { id: changeRequestId },
    include: { store: true },
  });

  if (!changeRequest || changeRequest.change_type !== "product_update") {
    throw new Error("Invalid change request");
  }

  if (!changeRequest.product_id) {
    throw new Error("Product ID is required for product update changes");
  }

  const product = await prisma.product.findUnique({
    where: { id: changeRequest.product_id },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  // Move draft fields to live fields
  await prisma.product.update({
    where: { id: changeRequest.product_id },
    data: {
      name: product.draft_name || product.name,
      description: product.draft_description !== undefined 
        ? product.draft_description 
        : product.description,
      price: product.draft_price || product.price,
      image_url: product.draft_image_url !== undefined 
        ? product.draft_image_url 
        : product.image_url,
      // Clear draft fields
      has_pending_changes: false,
      draft_name: null,
      draft_description: null,
      draft_price: null,
      draft_image_url: null,
      moderation_status: "approved",
    },
  });

  console.log(`✅ Applied product update for request ${changeRequestId}`);
}

/**
 * Apply a product deletion change request
 */
export async function applyProductDeleteChanges(changeRequestId: string) {
  const changeRequest = await prisma.storeChangeRequest.findUnique({
    where: { id: changeRequestId },
  });

  if (!changeRequest || changeRequest.change_type !== "product_delete") {
    throw new Error("Invalid change request");
  }

  if (!changeRequest.product_id) {
    throw new Error("Product ID is required for product delete changes");
  }

  // Soft delete by marking as inactive
  await prisma.product.update({
    where: { id: changeRequest.product_id },
    data: {
      active: false,
      has_pending_changes: false,
    },
  });

  console.log(`✅ Applied product deletion for request ${changeRequestId}`);
}

/**
 * Main function to apply any change request based on type
 */
export async function applyChangeRequest(changeRequestId: string, reviewerId: string) {
  const changeRequest = await prisma.storeChangeRequest.findUnique({
    where: { id: changeRequestId },
  });

  if (!changeRequest) {
    throw new Error("Change request not found");
  }

  if (changeRequest.status === "approved") {
    throw new Error("Change request has already been applied");
  }

  // Apply changes based on type
  switch (changeRequest.change_type) {
    case "store_info":
      await applyStoreInfoChanges(changeRequestId);
      break;
    case "product_create":
      await applyProductCreateChanges(changeRequestId);
      break;
    case "product_update":
      await applyProductUpdateChanges(changeRequestId);
      break;
    case "product_delete":
      await applyProductDeleteChanges(changeRequestId);
      break;
    default:
      throw new Error(`Unknown change type: ${changeRequest.change_type}`);
  }

  // Mark as approved
  await prisma.storeChangeRequest.update({
    where: { id: changeRequestId },
    data: {
      status: "approved",
      reviewed_by: reviewerId,
      reviewed_at: new Date(),
    },
  });

  console.log(`✅ Change request ${changeRequestId} approved and applied`);
}

/**
 * Reject a change request and clean up draft data
 */
export async function rejectChangeRequest(
  changeRequestId: string, 
  reviewerId: string, 
  reason?: string
) {
  const changeRequest = await prisma.storeChangeRequest.findUnique({
    where: { id: changeRequestId },
  });

  if (!changeRequest) {
    throw new Error("Change request not found");
  }

  // Clean up draft fields for product updates
  if (
    changeRequest.change_type === "product_update" && 
    changeRequest.product_id
  ) {
    await prisma.product.update({
      where: { id: changeRequest.product_id },
      data: {
        has_pending_changes: false,
        draft_name: null,
        draft_description: null,
        draft_price: null,
        draft_image_url: null,
      },
    });
  }

  // Delete unapproved products (for product_create rejections)
  if (
    changeRequest.change_type === "product_create" && 
    changeRequest.product_id
  ) {
    await prisma.product.delete({
      where: { id: changeRequest.product_id },
    });
  }

  // Mark as rejected
  await prisma.storeChangeRequest.update({
    where: { id: changeRequestId },
    data: {
      status: "rejected",
      reviewed_by: reviewerId,
      reviewed_at: new Date(),
      rejection_reason: reason,
    },
  });

  console.log(`❌ Change request ${changeRequestId} rejected`);
}

/**
 * Get pending change requests count for a store
 */
export async function getPendingChangesCount(storeId: string): Promise<number> {
  return prisma.storeChangeRequest.count({
    where: {
      store_id: storeId,
      status: "pending",
    },
  });
}

/**
 * Get all pending change requests for admin review
 */
export async function getAllPendingChangeRequests() {
  return prisma.storeChangeRequest.findMany({
    where: {
      status: "pending",
    },
    include: {
      store: {
        select: {
          name: true,
          subdomain: true,
          owner: {
            select: {
              email: true,
              first_name: true,
              last_name: true,
            },
          },
        },
      },
    },
    orderBy: [
      { moderation_severity: "desc" }, // severe first
      { created_at: "asc" }, // oldest first
    ],
  });
}
