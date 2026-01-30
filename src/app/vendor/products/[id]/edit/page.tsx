import { requireVendor } from "@/lib/vendor";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EditProductForm } from "@/components/vendor/EditProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const store = await requireVendor();
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: {
      id,
      store_id: store.id, // Ensure vendor owns this product
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Edit Product</h1>
        <p className="text-muted-foreground">
          Update your product information
        </p>
      </div>

      <div className="card rounded-lg p-6">
        <EditProductForm product={product} storeId={store.id} />
      </div>
    </div>
  );
}
