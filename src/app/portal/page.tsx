import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";
import { EditProfileForm } from "@/components/EditProfileForm";
import { EditAddressForm } from "@/components/EditAddressForm";
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
      </div>

      {/* Subscriptions Section - Show ALL subscriptions */}
      {user.subscriptions.length > 0 ? (
        <div>
          <div className="pb-6">
            <span className="text-xs uppercase tracking-[0.35em] muted">
              Your Subscriptions
            </span>
            <h3 className="section-title text-2xl md:text-3xl pt-2">
              Manage Subscriptions
            </h3>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {user.subscriptions.map((subscription) => (
              <Card key={subscription.id} title="Subscription">
                <div className="text-sm space-y-3">
                  <div>
                    <div className={`font-medium ${
                      subscription.status === "active" ? "text-green-400" : 
                      subscription.status === "trialing" ? "text-blue-400" :
                      subscription.cancel_at_period_end ? "text-yellow-400" :
                      "text-gray-400"
                    }`}>
                      {subscription.status === "active" && !subscription.cancel_at_period_end ? "Active" :
                       subscription.status === "active" && subscription.cancel_at_period_end ? "Cancelling" :
                       subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                    </div>
                  </div>
                  
                  {(subscription.status === "active" || subscription.status === "trialing") && (
                    <>
                      <div className="muted">
                        {subscription.cancel_at_period_end ? "Ends" : "Renews"} on{" "}
                        {new Date(subscription.current_period_end).toLocaleDateString()}
                      </div>
                      {subscription.cancel_at_period_end && (
                        <div className="text-yellow-400 text-xs">
                          ⚠️ Cancels at period end
                        </div>
                      )}
                    </>
                  )}
                  
                  {subscription.status === "canceled" && (
                    <div className="muted">
                      Cancelled on{" "}
                      {new Date(subscription.updated_at).toLocaleDateString()}
                    </div>
                  )}
                  
                  <div className="pt-2">
                    <ManageSubscriptionButton 
                      stripeCustomerId={subscription.stripe_customer_id}
                      subscriptionId={subscription.stripe_subscription_id}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card title="No subscription yet">
          <div className="text-sm muted">
            Start your subscription to get premium veteran-owned gear delivered monthly.{" "}
            <Link
              href="/products/subscription-box"
              className="text-accent hover:underline"
            >
              Subscribe now!
            </Link>
          </div>
        </Card>
      )}

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
                  
                  {/* Return Request Button - Only show for paid/shipped orders */}
                  {(order.status === "paid" || order.status === "shipped") && (
                    <div className="pt-3 border-t border-border">
                      <RequestReturnButton 
                        orderId={order.id}
                        orderNumber={order.id.slice(-8)}
                      />
                    </div>
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
          <Card title="Upcoming drops">
            Check back for new product releases and subscription box previews.
          </Card>
          <Card title="Member benefits">
            Exclusive access to limited drops and veteran-made gear.
          </Card>
        </div>
      )}
    </div>
  );
}
