"use client";

import { useEffect, useState, useCallback } from "react";

interface CIIEntry {
  countryCode: string;
  name: string;
  score: number;
}

interface CIIPanelProps {
  onCountryClick?: (countryCode: string) => void;
  className?: string;
}

function scoreColor(score: number): string {
  if (score >= 70) return "#ef4444";
  if (score >= 50) return "#f97316";
  if (score >= 30) return "#eab308";
  return "#22c55e";
}

function scoreLabel(score: number): string {
  if (score >= 70) return "Critical";
  if (score >= 50) return "High";
  if (score >= 30) return "Elevated";
  return "Low";
}

export default function CIIPanel({ onCountryClick, className = "" }: CIIPanelProps) {
  const [data, setData] = useState<CIIEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCII = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/conflicts/cii");
      if (!res.ok) throw new Error(`${res.status}`);
      const json = await res.json();
      const sorted = (json.data ?? json ?? [])
        .slice()
        .sort((a: CIIEntry, b: CIIEntry) => b.score - a.score);
      setData(sorted);
    } catch (e: any) {
      setError(e.message ?? "Failed to load CII data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCII();
  }, [fetchCII]);

  return (
    <div className={`flex flex-col bg-panel/95 backdrop-blur border border-panel-border rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-panel-border">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">
          Country Instability Index
        </h2>
        <button
          onClick={fetchCII}
          disabled={loading}
          className="text-gray-500 hover:text-tactical-400 transition-colors disabled:opacity-40"
          title="Refresh"
        >
          <svg className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {loading && data.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-tactical-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="px-4 py-6 text-center">
            <p className="text-sm text-red-400">{error}</p>
            <button onClick={fetchCII} className="mt-2 text-xs text-tactical-500 hover:underline">
              Retry
            </button>
          </div>
        )}

        {!loading && !error && data.length === 0 && (
          <p className="text-gray-600 text-sm text-center py-8">No CII data available.</p>
        )}

        <div className="divide-y divide-panel-border/50">
          {data.map((entry) => {
            const color = scoreColor(entry.score);
            return (
              <button
                key={entry.countryCode}
                onClick={() => onCountryClick?.(entry.countryCode)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-panel-light/50 transition-colors text-left group"
              >
                <span className="shrink-0 w-8 text-xs font-mono font-bold text-gray-500 group-hover:text-gray-300">
                  {entry.countryCode}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-gray-300 truncate block">{entry.name}</span>
                  <div className="mt-1 h-1.5 w-full bg-panel-light rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(entry.score, 100)}%`,
                        backgroundColor: color,
                        boxShadow: `0 0 6px ${color}50`,
                      }}
                    />
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <span className="text-sm font-bold font-mono" style={{ color }}>
                    {entry.score}
                  </span>
                  <span className="block text-[10px] text-gray-600">{scoreLabel(entry.score)}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
