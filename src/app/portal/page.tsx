import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";
import { EditProfileForm } from "@/components/EditProfileForm";
import { EditAddressForm } from "@/components/EditAddressForm";
import { ChangePasswordForm } from "@/components/ChangePasswordForm";
import { ManageSubscriptionButton } from "@/components/ManageSubscriptionButton";
import { RequestReturnButton } from "@/components/RequestReturnButton";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function PortalPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/portal/login");
  }

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      subscriptions: {
        include: {
          user: true,
        },
        orderBy: {
          created_at: "desc",
        },
      },
      orders: {
        include: {
          items: {
            include: {
              product: true,
            },
          },
          returns: {
            orderBy: {
              created_at: "desc",
            },
            take: 1, // Get most recent return for each order
          },
        },
        orderBy: {
          created_at: "desc",
        },
      },
      addresses: {
        where: {
          is_default: true,
        },
        take: 1,
      },
    },
  });

  if (!user) {
    redirect("/portal/login");
  }

  const activeSubscriptions = user.subscriptions.filter(
    (sub) => sub.status === "active" || sub.status === "trialing"
  );
  const defaultAddress = user.addresses[0];

  return (
    <div className="flex flex-col gap-10">
      <Section
        eyebrow="Member Portal"
        title={user.first_name ? `Welcome, ${user.first_name}` : "Welcome"}
        description="Account status, orders, and delivery details."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card title="Profile">
          <EditProfileForm
            firstName={user.first_name || ""}
            lastName={user.last_name || ""}
            email={user.email}
          />
        </Card>

        <Card title="Shipping Address">
          <EditAddressForm />
        </Card>

        <Card title="Password">
          <ChangePasswordForm />
        </Card>
      </div>

      {/* Order History */}
      {user.orders.length > 0 ? (
        <div>
          <div className="pb-6">
            <span className="text-xs uppercase tracking-[0.35em] muted">
              Order History
            </span>
            <h3 className="section-title text-2xl md:text-3xl pt-2">
              Your Orders
            </h3>
          </div>
          <div className="flex flex-col gap-4">
            {user.orders.map((order) => (
              <Card key={order.id} title={`Order #${order.id.slice(-8)}`}>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="muted">Date:</span>{" "}
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="muted">Total:</span> $
                      {Number(order.total).toFixed(2)}
                    </div>
                    <div>
                      <span className="muted">Status:</span>{" "}
                      <span className="capitalize">{order.status}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <div className="muted pb-2">Items:</div>
                    <ul className="space-y-1">
                      {order.items.map((item) => (
                        <li key={item.id}>
                          {item.quantity}x {item.product.name} - $
                          {Number(item.price).toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Return Status and Request Button */}
                  {order.returns && order.returns.length > 0 ? (
                    <div className="pt-3 border-t border-border">
                      <div className="space-y-2">
                        <div className="text-xs uppercase tracking-[0.3em] muted">
                          Return Status
                        </div>
                        {order.returns.map((returnItem) => {
                          // Status badge color
                          let statusColor = "bg-gray-500/20 text-gray-300";
                          if (returnItem.status === "requested")
                            statusColor = "bg-yellow-500/20 text-yellow-300";
                          if (returnItem.status === "approved")
                            statusColor = "bg-blue-500/20 text-blue-300";
                          if (returnItem.status === "label_sent")
                            statusColor = "bg-blue-500/20 text-blue-300";
                          if (returnItem.status === "in_transit")
                            statusColor = "bg-purple-500/20 text-purple-300";
                          if (returnItem.status === "received")
                            statusColor = "bg-indigo-500/20 text-indigo-300";
                          if (returnItem.status === "refunded")
                            statusColor = "bg-green-500/20 text-green-300";
                          if (returnItem.status === "rejected")
                            statusColor = "bg-red-500/20 text-red-300";

                          return (
                            <div key={returnItem.id} className="space-y-2">
                              <span
                                className={`inline-block px-3 py-1 rounded text-xs ${statusColor}`}
                              >
                                {returnItem.status.replace("_", " ")}
                              </span>
                              
                              {returnItem.tracking_number && (
                                <div className="text-xs">
                                  <span className="muted">Tracking:</span>{" "}
                                  <span className="font-mono">
                                    {returnItem.tracking_number}
                                  </span>
                                </div>
                              )}
                              
                              {returnItem.label_url && (
                                <div>
                                  <a
                                    href={returnItem.label_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-accent hover:underline text-xs"
                                  >
                                    Download Shipping Label →
                                  </a>
                                </div>
                              )}
                              
                              {returnItem.refund_amount && (
                                <div className="text-xs text-green-400">
                                  Refunded: $
                                  {Number(returnItem.refund_amount).toFixed(2)}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* Return Request Button - Only show for paid/shipped orders */
                    (order.status === "paid" || order.status === "shipped") && (
                      <div className="pt-3 border-t border-border">
                        <RequestReturnButton
                          orderId={order.id}
                          orderNumber={order.id.slice(-8)}
                        />
                      </div>
                    )
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          <Card title="No orders yet">
            Start shopping to see your order history here.
          </Card>
          <Card title="Browse Stores">
            Discover products from veteran-owned stores in our marketplace.
          </Card>
          <Card title="Become a Vendor">
            Want to sell your products? Join our marketplace and reach more customers.
          </Card>
        </div>
      )}
    </div>
  );
}
