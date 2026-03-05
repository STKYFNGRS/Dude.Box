"use client";

import { useState, useEffect, useCallback } from "react";

const CATEGORIES = [
  "Defense News",
  "Global Conflicts",
  "DIY & Projects",
  "Gear Reviews",
  "Tactical",
  "History",
];

interface GeneratedPreview {
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
}

interface Draft {
  id: string;
  prompt: string;
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  category: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminNotes?: string;
  createdAt: string;
}

function StatusBadge({ status }: { status: Draft["status"] }) {
  const styles: Record<Draft["status"], string> = {
    PENDING: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    APPROVED: "bg-green-500/20 text-green-400 border-green-500/30",
    REJECTED: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function DraftCard({
  draft,
  onApprove,
  onReject,
}: {
  draft: Draft;
  onApprove: (id: string) => void;
  onReject: (id: string, notes: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [rejectNotes, setRejectNotes] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  return (
    <div className="bg-[#111827] border border-gray-700/50 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-white font-semibold truncate">
              {draft.title}
            </h3>
            <p className="text-gray-400 text-sm mt-1 line-clamp-1">
              {draft.prompt}
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <span className="bg-gray-800 px-2 py-0.5 rounded">
                {draft.category}
              </span>
              <span>{new Date(draft.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <StatusBadge status={draft.status} />
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${expanded ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-700/50 p-4 space-y-4">
          <div>
            <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-1">
              Excerpt
            </h4>
            <p className="text-gray-300 text-sm">{draft.excerpt}</p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-1">
              Content
            </h4>
            <div className="text-gray-300 text-sm whitespace-pre-wrap max-h-64 overflow-y-auto bg-black/20 rounded p-3">
              {draft.content}
            </div>
          </div>
          {draft.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {draft.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-green-500/10 text-green-400 text-xs px-2 py-0.5 rounded border border-green-500/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {draft.status === "PENDING" && (
            <div className="flex items-center gap-3 pt-2 border-t border-gray-700/30">
              <button
                onClick={() => onApprove(draft.id)}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Approve
              </button>
              {!showRejectInput ? (
                <button
                  onClick={() => setShowRejectInput(true)}
                  className="px-4 py-2 bg-red-600/80 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Reject
                </button>
              ) : (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={rejectNotes}
                    onChange={(e) => setRejectNotes(e.target.value)}
                    placeholder="Rejection notes (optional)"
                    className="flex-1 bg-[#1f2937] border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-red-500/50"
                  />
                  <button
                    onClick={() => {
                      onReject(draft.id, rejectNotes);
                      setShowRejectInput(false);
                      setRejectNotes("");
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => {
                      setShowRejectInput(false);
                      setRejectNotes("");
                    }}
                    className="px-3 py-2 text-gray-400 hover:text-gray-200 text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AIStudioPage() {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [preview, setPreview] = useState<GeneratedPreview | null>(null);
  const [generateError, setGenerateError] = useState("");

  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [draftsLoading, setDraftsLoading] = useState(true);
  const [draftsError, setDraftsError] = useState("");

  const fetchDrafts = useCallback(async () => {
    setDraftsLoading(true);
    setDraftsError("");
    try {
      const res = await fetch("/api/ai/drafts");
      if (!res.ok) throw new Error("Failed to fetch drafts");
      const data = await res.json();
      setDrafts(data.drafts ?? data);
    } catch (err: unknown) {
      setDraftsError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setDraftsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrafts();
  }, [fetchDrafts]);

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setGenerating(true);
    setGenerateError("");
    setPreview(null);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, prompt }),
      });
      if (!res.ok) throw new Error("Generation failed");
      const data = await res.json();
      setPreview(data);
      fetchDrafts();
    } catch (err: unknown) {
      setGenerateError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setGenerating(false);
    }
  }

  async function handleApprove(id: string) {
    try {
      const res = await fetch("/api/ai/drafts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "APPROVED" }),
      });
      if (!res.ok) throw new Error("Approval failed");
      fetchDrafts();
    } catch {
      /* toast or inline error could go here */
    }
  }

  async function handleReject(id: string, adminNotes: string) {
    try {
      const res = await fetch("/api/ai/drafts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "REJECTED", adminNotes }),
      });
      if (!res.ok) throw new Error("Rejection failed");
      fetchDrafts();
    } catch {
      /* toast or inline error could go here */
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            AI Studio
          </h1>
          <p className="mt-1 text-gray-400">
            Generate and review AI-drafted articles
          </p>
        </div>

        {/* ── Generate Section ── */}
        <section className="bg-[#111827] border border-gray-700/50 rounded-xl p-6 space-y-5">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Generate Article
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#1f2937] border border-gray-600 rounded-lg px-3 py-2.5 text-gray-200 focus:outline-none focus:border-green-500/50 transition-colors"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Topic / Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder="Describe the article you want generated..."
              className="w-full bg-[#1f2937] border border-gray-600 rounded-lg px-3 py-2.5 text-gray-200 placeholder-gray-500 resize-none focus:outline-none focus:border-green-500/50 transition-colors"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleGenerate}
              disabled={generating || !prompt.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {generating && (
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              )}
              {generating ? "Generating..." : "Generate with AI"}
            </button>
            {generateError && (
              <p className="text-red-400 text-sm">{generateError}</p>
            )}
          </div>

          {/* Generated Preview */}
          {preview && (
            <div className="mt-4 border border-green-500/20 bg-green-500/5 rounded-lg p-5 space-y-3">
              <h3 className="text-green-400 text-xs uppercase tracking-wider font-semibold">
                Generated Preview
              </h3>
              <p className="text-white text-xl font-bold">{preview.title}</p>
              <p className="text-gray-300 text-sm">{preview.excerpt}</p>
              <div className="text-gray-400 text-sm whitespace-pre-wrap max-h-48 overflow-y-auto bg-black/20 rounded p-3">
                {preview.content}
              </div>
              {preview.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {preview.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-green-500/10 text-green-400 text-xs px-2 py-0.5 rounded border border-green-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* ── Review Queue ── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <svg
                className="w-5 h-5 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Review Queue
            </h2>
            <button
              onClick={fetchDrafts}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Refresh
            </button>
          </div>

          {draftsLoading && (
            <div className="flex justify-center py-12">
              <svg
                className="animate-spin h-6 w-6 text-green-500"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            </div>
          )}

          {draftsError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm">
              {draftsError}
            </div>
          )}

          {!draftsLoading && !draftsError && drafts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No drafts in the queue. Generate one above.
            </div>
          )}

          <div className="space-y-3">
            {drafts.map((draft) => (
              <DraftCard
                key={draft.id}
                draft={draft}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
