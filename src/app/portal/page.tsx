import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";

type ShopifyOrder = {
  id: string;
  name: string;
  orderNumber: number;
  processedAt: string;
  fulfillmentStatus: string;
  financialStatus: string;
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  lineItems: {
    nodes: Array<{
      title: string;
      quantity: number;
      variant?: {
        title: string;
      };
    }>;
  };
};

async function getCustomerOrders(customerAccessToken: string): Promise<ShopifyOrder[]> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !token) {
    return [];
  }

  const query = `
    query getCustomer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
          nodes {
            id
            name
            orderNumber
            processedAt
            fulfillmentStatus
            financialStatus
            totalPrice {
              amount
              currencyCode
            }
            lineItems(first: 10) {
              nodes {
                title
                quantity
                variant {
                  title
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(`https://${domain}/api/2024-07/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({
        query,
        variables: { customerAccessToken },
      }),
      cache: "no-store",
    });

    const result = await response.json();
    return result?.data?.customer?.orders?.nodes ?? [];
  } catch {
    return [];
  }
}

export default async function PortalPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="flex flex-col gap-6">
        <Section
          eyebrow="Member Portal"
          title="Secure access required"
          description="Members must sign in to access drop previews and order details."
        />
        <Link
          href="/portal/login"
          className="outline-button rounded px-5 py-3 text-sm uppercase tracking-[0.2em] w-fit"
        >
          Member Login
        </Link>
      </div>
    );
  }

  const customerAccessToken = (session as any)?.customerAccessToken;
  const orders = customerAccessToken ? await getCustomerOrders(customerAccessToken) : [];

  return (
    <div className="flex flex-col gap-10">
      <Section
        eyebrow="Member Portal"
        title="Welcome back"
        description="Account status, orders, and delivery details."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Profile">
          <div className="text-sm space-y-2">
            <div>
              <span className="muted">Name:</span> {session.user?.name ?? "Member"}
            </div>
            <div>
              <span className="muted">Email:</span> {session.user?.email ?? "On file"}
            </div>
            {(session as any)?.isMember && (
              <div className="pt-2">
                <span className="inline-block px-2 py-1 rounded text-xs bg-accent text-background uppercase tracking-wider">
                  Verified Member
                </span>
              </div>
            )}
            <div className="pt-4">
              <Link
                href="/api/auth/signout"
                className="text-xs uppercase tracking-[0.2em] text-accent hover:text-foreground transition-colors"
              >
                Sign Out
              </Link>
            </div>
          </div>
        </Card>
        <Card title="Subscription status">
          <div className="text-sm">
            {orders.length > 0 ? (
              <div className="space-y-2">
                <div className="text-accent">Active Customer</div>
                <div className="muted">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</div>
              </div>
            ) : (
              <div className="muted">
                No orders yet. Start your subscription today!
              </div>
            )}
          </div>
        </Card>
      </div>

      {orders.length > 0 ? (
        <div>
          <div className="pb-6">
            <span className="text-xs uppercase tracking-[0.35em] muted">Order History</span>
            <h3 className="section-title text-2xl md:text-3xl pt-2">Your Orders</h3>
          </div>
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <Card key={order.id} title={`Order ${order.name}`}>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="muted">Date:</span>{" "}
                      {new Date(order.processedAt).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="muted">Total:</span>{" "}
                      {Number(order.totalPrice.amount).toFixed(2)} {order.totalPrice.currencyCode}
                    </div>
                    <div>
                      <span className="muted">Payment:</span>{" "}
                      <span className="capitalize">{order.financialStatus.toLowerCase().replace('_', ' ')}</span>
                    </div>
                    <div>
                      <span className="muted">Fulfillment:</span>{" "}
                      <span className="capitalize">{order.fulfillmentStatus.toLowerCase().replace('_', ' ')}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <div className="muted pb-2">Items:</div>
                    <ul className="space-y-1">
                      {order.lineItems.nodes.map((item, idx) => (
                        <li key={idx}>
                          {item.quantity}x {item.title}
                          {item.variant?.title && item.variant.title !== "Default Title" && (
                            <span className="muted"> ({item.variant.title})</span>
                          )}
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
