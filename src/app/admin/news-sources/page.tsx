"use client";

import { useEffect, useState } from "react";

interface NewsSource {
  id: string;
  name: string;
  url: string;
  feedUrl: string;
  categoryId: string | null;
  active: boolean;
  lastFetched: string | null;
  createdAt: string;
  category: { id: string; name: string } | null;
}

interface Category {
  id: string;
  name: string;
}

export default function NewsSourcesPage() {
  const [sources, setSources] = useState<NewsSource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deduping, setDeduping] = useState(false);
  const [dedupResult, setDedupResult] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    url: "",
    feedUrl: "",
    categoryId: "",
  });

  const fetchSources = async () => {
    try {
      const [srcRes, catRes] = await Promise.all([
        fetch("/api/news-sources"),
        fetch("/api/categories"),
      ]);
      if (srcRes.ok) setSources(await srcRes.json());
      if (catRes.ok) setCategories(await catRes.json());
    } catch (err) {
      console.error("Failed to fetch sources:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/news-sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          categoryId: form.categoryId || undefined,
        }),
      });
      if (res.ok) {
        const newSource = await res.json();
        setSources((prev) => [newSource, ...prev]);
        setForm({ name: "", url: "", feedUrl: "", categoryId: "" });
        setShowForm(false);
      }
    } catch (err) {
      console.error("Failed to add source:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this news source?")) return;
    try {
      const res = await fetch(`/api/news-sources?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSources((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete source:", err);
    }
  };

  const handleToggle = async (id: string, active: boolean) => {
    try {
      const res = await fetch("/api/news-sources", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active: !active }),
      });
      if (res.ok) {
        setSources((prev) =>
          prev.map((s) => (s.id === id ? { ...s, active: !active } : s))
        );
      }
    } catch (err) {
      console.error("Failed to toggle source:", err);
    }
  };

  const handleDeduplicate = async () => {
    setDeduping(true);
    setDedupResult(null);
    try {
      const res = await fetch("/api/news-sources", { method: "PUT" });
      if (res.ok) {
        const data = await res.json();
        setDedupResult(data.message);
        await fetchSources();
      }
    } catch (err) {
      console.error("Failed to deduplicate:", err);
      setDedupResult("Failed to deduplicate");
    } finally {
      setDeduping(false);
    }
  };

  const handleRefreshAll = async () => {
    setRefreshing(true);
    try {
      await fetch("/api/news/refresh", { method: "POST" });
      await fetchSources();
    } catch (err) {
      console.error("Failed to refresh:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const inputClass =
    "w-full bg-[#0a0f1a] border border-[#374151] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition-colors";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">News Sources</h1>
          <p className="text-gray-400 text-sm mt-1">Manage RSS feed sources</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDeduplicate}
            disabled={deduping}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
          >
            {deduping ? "Deduplicating..." : "Deduplicate"}
          </button>
          <button
            onClick={handleRefreshAll}
            disabled={refreshing}
            className="px-4 py-2 bg-[#1f2937] hover:bg-[#374151] text-gray-300 text-sm rounded-lg transition-colors disabled:opacity-50"
          >
            {refreshing ? "Refreshing..." : "Refresh All Feeds"}
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            + Add Source
          </button>
        </div>
      </div>

      {dedupResult && (
        <div className="mb-4 px-4 py-2.5 bg-amber-900/30 border border-amber-700/40 rounded-lg text-sm text-amber-300">
          {dedupResult}
        </div>
      )}

      {showForm && (
        <div className="bg-[#111827] border border-[#374151] rounded-lg p-5 mb-6">
          <h3 className="text-sm font-medium text-white mb-4">New Source</h3>
          <form
            onSubmit={handleAdd}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-xs text-gray-500 mb-1">Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Source name"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Website URL
              </label>
              <input
                required
                type="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://example.com"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Feed URL
              </label>
              <input
                required
                type="url"
                value={form.feedUrl}
                onChange={(e) => setForm({ ...form, feedUrl: e.target.value })}
                placeholder="https://example.com/rss"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Category
              </label>
              <select
                value={form.categoryId}
                onChange={(e) =>
                  setForm({ ...form, categoryId: e.target.value })
                }
                className={inputClass}
              >
                <option value="">No category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? "Adding..." : "Add Source"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-[#111827] border border-[#374151] rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            Loading sources...
          </div>
        ) : sources.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No news sources configured
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#374151]">
                <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3">
                  Source
                </th>
                <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3">
                  Feed URL
                </th>
                <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3">
                  Category
                </th>
                <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3">
                  Active
                </th>
                <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3">
                  Last Fetched
                </th>
                <th className="text-right text-xs text-gray-500 uppercase tracking-wider px-5 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#374151]">
              {sources.map((source) => (
                <tr key={source.id} className="hover:bg-white/[0.02]">
                  <td className="px-5 py-3">
                    <p className="text-sm text-white">{source.name}</p>
                    <p className="text-xs text-gray-600 truncate max-w-[200px]">
                      {source.url}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-500 truncate max-w-[200px]">
                    {source.feedUrl}
                  </td>
                  <td className="px-5 py-3">
                    {source.category ? (
                      <span className="text-xs text-gray-400 bg-[#1f2937] px-2 py-0.5 rounded">
                        {source.category.name}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-600">&mdash;</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => handleToggle(source.id, source.active)}
                      className={`relative w-10 h-5 rounded-full transition-colors ${
                        source.active ? "bg-green-600" : "bg-gray-700"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                          source.active ? "translate-x-5" : ""
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-500">
                    {source.lastFetched
                      ? new Date(source.lastFetched).toLocaleString()
                      : "Never"}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => handleDelete(source.id)}
                      className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
