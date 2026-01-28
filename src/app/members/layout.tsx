import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Container } from "@/components/Container";
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
