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
      <div className="card rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">Welcome, {firstName}</h1>
        <p className="text-muted-foreground">
          {user.role === "admin"
            ? "You have admin access to the platform."
            : user.role === "vendor"
            ? "Manage your store and products from the vendor dashboard."
            : "Access your subscriptions, orders, and member benefits."}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card rounded-lg p-6">
          <div className="text-2xl font-bold mb-1">
            {user.subscriptions.length}
          </div>
          <div className="text-sm text-muted-foreground">
            Active Subscription{user.subscriptions.length !== 1 ? "s" : ""}
          </div>
        </div>
        <div className="card rounded-lg p-6">
          <div className="text-2xl font-bold mb-1">{user.orders.length}</div>
          <div className="text-sm text-muted-foreground">
            Total Orders
          </div>
        </div>
        <div className="card rounded-lg p-6">
          <div className="text-2xl font-bold mb-1">Member</div>
          <div className="text-sm text-muted-foreground capitalize">
            {user.role} Account
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
      {user.role === "customer" && user.subscriptions.length === 0 && (
        <div className="card rounded-lg p-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
          <h2 className="text-xl font-bold mb-2">Start Your Subscription</h2>
          <p className="text-muted-foreground mb-4">
            Join our monthly subscription box and receive curated products
            delivered to your door.
          </p>
          <Link
            href="/products/subscription-box"
            className="solid-button rounded-full px-6 py-2 text-sm inline-block"
          >
            View Subscription
          </Link>
        </div>
      )}

      {user.role === "vendor" && (
        <div className="card rounded-lg p-6 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
          <h2 className="text-xl font-bold mb-2">Manage Your Store</h2>
          <p className="text-muted-foreground mb-4">
            Add products, manage orders, and grow your business.
          </p>
          <Link
            href="/vendor"
            className="solid-button rounded-full px-6 py-2 text-sm inline-block"
          >
            Go to Vendor Dashboard
          </Link>
        </div>
      )}

      {user.is_admin && (
        <div className="card rounded-lg p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20">
          <h2 className="text-xl font-bold mb-2">Admin Access</h2>
          <p className="text-muted-foreground mb-4">
            Manage the platform, approve vendors, and view analytics.
          </p>
          <Link
            href="/admin"
            className="solid-button rounded-full px-6 py-2 text-sm inline-block"
          >
            Go to Admin Dashboard
          </Link>
        </div>
      )}
    </div>
  );
}
