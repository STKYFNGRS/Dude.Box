import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminStoresPage() {
  try {
    await requireAdmin();
  } catch (error) {
    console.error("Admin auth failed:", error);
    throw error;
  }

  let stores;
  try {
    stores = await prisma.store.findMany({
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
  } catch (error) {
    console.error("Failed to fetch stores:", error);
    throw new Error(`Database query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

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
        <div className="card rounded-lg p-5 card-hover border-l-4 border-l-accent">
          <div className="text-3xl font-bold mb-1 text-foreground">{stores.length}</div>
          <div className="text-sm text-muted-foreground uppercase tracking-wider">Total Stores</div>
        </div>
        <div className="card rounded-lg p-5 card-hover border-l-4 border-l-warning">
          <div className="text-3xl font-bold mb-1 text-warning">
            {pendingCount}
          </div>
          <div className="text-sm text-muted-foreground uppercase tracking-wider">Pending Approval</div>
        </div>
        <div className="card rounded-lg p-5 card-hover border-l-4 border-l-success">
          <div className="text-3xl font-bold mb-1 text-success">
            {approvedCount}
          </div>
          <div className="text-sm text-muted-foreground uppercase tracking-wider">Approved</div>
        </div>
        <div className="card rounded-lg p-5 card-hover border-l-4 border-l-error">
          <div className="text-3xl font-bold mb-1 text-error">
            {suspendedCount}
          </div>
          <div className="text-sm text-muted-foreground uppercase tracking-wider">Suspended</div>
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
                  <tr 
                    key={store.id}
                    className="group hover:bg-hover/50 transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/admin/stores/${store.id}`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground group-hover:text-accent transition-colors">{store.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {store.subdomain}.dude.box
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-foreground">
                        {store.owner.first_name || "Unknown"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {store.owner.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                          store.status === "approved"
                            ? "bg-success/20 text-success"
                            : store.status === "pending"
                            ? "bg-warning/20 text-warning animate-pulse"
                            : "bg-error/20 text-error"
                        }`}
                      >
                        {store.status === "approved" && "✓"}
                        {store.status === "pending" && "⏳"}
                        {store.status === "suspended" && "⊘"}
                        <span className="ml-1">
                          {store.status.charAt(0).toUpperCase() +
                            store.status.slice(1)}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-foreground">{store._count.products}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-foreground">{store._count.orders}</div>
                    </td>
                    <td className="px-6 py-4">
                      {store.stripe_onboarded ? (
                        <span className="inline-flex items-center gap-1 text-xs text-success font-medium">
                          <span>✓</span>
                          <span>Connected</span>
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Not connected
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/stores/${store.id}`}
                        className="text-sm text-accent hover:text-foreground transition-colors font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Details →
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
