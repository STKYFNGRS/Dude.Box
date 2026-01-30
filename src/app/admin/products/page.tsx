import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FlagProductButton } from "@/components/admin/FlagProductButton";
import { HideProductButton } from "@/components/admin/HideProductButton";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  // Check admin access - redirect if unauthorized
  const admin = await isAdmin();
  if (!admin) {
    redirect("/portal/login?redirect=/admin/products");
  }

  const products = await prisma.product.findMany({
    orderBy: { created_at: "desc" },
    include: {
      store: {
        select: {
          name: true,
          subdomain: true,
        },
      },
    },
  });

  const approvedCount = products.filter(
    (p) => p.moderation_status === "approved"
  ).length;
  const flaggedCount = products.filter(
    (p) => p.moderation_status === "flagged"
  ).length;
  const hiddenCount = products.filter(
    (p) => p.moderation_status === "hidden"
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Product Moderation</h1>
        <p className="text-muted-foreground">
          Monitor and moderate products across all stores
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card rounded-lg p-4">
          <div className="text-2xl font-bold mb-1">{products.length}</div>
          <div className="text-sm text-muted-foreground">Total Products</div>
        </div>
        <div className="card rounded-lg p-4">
          <div className="text-2xl font-bold mb-1 text-emerald-500">
            {approvedCount}
          </div>
          <div className="text-sm text-muted-foreground">Approved</div>
        </div>
        <div className="card rounded-lg p-4">
          <div className="text-2xl font-bold mb-1 text-amber-500">
            {flaggedCount}
          </div>
          <div className="text-sm text-muted-foreground">Flagged</div>
        </div>
        <div className="card rounded-lg p-4">
          <div className="text-2xl font-bold mb-1 text-red-500">
            {hiddenCount}
          </div>
          <div className="text-sm text-muted-foreground">Hidden</div>
        </div>
      </div>

      {/* Products List */}
      <div className="card rounded-lg overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold">All Products</h2>
        </div>
        {products.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No products yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-border/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Store
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Moderation
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
                    <td className="px-6 py-4">
                      {product.store ? (
                        <Link
                          href={`/stores/${product.store.subdomain}`}
                          className="text-sm text-primary hover:underline"
                        >
                          {product.store.name}
                        </Link>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          No store
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      ${product.price.toString()}
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
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.moderation_status === "approved"
                            ? "bg-emerald-500/20 text-emerald-500"
                            : product.moderation_status === "flagged"
                            ? "bg-amber-500/20 text-amber-500"
                            : "bg-red-500/20 text-red-500"
                        }`}
                      >
                        {product.moderation_status}
                      </span>
                      {product.flagged_reason && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {product.flagged_reason}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {product.moderation_status !== "flagged" && (
                        <FlagProductButton
                          productId={product.id}
                          productName={product.name}
                        />
                      )}
                      {product.moderation_status !== "hidden" && (
                        <HideProductButton
                          productId={product.id}
                          productName={product.name}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
