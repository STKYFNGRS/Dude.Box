"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function EditArticlePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    categoryId: "",
    featuredImage: "",
    tags: "",
    status: "DRAFT",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [articleRes, catRes] = await Promise.all([
          fetch(`/api/articles/${id}`),
          fetch("/api/categories"),
        ]);

        if (!articleRes.ok) throw new Error("Article not found");

        const article = await articleRes.json();
        const cats = await catRes.json();

        setCategories(cats);
        setForm({
          title: article.title,
          content: article.content,
          excerpt: article.excerpt ?? "",
          categoryId: article.categoryId,
          featuredImage: article.featuredImage ?? "",
          tags:
            article.tags
              ?.map((t: { tag: { name: string } }) => t.tag.name)
              .join(", ") ?? "",
          status: article.status,
        });
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load article");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        title: form.title,
        content: form.content,
        excerpt: form.excerpt || undefined,
        categoryId: form.categoryId,
        featuredImage: form.featuredImage || undefined,
        tags: form.tags
          ? form.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : undefined,
        status: form.status,
      };

      const res = await fetch(`/api/articles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to update article");
      }

      router.push("/admin/content");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full bg-[#0a0f1a] border border-[#374151] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition-colors";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-500">Loading article...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link
          href="/admin/content"
          className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          &larr; Back to Content
        </Link>
        <h1 className="text-2xl font-bold text-white mt-2">Edit Article</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-[#111827] border border-[#374151] rounded-lg p-6 space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">
              Content
            </label>
            <textarea
              required
              rows={12}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className={`${inputClass} resize-y`}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">
              Excerpt
            </label>
            <textarea
              rows={3}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className={`${inputClass} resize-y`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">
                Category
              </label>
              <select
                required
                value={form.categoryId}
                onChange={(e) =>
                  setForm({ ...form, categoryId: e.target.value })
                }
                className={inputClass}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className={inputClass}
              >
                <option value="DRAFT">Draft</option>
                <option value="REVIEW">Review</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">
              Featured Image URL
            </label>
            <input
              type="url"
              value={form.featuredImage}
              onChange={(e) =>
                setForm({ ...form, featuredImage: e.target.value })
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Tags</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="Comma-separated tags"
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <Link
            href="/admin/content"
            className="px-6 py-2.5 bg-[#1f2937] text-gray-400 hover:text-white text-sm rounded-lg transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
