import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BecomeVendorForm } from "@/components/BecomeVendorForm";

export const dynamic = "force-dynamic";

export default async function BecomeVendorPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/portal/register?redirect=/members/become-vendor");
  }

  // Check if user already has a store
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      owned_stores: true,
    },
  });

  if (!user) {
    redirect("/portal/login");
  }

  const existingStore = user.owned_stores[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Become a Vendor</h1>
        <p className="text-muted-foreground">
          Create your own storefront at dude.box and start selling your products
        </p>
      </div>

      {existingStore ? (
        <div className="card rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-foreground">Your Store</h2>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Store Name
              </div>
              <div className="font-medium text-foreground">{existingStore.name}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Subdomain
              </div>
              <div className="font-medium text-foreground">
                {existingStore.subdomain}.dude.box
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Status</div>
              <span
                className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                  existingStore.status === "approved"
                    ? "bg-emerald-500/20 text-emerald-500"
                    : existingStore.status === "pending"
                    ? "bg-amber-500/20 text-amber-500"
                    : "bg-red-500/20 text-red-500"
                }`}
              >
                {existingStore.status.charAt(0).toUpperCase() +
                  existingStore.status.slice(1)}
              </span>
            </div>

            {existingStore.status === "pending" && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <div className="font-medium mb-1">Pending Approval</div>
                <div className="text-sm text-muted-foreground">
                  Your store is awaiting admin approval. You'll be notified once
                  it's approved and you can start adding products.
                </div>
              </div>
            )}

            {existingStore.status === "approved" && !existingStore.stripe_onboarded && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="font-medium mb-2">Connect Stripe</div>
                <div className="text-sm text-muted-foreground mb-4">
                  Connect your Stripe account to start receiving payments.
                </div>
                <a
                  href={`/api/stores/connect-stripe?storeId=${existingStore.id}`}
                  className="solid-button rounded-full px-6 py-2 text-sm inline-block"
                >
                  Connect Stripe Account
                </a>
              </div>
            )}

            {existingStore.status === "approved" && existingStore.stripe_onboarded && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                <div className="font-medium mb-2">Store Active!</div>
                <div className="text-sm text-muted-foreground mb-4">
                  Your store is live and ready to receive orders.
                </div>
                <a
                  href="/vendor"
                  className="solid-button rounded-full px-6 py-2 text-sm inline-block"
                >
                  Go to Vendor Dashboard
                </a>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="card rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Create Your Store</h2>
          <BecomeVendorForm />
        </div>
      )}

      <div className="card rounded-lg p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <h2 className="text-xl font-bold mb-4">What You Get</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="text-primary mt-1">✓</div>
            <div>
              <div className="font-medium">Custom Subdomain</div>
              <div className="text-sm text-muted-foreground">
                Your own branded storefront at yourstore.dude.box
              </div>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="text-primary mt-1">✓</div>
            <div>
              <div className="font-medium">Direct Payments</div>
              <div className="text-sm text-muted-foreground">
                Connect your Stripe account and receive payments directly
                (minus our 1% platform fee)
              </div>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="text-primary mt-1">✓</div>
            <div>
              <div className="font-medium">Full Control</div>
              <div className="text-sm text-muted-foreground">
                Manage your products, orders, and shipping settings
              </div>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="text-primary mt-1">✓</div>
            <div>
              <div className="font-medium">Your Shipping</div>
              <div className="text-sm text-muted-foreground">
                Use your own shipping accounts and methods
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
