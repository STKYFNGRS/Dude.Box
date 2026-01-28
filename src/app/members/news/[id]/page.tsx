import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AnnouncementPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/portal/login?redirect=/members/news");
  }

  const announcement = await prisma.announcement.findUnique({
    where: {
      id: params.id,
      published: true,
    },
    include: {
      author: {
        select: {
          first_name: true,
          last_name: true,
        },
      },
    },
  });

  if (!announcement) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/members/news"
          className="text-sm text-primary hover:underline mb-4 inline-block"
        >
          ← Back to News
        </Link>
      </div>

      <article className="card rounded-lg p-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold mb-3">{announcement.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div>
              By {announcement.author.first_name || "Admin"}{" "}
              {announcement.author.last_name || ""}
            </div>
            <div>•</div>
            <div>{new Date(announcement.created_at).toLocaleDateString()}</div>
          </div>
        </header>

        <div
          className="prose prose-invert max-w-none"
          style={{ whiteSpace: "pre-wrap" }}
        >
          {announcement.content}
        </div>
      </article>
    </div>
  );
}
