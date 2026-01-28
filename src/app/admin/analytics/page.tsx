import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  await requireAdmin();

  // Fetch platform analytics
  const [
    totalStores,
    activeStores,
    totalOrders,
    totalRevenue,
    platformFees,
    recentTransactions,
  ] = await Promise.all([
    prisma.store.count(),
    prisma.store.count({ where: { status: "approved" } }),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { in: ["paid", "shipped", "delivered"] } },
    }),
    prisma.platformTransaction.aggregate({
      _sum: { platform_fee: true },
      where: { status: "completed" },
    }),
    prisma.platformTransaction.findMany({
      take: 10,
      orderBy: { created_at: "desc" },
      include: {
        order: {
          include: {
            user: {
              select: {
                first_name: true,
                email: true,
              },
            },
          },
        },
      },
    }),
  ]);

  // Top stores by revenue
  const topStores = await prisma.store.findMany({
    where: { status: "approved" },
    take: 5,
    include: {
      _count: {
        select: { orders: true, products: true },
      },
      orders: {
        where: { status: { in: ["paid", "shipped", "delivered"] } },
        select: { vendor_amount: true },
      },
    },
  });

  const topStoresWithRevenue = topStores
    .map((store) => ({
      ...store,
      revenue: store.orders.reduce(
        (sum, order) => sum + parseFloat(order.vendor_amount?.toString() || "0"),
        0
      ),
    }))
    .sort((a, b) => b.revenue - a.revenue);

  const gmv = parseFloat(totalRevenue._sum.total?.toString() || "0");
  const totalPlatformFees = parseFloat(
    platformFees._sum.platform_fee?.toString() || "0"
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Platform Analytics</h1>
        <p className="text-muted-foreground">
          Overview of marketplace performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card rounded-lg p-6">
          <div className="text-3xl font-bold mb-1">${gmv.toFixed(2)}</div>
          <div className="text-sm text-muted-foreground">
            Total GMV (Gross Merchandise Value)
          </div>
        </div>
        <div className="card rounded-lg p-6">
          <div className="text-3xl font-bold mb-1 text-emerald-500">
            ${totalPlatformFees.toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground">
            Platform Fees Collected
          </div>
        </div>
        <div className="card rounded-lg p-6">
          <div className="text-3xl font-bold mb-1">{activeStores}</div>
          <div className="text-sm text-muted-foreground">Active Stores</div>
        </div>
        <div className="card rounded-lg p-6">
          <div className="text-3xl font-bold mb-1">{totalOrders}</div>
          <div className="text-sm text-muted-foreground">Total Orders</div>
        </div>
      </div>

      {/* Top Stores */}
      <div className="card rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Top Stores by Revenue</h2>
        {topStoresWithRevenue.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No sales data yet
          </div>
        ) : (
          <div className="space-y-4">
            {topStoresWithRevenue.map((store, index) => (
              <div
                key={store.id}
                className="flex items-center justify-between pb-4 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-muted-foreground">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="font-semibold">{store.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {store._count.products} products •{" "}
                      {store._count.orders} orders
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">
                    ${store.revenue.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    revenue
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="card rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Recent Platform Transactions</h2>
        {recentTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No transactions yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-border/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Order Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Platform Fee
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Vendor Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentTransactions.map((txn) => (
                  <tr key={txn.id}>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(txn.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {txn.order.user.first_name || txn.order.user.email}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      ${txn.gross_amount.toString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-emerald-500">
                      ${txn.platform_fee.toString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      ${txn.vendor_amount.toString()}
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
