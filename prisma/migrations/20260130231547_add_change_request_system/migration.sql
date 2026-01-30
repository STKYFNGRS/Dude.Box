-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "draft_description" TEXT,
ADD COLUMN     "draft_image_url" TEXT,
ADD COLUMN     "draft_name" TEXT,
ADD COLUMN     "draft_price" DECIMAL(10,2),
ADD COLUMN     "has_pending_changes" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "StoreChangeRequest" (
    "id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "change_type" TEXT NOT NULL,
    "previous_data" JSONB,
    "new_data" JSONB NOT NULL,
    "product_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewed_by" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "rejection_reason" TEXT,
    "moderation_severity" TEXT,
    "moderation_reason" TEXT,
    "auto_approved" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StoreChangeRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StoreChangeRequest_store_id_idx" ON "StoreChangeRequest"("store_id");

-- CreateIndex
CREATE INDEX "StoreChangeRequest_status_idx" ON "StoreChangeRequest"("status");

-- CreateIndex
CREATE INDEX "StoreChangeRequest_change_type_idx" ON "StoreChangeRequest"("change_type");

-- CreateIndex
CREATE INDEX "StoreChangeRequest_store_id_status_idx" ON "StoreChangeRequest"("store_id", "status");

-- AddForeignKey
ALTER TABLE "StoreChangeRequest" ADD CONSTRAINT "StoreChangeRequest_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreChangeRequest" ADD CONSTRAINT "StoreChangeRequest_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
