import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";
import { EditProfileForm } from "@/components/EditProfileForm";
import { EditAddressForm } from "@/components/EditAddressForm";
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

  const activeSubscription = user.subscriptions.find(
    (sub) => sub.status === "active"
  );
  const defaultAddress = user.addresses[0];

  return (
    <div className="flex flex-col gap-10">
      <Section
        eyebrow="Member Portal"
        title="Welcome back"
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

        <Card title="Subscription status">
          <div className="text-sm">
            {activeSubscription ? (
              <div className="space-y-2">
                <div className="text-accent">Active Subscription</div>
                <div className="muted">
                  Renews on{" "}
                  {new Date(
                    activeSubscription.current_period_end
                  ).toLocaleDateString()}
                </div>
                {activeSubscription.cancel_at_period_end && (
                  <div className="text-yellow-500">
                    Cancels at period end
                  </div>
                )}
                <div className="pt-2">
                  <Link
                    href="/api/subscriptions/portal"
                    className="text-accent hover:underline text-xs"
                  >
                    Manage Subscription →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="muted">
                No active subscription.{" "}
                <Link
                  href="/products/subscription-box"
                  className="text-accent hover:underline"
                >
                  Start today!
                </Link>
              </div>
            )}
          </div>
        </Card>
      </div>

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
