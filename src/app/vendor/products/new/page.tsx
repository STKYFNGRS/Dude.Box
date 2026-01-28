import { requireVendor } from "@/lib/vendor";
import { CreateProductForm } from "@/components/vendor/CreateProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const store = await requireVendor();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Add New Product</h1>
        <p className="text-muted-foreground">
          Create a new product listing for your store
        </p>
      </div>

      <div className="card rounded-lg p-6">
        <CreateProductForm storeId={store.id} />
      </div>
    </div>
  );
}
