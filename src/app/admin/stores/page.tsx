import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminStoresPage() {
  await requireAdmin();

  const stores = await prisma.store.findMany({
    orderBy: { created_at: "desc" },
    include: {
      owner: {
        select: {
          first_name: true,
          last_name: true,
          email: true,
        },
      },
      _count: {
        select: {
          products: true,
          orders: true,
        },
      },
    },
  });

  const pendingCount = stores.filter((s) => s.status === "pending").length;
  const approvedCount = stores.filter((s) => s.status === "approved").length;
  const suspendedCount = stores.filter((s) => s.status === "suspended").length;

  const statusFilter = ["all", "pending", "approved", "suspended"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Vendor Stores</h1>
          <p className="text-muted-foreground">
            Manage vendor stores and approvals
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card rounded-lg p-4">
          <div className="text-2xl font-bold mb-1">{stores.length}</div>
          <div className="text-sm text-muted-foreground">Total Stores</div>
        </div>
        <div className="card rounded-lg p-4">
          <div className="text-2xl font-bold mb-1 text-amber-500">
            {pendingCount}
          </div>
          <div className="text-sm text-muted-foreground">Pending Approval</div>
        </div>
        <div className="card rounded-lg p-4">
          <div className="text-2xl font-bold mb-1 text-emerald-500">
            {approvedCount}
          </div>
          <div className="text-sm text-muted-foreground">Approved</div>
        </div>
        <div className="card rounded-lg p-4">
          <div className="text-2xl font-bold mb-1 text-red-500">
            {suspendedCount}
          </div>
          <div className="text-sm text-muted-foreground">Suspended</div>
        </div>
      </div>

      {/* Stores List */}
      <div className="card rounded-lg overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold">All Stores</h2>
        </div>
        {stores.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No stores yet. Vendors can apply via the "Become a Vendor" page.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-border/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Store
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Products
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Stripe
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {stores.map((store) => (
                  <tr key={store.id}>
                    <td className="px-6 py-4">
                      <div className="font-medium">{store.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {store.subdomain}.dude.box
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {store.owner.first_name || "Unknown"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {store.owner.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          store.status === "approved"
                            ? "bg-emerald-500/20 text-emerald-500"
                            : store.status === "pending"
                            ? "bg-amber-500/20 text-amber-500"
                            : "bg-red-500/20 text-red-500"
                        }`}
                      >
                        {store.status.charAt(0).toUpperCase() +
                          store.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {store._count.products}
                    </td>
                    <td className="px-6 py-4 text-sm">{store._count.orders}</td>
                    <td className="px-6 py-4">
                      {store.stripe_onboarded ? (
                        <span className="text-xs text-emerald-500">✓ Connected</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Not connected
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/stores/${store.id}`}
                        className="text-sm text-primary hover:underline"
                      >
                        View Details
                      </Link>
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
