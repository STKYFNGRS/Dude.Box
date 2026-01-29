import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ApproveStoreButton } from "@/components/admin/ApproveStoreButton";
import { RejectStoreButton } from "@/components/admin/RejectStoreButton";
import { SuspendStoreButton } from "@/components/admin/SuspendStoreButton";
import { DeleteStoreButton } from "@/components/admin/DeleteStoreButton";

export const dynamic = "force-dynamic";

export default async function AdminStoreDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;
  const store = await prisma.store.findUnique({
    where: { id },
    include: {
      owner: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          phone: true,
          created_at: true,
        },
      },
      approver: {
        select: {
          first_name: true,
          last_name: true,
          email: true,
        },
      },
      products: {
        take: 10,
        orderBy: { created_at: "desc" },
      },
      orders: {
        take: 10,
        orderBy: { created_at: "desc" },
      },
    },
  });

  if (!store) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/stores"
          className="text-sm text-primary hover:underline mb-4 inline-block"
        >
          ← Back to Stores
        </Link>
        <h1 className="text-3xl font-bold mb-2">{store.name}</h1>
        <p className="text-muted-foreground">{store.subdomain}.dude.box</p>
      </div>

      {/* Status and Actions */}
      <div className="card rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold mb-2">Store Status</h2>
            <span
              className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                store.status === "approved"
                  ? "bg-emerald-500/20 text-emerald-500"
                  : store.status === "pending"
                  ? "bg-amber-500/20 text-amber-500"
                  : "bg-red-500/20 text-red-500"
              }`}
            >
              {store.status.charAt(0).toUpperCase() + store.status.slice(1)}
            </span>
          </div>
          <div className="flex gap-2">
            {store.status === "pending" && (
              <>
                <ApproveStoreButton storeId={store.id} storeName={store.name} />
                <RejectStoreButton storeId={store.id} storeName={store.name} />
              </>
            )}
            {store.status === "approved" && (
              <SuspendStoreButton storeId={store.id} storeName={store.name} />
            )}
            {store.status === "suspended" && (
              <ApproveStoreButton storeId={store.id} storeName={store.name} />
            )}
            <DeleteStoreButton storeId={store.id} storeName={store.name} />
          </div>
        </div>

        {store.approved_at && store.approver && (
          <div className="text-sm text-muted-foreground">
            Approved on {new Date(store.approved_at).toLocaleDateString()} by{" "}
            {store.approver.first_name || store.approver.email}
          </div>
        )}
      </div>

      {/* Store Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Store Details</h2>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Description
              </div>
              <div className="text-sm">
                {store.description || "No description provided"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Contact Email
              </div>
              <div className="text-sm">{store.contact_email}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Stripe Status
              </div>
              <div className="text-sm">
                {store.stripe_onboarded ? (
                  <span className="text-emerald-500">
                    ✓ Connected ({store.stripe_account_id})
                  </span>
                ) : (
                  <span className="text-muted-foreground">Not connected</span>
                )}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Created At
              </div>
              <div className="text-sm">
                {new Date(store.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="card rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Owner Information</h2>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Name</div>
              <div className="text-sm">
                {store.owner.first_name || "Unknown"}{" "}
                {store.owner.last_name || ""}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Email</div>
              <div className="text-sm">{store.owner.email}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Phone</div>
              <div className="text-sm">
                {store.owner.phone || "Not provided"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Member Since
              </div>
              <div className="text-sm">
                {new Date(store.owner.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Policies */}
      <div className="card rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Policies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm font-medium mb-2">Shipping Policy</div>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap">
              {store.shipping_policy || "No shipping policy provided"}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium mb-2">Return Policy</div>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap">
              {store.return_policy || "No return policy provided"}
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="card rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">
          Products ({store.products.length})
        </h2>
        {store.products.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No products added yet
          </div>
        ) : (
          <div className="space-y-2">
            {store.products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div>
                  <div className="font-medium text-sm">{product.name}</div>
                  <div className="text-xs text-muted-foreground">
                    ${product.price.toString()}
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    product.active
                      ? "bg-emerald-500/20 text-emerald-500"
                      : "bg-gray-500/20 text-gray-500"
                  }`}
                >
                  {product.active ? "Active" : "Inactive"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div className="card rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">
          Recent Orders ({store.orders.length})
        </h2>
        {store.orders.length === 0 ? (
          <div className="text-sm text-muted-foreground">No orders yet</div>
        ) : (
          <div className="space-y-2">
            {store.orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div>
                  <div className="font-medium text-sm">
                    Order #{order.id.substring(0, 8)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    ${order.total.toString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {order.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
