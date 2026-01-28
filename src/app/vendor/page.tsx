import { requireVendor } from "@/lib/vendor";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function VendorDashboard() {
  const store = await requireVendor();

  // Fetch vendor stats
  const [products, orders, totalRevenue] = await Promise.all([
    prisma.product.count({
      where: { store_id: store.id },
    }),
    prisma.order.findMany({
      where: { store_id: store.id },
      orderBy: { created_at: "desc" },
      take: 10,
      include: {
        user: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
          },
        },
      },
    }),
    prisma.order.aggregate({
      where: {
        store_id: store.id,
        status: { in: ["paid", "shipped", "delivered"] },
      },
      _sum: {
        vendor_amount: true,
      },
    }),
  ]);

  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "paid").length;
  const shippedOrders = orders.filter((o) => o.status === "shipped").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your store performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card rounded-lg p-6">
          <div className="text-2xl font-bold mb-1">
            ${(totalRevenue._sum.vendor_amount || 0).toString()}
          </div>
          <div className="text-sm text-muted-foreground">Total Revenue</div>
          <div className="text-xs text-muted-foreground mt-1">
            (after platform fees)
          </div>
        </div>
        <div className="card rounded-lg p-6">
          <div className="text-2xl font-bold mb-1">{orders.length}</div>
          <div className="text-sm text-muted-foreground">Total Orders</div>
        </div>
        <div className="card rounded-lg p-6">
          <div className="text-2xl font-bold mb-1">{products}</div>
          <div className="text-sm text-muted-foreground">Products</div>
        </div>
        <div className="card rounded-lg p-6">
          <div className="text-2xl font-bold mb-1 text-amber-500">
            {pendingOrders}
          </div>
          <div className="text-sm text-muted-foreground">
            Pending Fulfillment
          </div>
        </div>
      </div>

      {/* Stripe Connect Status */}
      {!store.stripe_onboarded && (
        <div className="card rounded-lg p-6 bg-amber-500/10 border-amber-500/20">
          <h2 className="text-xl font-bold mb-2">Complete Setup</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Connect your Stripe account to start receiving payments.
          </p>
          <a
            href={`/api/stores/connect-stripe?storeId=${store.id}`}
            className="solid-button rounded-full px-6 py-2 text-sm inline-block"
          >
            Connect Stripe Account
          </a>
        </div>
      )}

      {/* Recent Orders */}
      <div className="card rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Recent Orders</h2>
          <Link
            href="/vendor/orders"
            className="text-sm text-primary hover:underline"
          >
            View All
          </Link>
        </div>
        {orders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No orders yet. Start adding products to your store!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-border/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-3 text-sm">
                      #{order.id.substring(0, 8)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {order.user.first_name || order.user.email}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      ${(order.vendor_amount || order.total).toString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === "paid"
                            ? "bg-emerald-500/20 text-emerald-500"
                            : order.status === "shipped"
                            ? "bg-blue-500/20 text-blue-500"
                            : order.status === "delivered"
                            ? "bg-green-500/20 text-green-500"
                            : "bg-amber-500/20 text-amber-500"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/vendor/products/new"
          className="card rounded-lg p-6 hover:border-primary/50 transition-colors text-center"
        >
          <div className="text-4xl mb-2">➕</div>
          <h3 className="font-semibold mb-1">Add New Product</h3>
          <p className="text-sm text-muted-foreground">
            List a new item in your store
          </p>
        </Link>
        <Link
          href="/vendor/settings"
          className="card rounded-lg p-6 hover:border-primary/50 transition-colors text-center"
        >
          <div className="text-4xl mb-2">⚙️</div>
          <h3 className="font-semibold mb-1">Store Settings</h3>
          <p className="text-sm text-muted-foreground">
            Update your store information
          </p>
        </Link>
      </div>
    </div>
  );
}
