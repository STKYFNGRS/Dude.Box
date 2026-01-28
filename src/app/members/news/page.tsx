import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/portal/login?redirect=/members/news");
  }

  const announcements = await prisma.announcement.findMany({
    where: { published: true },
    orderBy: { created_at: "desc" },
    include: {
      author: {
        select: {
          first_name: true,
          last_name: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">News & Announcements</h1>
        <p className="text-muted-foreground">
          Stay up to date with the latest news and updates from Dude.Box
        </p>
      </div>

      {announcements.length === 0 ? (
        <div className="card rounded-lg p-12 text-center">
          <div className="text-muted-foreground">
            No announcements yet. Check back soon!
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Link
              key={announcement.id}
              href={`/members/news/${announcement.id}`}
              className="card rounded-lg p-6 block hover:border-primary/50 transition-colors group"
            >
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-xl font-bold group-hover:text-primary transition-colors">
                  {announcement.title}
                </h2>
                <div className="text-sm text-muted-foreground">
                  {new Date(announcement.created_at).toLocaleDateString()}
                </div>
              </div>
              {announcement.excerpt && (
                <p className="text-muted-foreground mb-3">
                  {announcement.excerpt}
                </p>
              )}
              <div className="text-sm text-muted-foreground">
                By {announcement.author.first_name || "Admin"}{" "}
                {announcement.author.last_name || ""}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
