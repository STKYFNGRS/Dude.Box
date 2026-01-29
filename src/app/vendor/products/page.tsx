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
        <div className="card rounded-lg p-5 card-hover border-l-4 border-l-accent">
          <div className="text-3xl font-bold mb-1 text-foreground">{products.length}</div>
          <div className="text-sm text-muted-foreground uppercase tracking-wider">Total Products</div>
        </div>
        <div className="card rounded-lg p-5 card-hover border-l-4 border-l-success">
          <div className="text-3xl font-bold mb-1 text-success">
            {activeCount}
          </div>
          <div className="text-sm text-muted-foreground uppercase tracking-wider">Active</div>
        </div>
        <div className="card rounded-lg p-5 card-hover border-l-4 border-l-border">
          <div className="text-3xl font-bold mb-1 text-muted">{inactiveCount}</div>
          <div className="text-sm text-muted-foreground uppercase tracking-wider">Inactive</div>
        </div>
      </div>

      {/* Products List */}
      {products.length === 0 ? (
        <div className="card rounded-lg p-16 text-center animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center">
            <span className="text-4xl">📦</span>
          </div>
          <h2 className="text-2xl font-bold mb-3 text-foreground">No Products Yet</h2>
          <p className="text-muted mb-8 max-w-md mx-auto leading-relaxed">
            Start selling by adding your first product. It only takes a minute to create a listing.
          </p>
          <Link
            href="/vendor/products/new"
            className="solid-button rounded-full px-8 py-3 text-sm inline-block font-semibold shadow-button"
          >
            Add Your First Product →
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
                  <tr 
                    key={product.id}
                    className="group hover:bg-hover/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground group-hover:text-accent transition-colors">{product.name}</div>
                      {product.description && (
                        <div className="text-sm text-muted mt-1 leading-relaxed">
                          {product.description.substring(0, 60)}
                          {product.description.length > 60 ? "..." : ""}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-accent">
                        ${product.price.toString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-foreground">
                        {product.interval === "month" ? "📅 Subscription" : "🛒 One-time"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${
                          product.active
                            ? "bg-success/20 text-success"
                            : "bg-muted/20 text-muted"
                        }`}
                      >
                        {product.active && "✓"}
                        {!product.active && "○"}
                        <span className="ml-1">{product.active ? "Active" : "Inactive"}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">
                      {new Date(product.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <Link
                        href={`/vendor/products/${product.id}/edit`}
                        className="text-sm text-accent hover:text-foreground transition-colors font-medium"
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
