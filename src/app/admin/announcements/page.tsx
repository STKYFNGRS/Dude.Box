import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import Link from "next/link";
import { CreateAnnouncementForm } from "@/components/admin/CreateAnnouncementForm";
import { TogglePublishButton } from "@/components/admin/TogglePublishButton";
import { DeleteAnnouncementButton } from "@/components/admin/DeleteAnnouncementButton";

export const dynamic = "force-dynamic";

export default async function AdminAnnouncementsPage() {
  await requireAdmin();

  const announcements = await prisma.announcement.findMany({
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

  const publishedCount = announcements.filter((a) => a.published).length;
  const draftCount = announcements.filter((a) => !a.published).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Announcements</h1>
          <p className="text-muted-foreground">
            Manage news and announcements for members
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card rounded-lg p-4">
          <div className="text-2xl font-bold mb-1">{announcements.length}</div>
          <div className="text-sm text-muted-foreground">
            Total Announcements
          </div>
        </div>
        <div className="card rounded-lg p-4">
          <div className="text-2xl font-bold mb-1">{publishedCount}</div>
          <div className="text-sm text-muted-foreground">Published</div>
        </div>
        <div className="card rounded-lg p-4">
          <div className="text-2xl font-bold mb-1">{draftCount}</div>
          <div className="text-sm text-muted-foreground">Drafts</div>
        </div>
      </div>

      {/* Create New Announcement */}
      <div className="card rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Create New Announcement</h2>
        <CreateAnnouncementForm />
      </div>

      {/* Announcements List */}
      <div className="card rounded-lg overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold">All Announcements</h2>
        </div>
        {announcements.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No announcements yet. Create your first one above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-border/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {announcements.map((announcement) => (
                  <tr key={announcement.id}>
                    <td className="px-6 py-4">
                      <div className="font-medium">{announcement.title}</div>
                      {announcement.excerpt && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {announcement.excerpt.substring(0, 100)}
                          {announcement.excerpt.length > 100 ? "..." : ""}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          announcement.published
                            ? "bg-emerald-500/20 text-emerald-500"
                            : "bg-amber-500/20 text-amber-500"
                        }`}
                      >
                        {announcement.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {announcement.author.first_name || "Admin"}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(announcement.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <TogglePublishButton
                        announcementId={announcement.id}
                        currentStatus={announcement.published}
                      />
                      <DeleteAnnouncementButton
                        announcementId={announcement.id}
                        title={announcement.title}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
