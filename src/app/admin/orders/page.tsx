import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import { Section } from "@/components/Section";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  // Check admin access - redirect if unauthorized
  const admin = await isAdmin();
  if (!admin) {
    redirect("/portal/login?redirect=/admin/orders");
  }

  // Fetch all orders with user and items info
  const orders = await prisma.order.findMany({
    orderBy: { created_at: "desc" },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
        },
      },
      items: {
        include: {
          product: true,
        },
      },
      shipping_address: true,
    },
  });

  // Calculate stats
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const paidCount = orders.filter((o) => o.status === "paid").length;
  const shippedCount = orders.filter((o) => o.status === "shipped").length;
  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.total),
    0
  );

  return (
    <div className="flex flex-col gap-8">
      <Section
        eyebrow="Admin"
        title="Orders"
        description={`${orders.length} total orders`}
      />

      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="card rounded-lg p-4">
          <div className="text-xs uppercase tracking-[0.3em] muted pb-1">
            Pending
          </div>
          <div className="section-title text-2xl">{pendingCount}</div>
        </div>
        <div className="card rounded-lg p-4">
          <div className="text-xs uppercase tracking-[0.3em] muted pb-1">Paid</div>
          <div className="section-title text-2xl">{paidCount}</div>
        </div>
        <div className="card rounded-lg p-4">
          <div className="text-xs uppercase tracking-[0.3em] muted pb-1">
            Shipped
          </div>
          <div className="section-title text-2xl">{shippedCount}</div>
        </div>
        <div className="card rounded-lg p-4">
          <div className="text-xs uppercase tracking-[0.3em] muted pb-1">
            Total Revenue
          </div>
          <div className="section-title text-2xl">
            ${totalRevenue.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr className="text-left">
                <th className="px-6 py-4 text-xs uppercase tracking-[0.3em] muted">
                  Order ID
                </th>
                <th className="px-6 py-4 text-xs uppercase tracking-[0.3em] muted">
                  Customer
                </th>
                <th className="px-6 py-4 text-xs uppercase tracking-[0.3em] muted">
                  Items
                </th>
                <th className="px-6 py-4 text-xs uppercase tracking-[0.3em] muted">
                  Total
                </th>
                <th className="px-6 py-4 text-xs uppercase tracking-[0.3em] muted">
                  Status
                </th>
                <th className="px-6 py-4 text-xs uppercase tracking-[0.3em] muted">
                  Date
                </th>
                <th className="px-6 py-4 text-xs uppercase tracking-[0.3em] muted">
                  Shipping
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm muted">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0">
                    <td className="px-6 py-4">
                      <div className="text-xs font-mono text-accent">
                        {order.id.substring(0, 8)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="text-sm font-medium">
                          {order.user.first_name && order.user.last_name
                            ? `${order.user.first_name} ${order.user.last_name}`
                            : order.user.email}
                        </div>
                        <div className="text-xs muted">{order.user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {order.items.length} item(s)
                      <div className="text-xs muted pt-1">
                        {order.items.map((item) => item.product.name).join(", ")}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      ${order.total.toString()}
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                          order.status === "paid"
                            ? "bg-green-500/20 text-green-400"
                            : order.status === "shipped"
                            ? "bg-blue-500/20 text-blue-400"
                            : order.status === "delivered"
                            ? "bg-purple-500/20 text-purple-400"
                            : order.status === "cancelled"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {order.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {order.shipping_address ? (
                        <div className="text-xs">
                          <div>
                            {order.shipping_address.first_name}{" "}
                            {order.shipping_address.last_name}
                          </div>
                          <div className="muted">
                            {order.shipping_address.city},{" "}
                            {order.shipping_address.state}
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs muted">No address</div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Note about order management */}
      <div className="card rounded-lg p-6 bg-accent/10 border border-accent/20">
        <div className="flex items-start gap-3">
          <div className="text-accent text-xl">ℹ️</div>
          <div>
            <div className="text-sm font-medium pb-1">Order Management</div>
            <div className="text-sm muted">
              To update order status or manage fulfillment, use the{" "}
              <Link
                href="https://dashboard.stripe.com/orders"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Stripe Dashboard
              </Link>
              . Order status updates will sync automatically via webhooks.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
