import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/admin";
import { Container } from "@/components/Container";

export const metadata = {
  title: "Admin Dashboard | dude.box",
  description: "Administrative dashboard for dude.box",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is admin
  const admin = await isAdmin();
  
  if (!admin) {
    redirect("/portal/login");
  }

  return (
    <Container className="py-8">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Sidebar Navigation */}
        <aside className="card rounded-lg p-6 h-fit">
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] muted pb-2">Admin</h2>
              <h1 className="section-title text-2xl">Dashboard</h1>
            </div>
            
            <nav className="flex flex-col gap-2">
              <Link
                href="/admin"
                className="text-sm px-3 py-2 rounded hover:bg-accent/10 hover:text-accent transition-colors"
              >
                Overview
              </Link>
              <Link
                href="/admin/subscriptions"
                className="text-sm px-3 py-2 rounded hover:bg-accent/10 hover:text-accent transition-colors"
              >
                Subscriptions
              </Link>
              <Link
                href="/admin/orders"
                className="text-sm px-3 py-2 rounded hover:bg-accent/10 hover:text-accent transition-colors"
              >
                Orders
              </Link>
              <Link
                href="/admin/returns"
                className="text-sm px-3 py-2 rounded hover:bg-accent/10 hover:text-accent transition-colors"
              >
                Returns
              </Link>
              <Link
                href="/admin/customers"
                className="text-sm px-3 py-2 rounded hover:bg-accent/10 hover:text-accent transition-colors"
              >
                Customers
              </Link>
              <Link
                href="/admin/announcements"
                className="text-sm px-3 py-2 rounded hover:bg-accent/10 hover:text-accent transition-colors"
              >
                Announcements
              </Link>
              <Link
                href="/admin/stores"
                className="text-sm px-3 py-2 rounded hover:bg-accent/10 hover:text-accent transition-colors"
              >
                Stores
              </Link>
              <Link
                href="/admin/products"
                className="text-sm px-3 py-2 rounded hover:bg-accent/10 hover:text-accent transition-colors"
              >
                Products
              </Link>
              <Link
                href="/admin/analytics"
                className="text-sm px-3 py-2 rounded hover:bg-accent/10 hover:text-accent transition-colors"
              >
                Analytics
              </Link>
            </nav>

            <div className="pt-4 border-t border-border">
              <Link
                href="/portal"
                className="text-sm px-3 py-2 rounded hover:bg-accent/10 hover:text-accent transition-colors flex items-center gap-2"
              >
                ← Back to Portal
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
