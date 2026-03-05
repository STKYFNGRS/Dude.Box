import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const [
    totalArticles,
    publishedArticles,
    draftArticles,
    pendingAIDrafts,
    totalUsers,
    totalNewsSources,
    recentArticles,
  ] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { status: "PUBLISHED" } }),
    prisma.article.count({ where: { status: "DRAFT" } }),
    prisma.aIDraft.count({ where: { status: "PENDING_REVIEW" } }),
    prisma.user.count(),
    prisma.newsSource.count(),
    prisma.article.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { name: true } },
        category: { select: { name: true } },
      },
    }),
  ]);

  const stats = [
    {
      label: "Total Articles",
      value: totalArticles,
      color: "text-blue-400",
    },
    {
      label: "Published",
      value: publishedArticles,
      color: "text-green-400",
    },
    {
      label: "Drafts",
      value: draftArticles,
      color: "text-yellow-400",
    },
    {
      label: "AI Pending Review",
      value: pendingAIDrafts,
      color: "text-purple-400",
    },
    {
      label: "Total Users",
      value: totalUsers,
      color: "text-cyan-400",
    },
    {
      label: "News Sources",
      value: totalNewsSources,
      color: "text-orange-400",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">
          System overview and recent activity
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-[#111827] border border-[#374151] rounded-lg p-5 hover:border-[#4b5563] transition-colors"
          >
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              {stat.label}
            </p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#111827] border border-[#374151] rounded-lg">
        <div className="px-5 py-4 border-b border-[#374151] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Recent Articles</h2>
          <Link
            href="/admin/content"
            className="text-sm text-green-500 hover:text-green-400 transition-colors"
          >
            View All
          </Link>
        </div>
        {recentArticles.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No articles yet</div>
        ) : (
          <div className="divide-y divide-[#374151]">
            {recentArticles.map((article) => (
              <div
                key={article.id}
                className="px-5 py-3 flex items-center justify-between hover:bg-white/[0.02]"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white truncate">{article.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {article.author.name} &middot; {article.category.name}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      article.status === "PUBLISHED"
                        ? "bg-green-500/10 text-green-400"
                        : article.status === "DRAFT"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : article.status === "REVIEW"
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-gray-500/10 text-gray-400"
                    }`}
                  >
                    {article.status}
                  </span>
                  <span className="text-xs text-gray-600">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
