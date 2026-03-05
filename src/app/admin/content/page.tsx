"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  slug: string;
  status: string;
  createdAt: string;
  publishedAt: string | null;
  category: { id: string; name: string; slug: string };
  author: { id: string; name: string | null; image: string | null };
  tags: { tag: { id: string; name: string } }[];
}

const STATUS_TABS = ["All", "DRAFT", "PUBLISHED", "ARCHIVED"] as const;

export default function ContentPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchArticles = async (status?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (status && status !== "All") params.set("status", status);
      const res = await fetch(`/api/articles?${params}`);
      if (res.ok) {
        setArticles(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch articles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(activeTab);
  }, [activeTab]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/articles/${deleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== deleteId));
        setDeleteId(null);
      }
    } catch (err) {
      console.error("Failed to delete:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Content</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage articles and publications
          </p>
        </div>
        <Link
          href="/admin/content/new"
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + New Article
        </Link>
      </div>

      <div className="flex gap-1 mb-6 bg-[#111827] p-1 rounded-lg border border-[#374151] w-fit">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
              activeTab === tab
                ? "bg-green-500/20 text-green-400 font-medium"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab === "All"
              ? "All"
              : tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="bg-[#111827] border border-[#374151] rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            Loading articles...
          </div>
        ) : articles.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No articles found
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#374151]">
                <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3">
                  Title
                </th>
                <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3">
                  Category
                </th>
                <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3">
                  Status
                </th>
                <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3">
                  Date
                </th>
                <th className="text-right text-xs text-gray-500 uppercase tracking-wider px-5 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#374151]">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-white/[0.02]">
                  <td className="px-5 py-3">
                    <p className="text-sm text-white truncate max-w-xs">
                      {article.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      by {article.author.name ?? "Unknown"}
                    </p>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs text-gray-400 bg-[#1f2937] px-2 py-0.5 rounded">
                      {article.category.name}
                    </span>
                  </td>
                  <td className="px-5 py-3">
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
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-500">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/content/${article.id}/edit`}
                        className="text-xs text-gray-400 hover:text-green-400 transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteId(article.id)}
                        className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111827] border border-[#374151] rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-2">
              Delete Article
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Are you sure? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white bg-[#1f2937] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
