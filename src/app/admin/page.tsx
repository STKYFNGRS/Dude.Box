import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import { Section } from "@/components/Section";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // Check admin access - redirect if unauthorized
  const admin = await isAdmin();
  if (!admin) {
    redirect("/portal/login?redirect=/admin");
  }

  // Fetch key metrics
  const [
    totalCustomers,
    totalSubscriptions,
    activeSubscriptions,
    totalOrders,
    recentOrders,
    recentSubscriptions,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.subscription.count(),
    prisma.subscription.count({
      where: {
        status: {
          in: ["active", "trialing"],
        },
      },
    }),
    prisma.order.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { created_at: "desc" },
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
    prisma.subscription.findMany({
      take: 5,
      orderBy: { created_at: "desc" },
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
  ]);

  // Calculate MRR (Monthly Recurring Revenue)
  const monthlyPrice = 60; // $60/month subscription
  const mrr = activeSubscriptions * monthlyPrice;

  return (
    <div className="flex flex-col gap-8">
      <Section
        eyebrow="Admin"
        title="Dashboard Overview"
        description="Key metrics and recent activity"
      />

      {/* Key Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="card rounded-lg p-6">
          <div className="text-xs uppercase tracking-[0.3em] muted pb-2">
            Total Customers
          </div>
          <div className="section-title text-4xl">{totalCustomers}</div>
        </div>

        <div className="card rounded-lg p-6">
          <div className="text-xs uppercase tracking-[0.3em] muted pb-2">
            Active Subscriptions
          </div>
          <div className="section-title text-4xl">{activeSubscriptions}</div>
          <div className="text-xs muted pt-1">
            of {totalSubscriptions} total
          </div>
        </div>

        <div className="card rounded-lg p-6">
          <div className="text-xs uppercase tracking-[0.3em] muted pb-2">
            Monthly Recurring Revenue
          </div>
          <div className="section-title text-4xl">${mrr.toLocaleString()}</div>
        </div>

        <div className="card rounded-lg p-6">
          <div className="text-xs uppercase tracking-[0.3em] muted pb-2">
            Total Orders
          </div>
          <div className="section-title text-4xl">{totalOrders}</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="card rounded-lg p-6">
          <h2 className="section-title text-xl pb-4">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p className="text-sm muted">No orders yet</p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <div className="text-sm font-medium">
                      {order.user.first_name || order.user.email}
                    </div>
                    <div className="text-xs muted">
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium">
                      ${order.total.toString()}
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded ${
                        order.status === "paid"
                          ? "bg-green-500/20 text-green-400"
                          : order.status === "shipped"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {order.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Subscriptions */}
        <div className="card rounded-lg p-6">
          <h2 className="section-title text-xl pb-4">Recent Subscriptions</h2>
          {recentSubscriptions.length === 0 ? (
            <p className="text-sm muted">No subscriptions yet</p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentSubscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <div className="text-sm font-medium">
                      {sub.user.first_name || sub.user.email}
                    </div>
                    <div className="text-xs muted">
                      Started {new Date(sub.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div
                    className={`text-xs px-2 py-1 rounded ${
                      sub.status === "active"
                        ? "bg-green-500/20 text-green-400"
                        : sub.status === "trialing"
                        ? "bg-blue-500/20 text-blue-400"
                        : sub.cancel_at_period_end
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {sub.cancel_at_period_end ? "Cancelling" : sub.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
