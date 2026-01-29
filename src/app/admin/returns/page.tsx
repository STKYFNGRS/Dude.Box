import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Returns Management | Admin",
  description: "Manage customer return requests and refunds",
};

export default async function AdminReturnsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const admin = await isAdmin();
  if (!admin) {
    redirect("/portal/login");
  }

  const statusFilter = searchParams.status || "all";

  // Fetch returns with filters
  const whereClause =
    statusFilter === "all" ? {} : { status: statusFilter };

  const returns = await prisma.return.findMany({
    where: whereClause,
    include: {
      user: {
        select: {
          email: true,
          first_name: true,
          last_name: true,
        },
      },
      order: {
        select: {
          id: true,
          total: true,
          created_at: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  // Calculate stats
  const stats = {
    requested: returns.filter((r) => r.status === "requested").length,
    approved: returns.filter((r) => r.status === "approved").length,
    label_sent: returns.filter((r) => r.status === "label_sent").length,
    in_transit: returns.filter((r) => r.status === "in_transit").length,
    received: returns.filter((r) => r.status === "received").length,
    refunded: returns.filter((r) => r.status === "refunded").length,
    rejected: returns.filter((r) => r.status === "rejected").length,
    total: returns.length,
  };

  const totalRefunded = returns
    .filter((r) => r.refund_amount)
    .reduce((sum, r) => sum + Number(r.refund_amount), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="section-title text-3xl">Returns Management</h1>
        <p className="muted mt-2">
          Manage customer return requests, generate shipping labels, and process
          refunds
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="card p-6">
          <div className="text-xs uppercase tracking-[0.3em] muted">
            Pending Requests
          </div>
          <div className="text-3xl font-bold mt-2">{stats.requested}</div>
        </div>
        <div className="card p-6">
          <div className="text-xs uppercase tracking-[0.3em] muted">
            In Progress
          </div>
          <div className="text-3xl font-bold mt-2">
            {stats.approved + stats.label_sent + stats.in_transit}
          </div>
        </div>
        <div className="card p-6">
          <div className="text-xs uppercase tracking-[0.3em] muted">
            Refunded
          </div>
          <div className="text-3xl font-bold mt-2">{stats.refunded}</div>
        </div>
        <div className="card p-6">
          <div className="text-xs uppercase tracking-[0.3em] muted">
            Total Refunded
          </div>
          <div className="text-3xl font-bold mt-2">
            ${totalRefunded.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Status Filter */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/returns"
            className={`px-4 py-2 rounded text-sm transition-colors ${
              statusFilter === "all"
                ? "bg-accent text-white"
                : "bg-background hover:bg-accent/10"
            }`}
          >
            All ({stats.total})
          </Link>
          <Link
            href="/admin/returns?status=requested"
            className={`px-4 py-2 rounded text-sm transition-colors ${
              statusFilter === "requested"
                ? "bg-accent text-white"
                : "bg-background hover:bg-accent/10"
            }`}
          >
            Requested ({stats.requested})
          </Link>
          <Link
            href="/admin/returns?status=approved"
            className={`px-4 py-2 rounded text-sm transition-colors ${
              statusFilter === "approved"
                ? "bg-accent text-white"
                : "bg-background hover:bg-accent/10"
            }`}
          >
            Approved ({stats.approved})
          </Link>
          <Link
            href="/admin/returns?status=label_sent"
            className={`px-4 py-2 rounded text-sm transition-colors ${
              statusFilter === "label_sent"
                ? "bg-accent text-white"
                : "bg-background hover:bg-accent/10"
            }`}
          >
            Label Sent ({stats.label_sent})
          </Link>
          <Link
            href="/admin/returns?status=in_transit"
            className={`px-4 py-2 rounded text-sm transition-colors ${
              statusFilter === "in_transit"
                ? "bg-accent text-white"
                : "bg-background hover:bg-accent/10"
            }`}
          >
            In Transit ({stats.in_transit})
          </Link>
          <Link
            href="/admin/returns?status=received"
            className={`px-4 py-2 rounded text-sm transition-colors ${
              statusFilter === "received"
                ? "bg-accent text-white"
                : "bg-background hover:bg-accent/10"
            }`}
          >
            Received ({stats.received})
          </Link>
          <Link
            href="/admin/returns?status=refunded"
            className={`px-4 py-2 rounded text-sm transition-colors ${
              statusFilter === "refunded"
                ? "bg-accent text-white"
                : "bg-background hover:bg-accent/10"
            }`}
          >
            Refunded ({stats.refunded})
          </Link>
          <Link
            href="/admin/returns?status=rejected"
            className={`px-4 py-2 rounded text-sm transition-colors ${
              statusFilter === "rejected"
                ? "bg-accent text-white"
                : "bg-background hover:bg-accent/10"
            }`}
          >
            Rejected ({stats.rejected})
          </Link>
        </div>
      </div>

      {/* Returns Table */}
      <div className="card overflow-hidden">
        {returns.length === 0 ? (
          <div className="p-12 text-center muted">
            <p>No returns found</p>
            {statusFilter !== "all" && (
              <Link
                href="/admin/returns"
                className="text-accent hover:underline mt-2 inline-block"
              >
                View all returns
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left p-4 text-xs uppercase tracking-[0.3em] muted">
                    Return ID
                  </th>
                  <th className="text-left p-4 text-xs uppercase tracking-[0.3em] muted">
                    Customer
                  </th>
                  <th className="text-left p-4 text-xs uppercase tracking-[0.3em] muted">
                    Order
                  </th>
                  <th className="text-left p-4 text-xs uppercase tracking-[0.3em] muted">
                    Status
                  </th>
                  <th className="text-left p-4 text-xs uppercase tracking-[0.3em] muted">
                    Requested
                  </th>
                  <th className="text-left p-4 text-xs uppercase tracking-[0.3em] muted">
                    Refund
                  </th>
                  <th className="text-left p-4 text-xs uppercase tracking-[0.3em] muted">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {returns.map((returnItem) => {
                  const customerName =
                    `${returnItem.user.first_name || ""} ${
                      returnItem.user.last_name || ""
                    }`.trim() || "Customer";

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
                    <tr key={returnItem.id} className="border-b border-border">
                      <td className="p-4">
                        <div className="font-mono text-sm">
                          #{returnItem.id.slice(-8)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">{customerName}</div>
                        <div className="text-xs muted">
                          {returnItem.user.email}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-mono text-sm">
                          #{returnItem.order.id.slice(-8)}
                        </div>
                        <div className="text-xs muted">
                          ${Number(returnItem.order.total).toFixed(2)}
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-3 py-1 rounded text-xs ${statusColor}`}
                        >
                          {returnItem.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {new Date(returnItem.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {returnItem.refund_amount
                            ? `$${Number(returnItem.refund_amount).toFixed(2)}`
                            : "-"}
                        </div>
                      </td>
                      <td className="p-4">
                        <Link
                          href={`/admin/returns/${returnItem.id}`}
                          className="text-accent hover:underline text-sm"
                        >
                          View Details →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
