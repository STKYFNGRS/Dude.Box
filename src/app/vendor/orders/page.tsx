import { requireVendor } from "@/lib/vendor";
import { prisma } from "@/lib/prisma";
import { MarkAsShippedButton } from "@/components/vendor/MarkAsShippedButton";

export const dynamic = "force-dynamic";

export default async function VendorOrdersPage() {
  const store = await requireVendor();

  const orders = await prisma.order.findMany({
    where: { store_id: store.id },
    orderBy: { created_at: "desc" },
    include: {
      user: {
        select: {
          first_name: true,
          last_name: true,
          email: true,
        },
      },
      shipping_address: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  const pendingCount = orders.filter(
    (o) => o.status === "pending" || o.status === "paid"
  ).length;
  const shippedCount = orders.filter((o) => o.status === "shipped").length;
  const deliveredCount = orders.filter((o) => o.status === "delivered").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Orders</h1>
        <p className="text-muted-foreground">Manage your store orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card rounded-lg p-4">
          <div className="text-2xl font-bold mb-1">{orders.length}</div>
          <div className="text-sm text-muted-foreground">Total Orders</div>
        </div>
        <div className="card rounded-lg p-4">
          <div className="text-2xl font-bold mb-1 text-amber-500">
            {pendingCount}
          </div>
          <div className="text-sm text-muted-foreground">
            Pending Fulfillment
          </div>
        </div>
        <div className="card rounded-lg p-4">
          <div className="text-2xl font-bold mb-1 text-blue-500">
            {shippedCount}
          </div>
          <div className="text-sm text-muted-foreground">Shipped</div>
        </div>
        <div className="card rounded-lg p-4">
          <div className="text-2xl font-bold mb-1 text-emerald-500">
            {deliveredCount}
          </div>
          <div className="text-sm text-muted-foreground">Delivered</div>
        </div>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="card rounded-lg p-12 text-center">
          <div className="text-4xl mb-4">📦</div>
          <h2 className="text-xl font-bold mb-2">No Orders Yet</h2>
          <p className="text-muted-foreground">
            Orders will appear here once customers start purchasing
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-bold text-lg mb-1">
                    Order #{order.id.substring(0, 8)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()} at{" "}
                    {new Date(order.created_at).toLocaleTimeString()}
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                {/* Customer Info */}
                <div>
                  <h3 className="font-medium text-sm mb-2">Customer</h3>
                  <div className="text-sm text-muted-foreground">
                    {order.user.first_name || "Unknown"}{" "}
                    {order.user.last_name || ""}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {order.user.email}
                  </div>
                </div>

                {/* Shipping Address */}
                {order.shipping_address && (
                  <div>
                    <h3 className="font-medium text-sm mb-2">Ship To</h3>
                    <div className="text-sm text-muted-foreground">
                      {order.shipping_address.first_name}{" "}
                      {order.shipping_address.last_name}
                      <br />
                      {order.shipping_address.address1}
                      <br />
                      {order.shipping_address.address2 && (
                        <>
                          {order.shipping_address.address2}
                          <br />
                        </>
                      )}
                      {order.shipping_address.city}, {order.shipping_address.state}{" "}
                      {order.shipping_address.postal_code}
                      <br />
                      {order.shipping_address.country}
                    </div>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="mb-4">
                <h3 className="font-medium text-sm mb-2">Items</h3>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm"
                    >
                      <span>
                        {item.product.name} x{item.quantity}
                      </span>
                      <span className="font-medium">
                        ${item.price.toString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total and Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <div className="text-sm text-muted-foreground">
                    Your Amount (after 1% fee)
                  </div>
                  <div className="text-xl font-bold">
                    ${(order.vendor_amount || order.total).toString()}
                  </div>
                </div>
                {(order.status === "paid" || order.status === "pending") && (
                  <MarkAsShippedButton orderId={order.id} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
