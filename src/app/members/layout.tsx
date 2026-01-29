import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Container } from "@/components/Container";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function MembersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/portal/login?redirect=/members");
  }

  // Fetch user role to show conditional links
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      role: true,
      is_admin: true,
    },
  });

  return (
    <Container className="py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="lg:w-64 flex-shrink-0">
          <nav className="card rounded-lg p-4 space-y-2">
            <Link
              href="/members"
              className="block px-4 py-2 rounded hover:bg-border/50 transition-colors text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/members/news"
              className="block px-4 py-2 rounded hover:bg-border/50 transition-colors text-sm font-medium"
            >
              News & Announcements
            </Link>
            
            {/* Vendor Dashboard Link */}
            {user?.role === "vendor" && (
              <>
                <div className="pt-4 mt-4 border-t border-border">
                  <div className="px-4 py-1 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Vendor
                  </div>
                </div>
                <Link
                  href="/vendor"
                  className="block px-4 py-2 rounded hover:bg-emerald-500/10 transition-colors text-sm font-medium text-emerald-500"
                >
                  📦 My Store
                </Link>
                <Link
                  href="/vendor/products"
                  className="block px-4 py-2 rounded hover:bg-border/50 transition-colors text-sm text-muted-foreground"
                >
                  Products
                </Link>
                <Link
                  href="/vendor/orders"
                  className="block px-4 py-2 rounded hover:bg-border/50 transition-colors text-sm text-muted-foreground"
                >
                  Orders
                </Link>
                <Link
                  href="/vendor/settings"
                  className="block px-4 py-2 rounded hover:bg-border/50 transition-colors text-sm text-muted-foreground"
                >
                  Store Settings
                </Link>
              </>
            )}

            {/* Admin Dashboard Link */}
            {user?.is_admin && (
              <>
                <div className="pt-4 mt-4 border-t border-border">
                  <div className="px-4 py-1 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Platform Admin
                  </div>
                </div>
                <Link
                  href="/admin"
                  className="block px-4 py-2 rounded hover:bg-amber-500/10 transition-colors text-sm font-medium text-amber-500"
                >
                  ⚡ Admin Dashboard
                </Link>
                <Link
                  href="/admin/stores"
                  className="block px-4 py-2 rounded hover:bg-border/50 transition-colors text-sm text-muted-foreground"
                >
                  Manage Stores
                </Link>
                <Link
                  href="/admin/products"
                  className="block px-4 py-2 rounded hover:bg-border/50 transition-colors text-sm text-muted-foreground"
                >
                  All Products
                </Link>
                <Link
                  href="/admin/orders"
                  className="block px-4 py-2 rounded hover:bg-border/50 transition-colors text-sm text-muted-foreground"
                >
                  All Orders
                </Link>
              </>
            )}

            <div className="pt-4 mt-4 border-t border-border">
              <Link
                href="/portal"
                className="block px-4 py-2 rounded hover:bg-border/50 transition-colors text-sm font-medium text-muted-foreground"
              >
                Account Settings
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </Container>
  );
}
