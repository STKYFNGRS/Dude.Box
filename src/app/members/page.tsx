import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function MembersDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/portal/login?redirect=/members");
  }

  // Fetch user data with stats
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      subscriptions: {
        where: {
          status: { in: ["active", "trialing"] },
        },
      },
      orders: {
        orderBy: { created_at: "desc" },
        take: 5,
      },
    },
  });

  if (!user) {
    redirect("/portal/login");
  }

  // Fetch recent announcements
  const announcements = await prisma.announcement.findMany({
    where: { published: true },
    orderBy: { created_at: "desc" },
    take: 3,
    include: {
      author: {
        select: {
          first_name: true,
          last_name: true,
        },
      },
    },
  });

  const firstName = user.first_name || session.user.email?.split("@")[0] || "there";

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="card rounded-lg p-8 border-l-4 border-l-accent shadow-card animate-fade-in">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted bg-clip-text text-transparent">
          Welcome, {firstName}
        </h1>
        <p className="text-lg text-muted leading-relaxed">
          {user.role === "admin"
            ? "You have admin access to the platform."
            : user.role === "vendor"
            ? "Manage your store and products from the vendor dashboard."
            : "Access your orders and marketplace purchases."}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card-hover rounded-lg p-6 border-l-4 border-l-info">
          <div className="text-3xl font-bold mb-1 text-info">{user.orders.length}</div>
          <div className="text-sm text-muted-foreground uppercase tracking-wider">
            Total Orders
          </div>
        </div>
        <div className="card-hover rounded-lg p-6 border-l-4 border-l-success">
          <div className="text-3xl font-bold mb-1 text-success capitalize">{user.role}</div>
          <div className="text-sm text-muted-foreground uppercase tracking-wider">
            Account Type
          </div>
        </div>
      </div>

      {/* Recent Announcements */}
      {announcements.length > 0 && (
        <div className="card rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recent News</h2>
            <Link
              href="/members/news"
              className="text-sm text-primary hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <Link
                key={announcement.id}
                href={`/members/news/${announcement.id}`}
                className="block group"
              >
                <div className="pb-4 border-b border-border last:border-0 last:pb-0">
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                    {announcement.title}
                  </h3>
                  {announcement.excerpt && (
                    <p className="text-sm text-muted-foreground">
                      {announcement.excerpt}
                    </p>
                  )}
                  <div className="text-xs text-muted-foreground mt-2">
                    {new Date(announcement.created_at).toLocaleDateString()} by{" "}
                    {announcement.author.first_name || "Admin"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Call to Action based on role */}
      {user.role === "vendor" && (
        <div className="card-hover rounded-lg p-8 bg-gradient-to-r from-success/10 to-info/10 border-2 border-success/20 shadow-card">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-success/20 border-2 border-success/40 flex items-center justify-center text-2xl flex-shrink-0">
              📦
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2 text-foreground">Manage Your Store</h2>
              <p className="text-muted mb-6 leading-relaxed">
                Add products, manage orders, and grow your business.
              </p>
              <Link
                href="/vendor"
                className="solid-button rounded-full px-8 py-3 text-sm inline-block font-bold shadow-button"
              >
                Go to Vendor Dashboard →
              </Link>
            </div>
          </div>
        </div>
      )}

      {user.is_admin && (
        <div className="card-hover rounded-lg p-8 bg-gradient-to-r from-warning/10 to-error/10 border-2 border-warning/20 shadow-card">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-warning/20 border-2 border-warning/40 flex items-center justify-center text-2xl flex-shrink-0">
              ⚡
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2 text-foreground">Admin Access</h2>
              <p className="text-muted mb-6 leading-relaxed">
                Manage the platform, approve vendors, and view analytics.
              </p>
              <Link
                href="/admin"
                className="solid-button rounded-full px-8 py-3 text-sm inline-block font-bold shadow-button"
              >
                Go to Admin Dashboard →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
