"use client";

import { useState } from "react";

interface RefreshResult {
  message: string;
  results?: { source: string; count: number }[];
  processed?: number;
  curated?: number;
  count?: number;
  error?: string;
}

export default function NewsRefreshPage() {
  const [rssStatus, setRssStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [curateStatus, setCurateStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [rssResult, setRssResult] = useState<RefreshResult | null>(null);
  const [curateResult, setCurateResult] = useState<RefreshResult | null>(null);
  const [allStatus, setAllStatus] = useState<"idle" | "loading" | "done">("idle");
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);

  const refreshRSS = async () => {
    setRssStatus("loading");
    setRssResult(null);
    try {
      const res = await fetch("/api/news/refresh", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setRssResult(data);
      setRssStatus("done");
      setLastRefresh(new Date().toLocaleTimeString());
      return data;
    } catch (err) {
      setRssResult({ message: "Error", error: (err as Error).message });
      setRssStatus("error");
      return null;
    }
  };

  const runCuration = async () => {
    setCurateStatus("loading");
    setCurateResult(null);
    try {
      const res = await fetch("/api/news/curate", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setCurateResult(data);
      setCurateStatus("done");
      return data;
    } catch (err) {
      setCurateResult({ message: "Error", error: (err as Error).message });
      setCurateStatus("error");
      return null;
    }
  };

  const refreshAll = async () => {
    setAllStatus("loading");
    await refreshRSS();
    await runCuration();
    setAllStatus("done");
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">News Refresh</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manually trigger RSS feed ingestion and AI curation pipeline.
        </p>
        {lastRefresh && (
          <p className="text-xs text-gray-600 mt-2 font-mono">
            Last refresh: {lastRefresh}
          </p>
        )}
      </div>

      {/* Quick action */}
      <div className="mb-8 p-6 bg-[#111827] rounded-xl border border-[#1e293b]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Refresh All</h2>
            <p className="text-xs text-gray-500 mt-1">
              Fetch all RSS feeds, then run AI curation on the results.
            </p>
          </div>
          <button
            onClick={refreshAll}
            disabled={allStatus === "loading"}
            className="px-5 py-2.5 bg-green-600 hover:bg-green-500 disabled:bg-green-800 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            {allStatus === "loading" ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Running...
              </>
            ) : (
              "Refresh All"
            )}
          </button>
        </div>
        {allStatus === "done" && (
          <p className="mt-3 text-xs text-green-400 font-mono">Pipeline complete.</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* RSS Refresh */}
        <div className="p-6 bg-[#111827] rounded-xl border border-[#1e293b]">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
            Step 1: Refresh RSS
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Fetch latest items from all configured RSS sources.
          </p>
          <button
            onClick={refreshRSS}
            disabled={rssStatus === "loading"}
            className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {rssStatus === "loading" ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Fetching...
              </>
            ) : (
              "Refresh RSS Feeds"
            )}
          </button>

          {rssResult && (
            <div className={`mt-4 p-3 rounded-lg text-xs font-mono ${rssStatus === "error" ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"}`}>
              <p className="font-semibold mb-1">{rssResult.message}</p>
              {rssResult.results && (
                <div className="space-y-0.5 mt-2 max-h-40 overflow-y-auto">
                  {rssResult.results.map((r, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="truncate mr-2">{r.source}</span>
                      <span className="shrink-0">{r.count} items</span>
                    </div>
                  ))}
                </div>
              )}
              {rssResult.error && <p className="text-red-400">{rssResult.error}</p>}
            </div>
          )}
        </div>

        {/* AI Curation */}
        <div className="p-6 bg-[#111827] rounded-xl border border-[#1e293b]">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
            Step 2: AI Curation
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Run Claude AI to summarize and categorize recent feed items.
          </p>
          <button
            onClick={runCuration}
            disabled={curateStatus === "loading"}
            className="w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {curateStatus === "loading" ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Curating...
              </>
            ) : (
              "Run AI Curation"
            )}
          </button>

          {curateResult && (
            <div className={`mt-4 p-3 rounded-lg text-xs font-mono ${curateStatus === "error" ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"}`}>
              <p className="font-semibold mb-1">{curateResult.message}</p>
              {curateResult.processed !== undefined && (
                <p>Processed: {curateResult.processed} items</p>
              )}
              {curateResult.curated !== undefined && (
                <p>Curated: {curateResult.curated} new items</p>
              )}
              {curateResult.count === 0 && (
                <p>No feed items available to curate. Run RSS refresh first.</p>
              )}
              {curateResult.error && <p className="text-red-400">{curateResult.error}</p>}
            </div>
          )}
        </div>
      </div>

      {/* Auto-refresh note */}
      <div className="mt-8 p-4 bg-[#0d1321] rounded-xl border border-[#1e293b]/50 text-xs text-gray-500">
        <p className="font-semibold text-gray-400 mb-1">Auto-refresh</p>
        <p>
          The news page automatically triggers a background RSS refresh when the newest feed item
          is older than 1 hour. For Vercel cron automation, set a <code className="text-gray-400">CRON_SECRET</code> env
          variable and configure a cron job to hit <code className="text-gray-400">POST /api/news/refresh</code> and{" "}
          <code className="text-gray-400">POST /api/news/curate</code> with the{" "}
          <code className="text-gray-400">x-cron-secret</code> header.
        </p>
      </div>
    </div>
  );
}
