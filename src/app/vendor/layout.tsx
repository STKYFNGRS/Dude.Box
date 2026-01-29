import { redirect } from "next/navigation";
import Link from "next/link";
import { getVendorStore } from "@/lib/vendor";
import { Container } from "@/components/Container";

export const metadata = {
  title: "Vendor Dashboard | dude.box",
  description: "Manage your store and products",
};

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = await getVendorStore();

  if (!store) {
    redirect("/members/become-vendor");
  }

  return (
    <Container className="py-8">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Sidebar Navigation */}
        <aside className="card rounded-lg p-6 h-fit">
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] muted pb-2">
                Vendor
              </h2>
              <h1 className="section-title text-2xl">{store.name}</h1>
              <p className="text-xs text-muted-foreground mt-1">
                {store.subdomain}.dude.box
              </p>
            </div>

            <nav className="flex flex-col gap-2">
              <Link
                href="/vendor"
                className="text-sm px-3 py-2 rounded hover:bg-accent/10 hover:text-accent transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/vendor/products"
                className="text-sm px-3 py-2 rounded hover:bg-accent/10 hover:text-accent transition-colors"
              >
                Products
              </Link>
              <Link
                href="/vendor/orders"
                className="text-sm px-3 py-2 rounded hover:bg-accent/10 hover:text-accent transition-colors"
              >
                Orders
              </Link>
              <Link
                href="/vendor/settings"
                className="text-sm px-3 py-2 rounded hover:bg-accent/10 hover:text-accent transition-colors"
              >
                Settings
              </Link>
            </nav>

            <div className="pt-4 border-t border-border">
              <Link
                href={`https://${store.subdomain}.dude.box`}
                className="text-sm px-3 py-2 rounded hover:bg-accent/10 hover:text-accent transition-colors flex items-center gap-2"
                target="_blank"
              >
                🔗 View Your Store
              </Link>
              <Link
                href="/members"
                className="text-sm px-3 py-2 rounded hover:bg-accent/10 hover:text-accent transition-colors flex items-center gap-2"
              >
                ← Back to Members
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main>{children}</main>
      </div>
    </Container>
  );
}
