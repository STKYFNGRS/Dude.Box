-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "PlatformProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
