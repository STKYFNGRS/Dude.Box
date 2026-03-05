"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

interface BookmarkedArticle {
  articleId: string;
  createdAt: string;
  article: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    featuredImage: string | null;
    publishedAt: string | null;
    category: { name: string; slug: string };
  };
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [bookmarks, setBookmarks] = useState<BookmarkedArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookmarks")
      .then((res) => res.json())
      .then((data) => setBookmarks(data.bookmarks ?? []))
      .catch(() => setBookmarks([]))
      .finally(() => setLoading(false));
  }, []);

  const firstName = session?.user?.name?.split(" ")[0] ?? "Operator";

  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      <div className="container mx-auto px-4 py-10">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white">
            Welcome back,{" "}
            <span className="text-tactical-500">{firstName}</span>
          </h1>
          <p className="mt-1 text-gray-400">
            Your tactical briefing is ready.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl bg-panel p-5 border border-panel-border">
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Bookmarks
            </p>
            <p className="mt-1 text-2xl font-bold text-white">
              {loading ? "..." : bookmarks.length}
            </p>
          </div>
          <div className="rounded-xl bg-panel p-5 border border-panel-border">
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Role
            </p>
            <p className="mt-1 text-2xl font-bold text-tactical-400">
              {(session?.user as any)?.role ?? "USER"}
            </p>
          </div>
          <div className="rounded-xl bg-panel p-5 border border-panel-border">
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Status
            </p>
            <p className="mt-1 text-2xl font-bold text-green-400">Active</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: "/messages", label: "Messages", icon: "💬" },
            { href: "/settings", label: "Settings", icon: "⚙️" },
            { href: "/conflicts", label: "Conflicts Map", icon: "🗺️" },
            { href: "/articles", label: "Articles", icon: "📰" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-xl bg-panel p-4 border border-panel-border hover:border-tactical-600 hover:shadow-glow transition-all"
            >
              <span className="text-xl">{link.icon}</span>
              <span className="text-sm font-semibold text-gray-200">
                {link.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Bookmarked Articles */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-bold text-white">
            Bookmarked Articles
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-32 animate-pulse rounded-xl bg-panel border border-panel-border"
                />
              ))}
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="rounded-xl bg-panel border border-panel-border p-8 text-center">
              <p className="text-gray-400">No bookmarks yet.</p>
              <Link
                href="/articles"
                className="mt-3 inline-block text-sm font-semibold text-tactical-500 hover:text-tactical-400 transition-colors"
              >
                Browse articles &rarr;
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookmarks.map((bm) => (
                <Link
                  key={bm.articleId}
                  href={`/articles/${bm.article.slug}`}
                  className="group rounded-xl bg-panel border border-panel-border p-5 hover:border-tactical-600 hover:shadow-glow transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-tactical-500">
                        {bm.article.category.name}
                      </span>
                      <h3 className="mt-1 text-sm font-bold text-white line-clamp-2 group-hover:text-tactical-400 transition-colors">
                        {bm.article.title}
                      </h3>
                      {bm.article.excerpt && (
                        <p className="mt-1 text-xs text-gray-500 line-clamp-1">
                          {bm.article.excerpt}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Reading History (placeholder) */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-white">
            Reading History
          </h2>
          <div className="rounded-xl bg-panel border border-panel-border p-8 text-center">
            <p className="text-gray-500">Coming soon</p>
            <p className="mt-1 text-xs text-gray-600">
              Your recently viewed articles will appear here.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
