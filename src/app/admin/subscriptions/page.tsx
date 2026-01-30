import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import { Section } from "@/components/Section";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminSubscriptionsPage() {
  // Check admin access - redirect if unauthorized
  const admin = await isAdmin();
  if (!admin) {
    redirect("/portal/login?redirect=/admin/subscriptions");
  }

  // Fetch all subscriptions with user info
  const subscriptions = await prisma.subscription.findMany({
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
    },
  });

  // Calculate stats
  const activeCount = subscriptions.filter((s) =>
    ["active", "trialing"].includes(s.status)
  ).length;
  const cancelledCount = subscriptions.filter((s) =>
    s.cancel_at_period_end
  ).length;
  const churnedCount = subscriptions.filter((s) =>
    s.status === "canceled"
  ).length;

  return (
    <div className="flex flex-col gap-8">
      <Section
        eyebrow="Admin"
        title="Subscriptions"
        description={`${subscriptions.length} total subscriptions`}
      />

      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="card rounded-lg p-4">
          <div className="text-xs uppercase tracking-[0.3em] muted pb-1">Active</div>
          <div className="section-title text-2xl">{activeCount}</div>
        </div>
        <div className="card rounded-lg p-4">
          <div className="text-xs uppercase tracking-[0.3em] muted pb-1">Cancelling</div>
          <div className="section-title text-2xl">{cancelledCount}</div>
        </div>
        <div className="card rounded-lg p-4">
          <div className="text-xs uppercase tracking-[0.3em] muted pb-1">Churned</div>
          <div className="section-title text-2xl">{churnedCount}</div>
        </div>
        <div className="card rounded-lg p-4">
          <div className="text-xs uppercase tracking-[0.3em] muted pb-1">Retention</div>
          <div className="section-title text-2xl">
            {subscriptions.length > 0
              ? Math.round((activeCount / subscriptions.length) * 100)
              : 0}
            %
          </div>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="card rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr className="text-left">
                <th className="px-6 py-4 text-xs uppercase tracking-[0.3em] muted">
                  Customer
                </th>
                <th className="px-6 py-4 text-xs uppercase tracking-[0.3em] muted">
                  Status
                </th>
                <th className="px-6 py-4 text-xs uppercase tracking-[0.3em] muted">
                  Started
                </th>
                <th className="px-6 py-4 text-xs uppercase tracking-[0.3em] muted">
                  Next Billing
                </th>
                <th className="px-6 py-4 text-xs uppercase tracking-[0.3em] muted">
                  Stripe ID
                </th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm muted">
                    No subscriptions found
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr key={sub.id} className="border-b border-border last:border-0">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="text-sm font-medium">
                          {sub.user.first_name && sub.user.last_name
                            ? `${sub.user.first_name} ${sub.user.last_name}`
                            : sub.user.email}
                        </div>
                        <div className="text-xs muted">{sub.user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div
                          className={`inline-flex items-center px-2 py-1 rounded text-xs w-fit ${
                            sub.status === "active"
                              ? "bg-green-500/20 text-green-400"
                              : sub.status === "trialing"
                              ? "bg-blue-500/20 text-blue-400"
                              : sub.status === "past_due"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {sub.status}
                        </div>
                        {sub.cancel_at_period_end && (
                          <div className="text-xs text-yellow-400">
                            ⚠️ Cancels at period end
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(sub.current_period_end).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`https://dashboard.stripe.com/subscriptions/${sub.stripe_subscription_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-accent hover:underline font-mono"
                      >
                        {sub.stripe_subscription_id.substring(0, 20)}...
                      </Link>
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
