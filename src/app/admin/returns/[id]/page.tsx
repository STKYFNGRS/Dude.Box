import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { ApproveReturnButton } from "@/components/admin/ApproveReturnButton";
import { RejectReturnButton } from "@/components/admin/RejectReturnButton";
import { RefundButton } from "@/components/admin/RefundButton";
import { UpdateReturnStatusButton } from "@/components/admin/UpdateReturnStatusButton";

export const metadata = {
  title: "Return Details | Admin",
  description: "View and manage return request details",
};

export default async function ReturnDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const admin = await isAdmin();
  if (!admin) {
    redirect("/portal/login");
  }

  const returnItem = await prisma.return.findUnique({
    where: { id: params.id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
          phone: true,
        },
      },
      order: {
        include: {
          items: {
            include: {
              product: true,
            },
          },
          shipping_address: true,
        },
      },
    },
  });

  if (!returnItem) {
    redirect("/admin/returns");
  }

  const customerName =
    `${returnItem.user.first_name || ""} ${returnItem.user.last_name || ""}`.trim() ||
    "Customer";

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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/returns"
            className="text-accent hover:underline text-sm mb-2 inline-block"
          >
            ← Back to Returns
          </Link>
          <h1 className="section-title text-3xl">
            Return #{returnItem.id.slice(-8)}
          </h1>
        </div>
        <span className={`px-4 py-2 rounded text-sm ${statusColor}`}>
          {returnItem.status.replace("_", " ")}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {returnItem.status === "requested" && (
            <>
              <ApproveReturnButton returnId={returnItem.id} />
              <RejectReturnButton returnId={returnItem.id} />
            </>
          )}
          {returnItem.status === "approved" && (
            <ApproveReturnButton returnId={returnItem.id} />
          )}
          {returnItem.status === "label_sent" && (
            <UpdateReturnStatusButton
              returnId={returnItem.id}
              newStatus="in_transit"
              label="Mark as In Transit"
            />
          )}
          {returnItem.status === "in_transit" && (
            <UpdateReturnStatusButton
              returnId={returnItem.id}
              newStatus="received"
              label="Mark as Received"
            />
          )}
          {returnItem.status === "received" && !returnItem.refund_amount && (
            <RefundButton
              returnId={returnItem.id}
              orderTotal={Number(returnItem.order.total)}
              orderId={returnItem.order.id}
            />
          )}
          {returnItem.refund_amount && (
            <div className="text-sm text-green-400">
              ✓ Refunded ${Number(returnItem.refund_amount).toFixed(2)}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Customer Information */}
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">Customer Information</h2>
          <div className="space-y-3">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] muted">
                Name
              </div>
              <div className="text-lg">{customerName}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.3em] muted">
                Email
              </div>
              <div className="text-lg">
                <a
                  href={`mailto:${returnItem.user.email}`}
                  className="text-accent hover:underline"
                >
                  {returnItem.user.email}
                </a>
              </div>
            </div>
            {returnItem.user.phone && (
              <div>
                <div className="text-xs uppercase tracking-[0.3em] muted">
                  Phone
                </div>
                <div className="text-lg">
                  <a
                    href={`tel:${returnItem.user.phone}`}
                    className="text-accent hover:underline"
                  >
                    {returnItem.user.phone}
                  </a>
                </div>
              </div>
            )}
            <div className="pt-2">
              <Link
                href={`/admin/customers`}
                className="text-accent hover:underline text-sm"
              >
                View Customer Profile →
              </Link>
            </div>
          </div>
        </div>

        {/* Order Information */}
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">Order Information</h2>
          <div className="space-y-3">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] muted">
                Order ID
              </div>
              <div className="font-mono text-lg">
                #{returnItem.order.id.slice(-8)}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.3em] muted">
                Order Date
              </div>
              <div className="text-lg">
                {new Date(returnItem.order.created_at).toLocaleDateString()}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.3em] muted">
                Order Total
              </div>
              <div className="text-lg">
                ${Number(returnItem.order.total).toFixed(2)}
              </div>
            </div>
            <div className="pt-2">
              <Link
                href={`/admin/orders`}
                className="text-accent hover:underline text-sm"
              >
                View Order Details →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Items to Return */}
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4">Items in Order</h2>
        <div className="space-y-3">
          {returnItem.order.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center py-3 border-b border-border last:border-0"
            >
              <div>
                <div className="font-medium">{item.product.name}</div>
                <div className="text-sm muted">Quantity: {item.quantity}</div>
              </div>
              <div className="text-lg">
                ${Number(item.price).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Return Reason */}
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4">Return Reason</h2>
        <div className="bg-background p-4 rounded border border-border">
          <p className="whitespace-pre-wrap">{returnItem.reason}</p>
        </div>
      </div>

      {/* Shipping Address */}
      {returnItem.order.shipping_address && (
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
          <div className="space-y-1">
            <div>
              {returnItem.order.shipping_address.first_name}{" "}
              {returnItem.order.shipping_address.last_name}
            </div>
            <div>{returnItem.order.shipping_address.address1}</div>
            {returnItem.order.shipping_address.address2 && (
              <div>{returnItem.order.shipping_address.address2}</div>
            )}
            <div>
              {returnItem.order.shipping_address.city},{" "}
              {returnItem.order.shipping_address.state}{" "}
              {returnItem.order.shipping_address.postal_code}
            </div>
            <div>{returnItem.order.shipping_address.country}</div>
            {returnItem.order.shipping_address.phone && (
              <div className="pt-2 text-sm muted">
                Phone: {returnItem.order.shipping_address.phone}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tracking Information */}
      {(returnItem.tracking_number ||
        returnItem.label_url ||
        returnItem.carrier) && (
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">Tracking Information</h2>
          <div className="space-y-3">
            {returnItem.carrier && (
              <div>
                <div className="text-xs uppercase tracking-[0.3em] muted">
                  Carrier
                </div>
                <div className="text-lg">{returnItem.carrier}</div>
              </div>
            )}
            {returnItem.tracking_number && (
              <div>
                <div className="text-xs uppercase tracking-[0.3em] muted">
                  Tracking Number
                </div>
                <div className="font-mono text-lg">
                  {returnItem.tracking_number}
                </div>
              </div>
            )}
            {returnItem.label_url && (
              <div>
                <a
                  href={returnItem.label_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  View Shipping Label →
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Refund Information */}
      {returnItem.stripe_refund_id && (
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">Refund Information</h2>
          <div className="space-y-3">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] muted">
                Refund Amount
              </div>
              <div className="text-2xl font-bold text-green-400">
                ${Number(returnItem.refund_amount).toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.3em] muted">
                Stripe Refund ID
              </div>
              <div className="font-mono text-sm">
                {returnItem.stripe_refund_id}
              </div>
            </div>
            <div>
              <a
                href={`https://dashboard.stripe.com/${process.env.STRIPE_SECRET_KEY?.startsWith("sk_test") ? "test/" : ""}refunds/${returnItem.stripe_refund_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline text-sm"
              >
                View in Stripe Dashboard →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Admin Notes */}
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4">Admin Notes</h2>
        {returnItem.admin_notes ? (
          <div className="bg-background p-4 rounded border border-border">
            <p className="whitespace-pre-wrap">{returnItem.admin_notes}</p>
          </div>
        ) : (
          <p className="muted">No admin notes yet</p>
        )}
        {/* TODO: Add form to update admin notes */}
      </div>

      {/* Timeline */}
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4">Timeline</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-accent mt-2"></div>
            <div>
              <div className="font-medium">Return Requested</div>
              <div className="text-sm muted">
                {new Date(returnItem.created_at).toLocaleString()}
              </div>
            </div>
          </div>
          {returnItem.updated_at.getTime() !==
            returnItem.created_at.getTime() && (
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-accent mt-2"></div>
              <div>
                <div className="font-medium">Last Updated</div>
                <div className="text-sm muted">
                  {new Date(returnItem.updated_at).toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
