import { requireVendor } from "@/lib/vendor";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { DeleteProductButton } from "@/components/vendor/DeleteProductButton";

export const dynamic = "force-dynamic";

export default async function VendorProductsPage() {
  const store = await requireVendor();

  const products = await prisma.product.findMany({
    where: { store_id: store.id },
    orderBy: { created_at: "desc" },
  });

  const activeCount = products.filter((p) => p.active).length;
  const inactiveCount = products.filter((p) => !p.active).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-muted-foreground">
            Manage your product listings
          </p>
        </div>
        <Link
          href="/vendor/products/new"
          className="solid-button rounded-full px-6 py-2 text-sm"
        >
          Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card rounded-lg p-4">
          <div className="text-2xl font-bold mb-1">{products.length}</div>
          <div className="text-sm text-muted-foreground">Total Products</div>
        </div>
        <div className="card rounded-lg p-4">
          <div className="text-2xl font-bold mb-1 text-emerald-500">
            {activeCount}
          </div>
          <div className="text-sm text-muted-foreground">Active</div>
        </div>
        <div className="card rounded-lg p-4">
          <div className="text-2xl font-bold mb-1">{inactiveCount}</div>
          <div className="text-sm text-muted-foreground">Inactive</div>
        </div>
      </div>

      {/* Products List */}
      {products.length === 0 ? (
        <div className="card rounded-lg p-12 text-center">
          <div className="text-4xl mb-4">📦</div>
          <h2 className="text-xl font-bold mb-2">No Products Yet</h2>
          <p className="text-muted-foreground mb-6">
            Start by adding your first product to your store
          </p>
          <Link
            href="/vendor/products/new"
            className="solid-button rounded-full px-6 py-2 text-sm inline-block"
          >
            Add Your First Product
          </Link>
        </div>
      ) : (
        <div className="card rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-border/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4">
                      <div className="font-medium">{product.name}</div>
                      {product.description && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {product.description.substring(0, 60)}
                          {product.description.length > 60 ? "..." : ""}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      ${product.price.toString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {product.interval === "month" ? "Subscription" : "One-time"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.active
                            ? "bg-emerald-500/20 text-emerald-500"
                            : "bg-gray-500/20 text-gray-500"
                        }`}
                      >
                        {product.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(product.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        href={`/vendor/products/${product.id}/edit`}
                        className="text-sm text-primary hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteProductButton
                        productId={product.id}
                        productName={product.name}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
