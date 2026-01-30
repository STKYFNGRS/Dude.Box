import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import { Section } from "@/components/Section";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  // Check admin access - redirect if unauthorized
  const admin = await isAdmin();
  if (!admin) {
    redirect("/portal/login?redirect=/admin/customers");
  }

  // Fetch all customers with their subscriptions and orders
  const customers = await prisma.user.findMany({
    orderBy: { created_at: "desc" },
    include: {
      subscriptions: {
        where: {
          status: {
            in: ["active", "trialing"],
          },
        },
      },
      orders: true,
      addresses: {
        where: { is_default: true },
      },
    },
  });

  // Calculate stats
  const totalCustomers = customers.length;
  const subscribedCustomers = customers.filter(
    (c) => c.subscriptions.length > 0
  ).length;
  const customersWithOrders = customers.filter((c) => c.orders.length > 0).length;

  return (
    <div className="flex flex-col gap-8">
      <Section
        eyebrow="Admin"
        title="Customers"
        description={`${totalCustomers} total customers`}
      />

      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card rounded-lg p-4">
          <div className="text-xs uppercase tracking-[0.3em] muted pb-1">
            Total Customers
          </div>
          <div className="section-title text-2xl">{totalCustomers}</div>
        </div>
        <div className="card rounded-lg p-4">
          <div className="text-xs uppercase tracking-[0.3em] muted pb-1">
            Active Subscribers
          </div>
          <div className="section-title text-2xl">{subscribedCustomers}</div>
          <div className="text-xs muted pt-1">
            {totalCustomers > 0
              ? Math.round((subscribedCustomers / totalCustomers) * 100)
              : 0}
            % conversion
          </div>
        </div>
        <div className="card rounded-lg p-4">
          <div className="text-xs uppercase tracking-[0.3em] muted pb-1">
            With Orders
          </div>
          <div className="section-title text-2xl">{customersWithOrders}</div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="card rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr className="text-left">
                <th className="px-6 py-4 text-xs uppercase tracking-[0.3em] muted">
                  Customer
                </th>
                <th className="px-6 py-4 text-xs uppercase tracking-[0.3em] muted">
                  Email
                </th>
                <th className="px-6 py-4 text-xs uppercase tracking-[0.3em] muted">
                  Subscription
                </th>
                <th className="px-6 py-4 text-xs uppercase tracking-[0.3em] muted">
                  Orders
                </th>
                <th className="px-6 py-4 text-xs uppercase tracking-[0.3em] muted">
                  Joined
                </th>
                <th className="px-6 py-4 text-xs uppercase tracking-[0.3em] muted">
                  Location
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm muted">
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="text-sm font-medium">
                          {customer.first_name && customer.last_name
                            ? `${customer.first_name} ${customer.last_name}`
                            : "—"}
                        </div>
                        {customer.is_admin && (
                          <div className="text-xs text-accent">👑 Admin</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">{customer.email}</div>
                      {customer.stripe_customer_id && (
                        <Link
                          href={`https://dashboard.stripe.com/customers/${customer.stripe_customer_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-accent hover:underline"
                        >
                          View in Stripe
                        </Link>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {customer.subscriptions.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {customer.subscriptions.map((sub) => (
                            <div
                              key={sub.id}
                              className={`inline-flex items-center px-2 py-1 rounded text-xs w-fit ${
                                sub.status === "active"
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-blue-500/20 text-blue-400"
                              }`}
                            >
                              {sub.status}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs muted">No subscription</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {customer.orders.length > 0 ? (
                        <div>
                          {customer.orders.length} order
                          {customer.orders.length !== 1 ? "s" : ""}
                        </div>
                      ) : (
                        <div className="text-xs muted">No orders</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {customer.addresses.length > 0 ? (
                        <div className="text-xs">
                          <div>
                            {customer.addresses[0].city},{" "}
                            {customer.addresses[0].state}
                          </div>
                          <div className="muted">
                            {customer.addresses[0].country}
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
    </div>
  );
}
