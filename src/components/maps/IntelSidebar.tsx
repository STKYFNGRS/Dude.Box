"use client";

import { useState, useMemo } from "react";

type Region = "Global" | "Europe" | "MENA" | "Asia-Pacific" | "Americas" | "Africa";

export interface IntelNewsItem {
  id: string;
  title: string;
  source: string;
  url?: string;
  timestamp: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  region: Region;
}

interface IntelSidebarProps {
  newsItems?: IntelNewsItem[];
  className?: string;
}

const REGIONS: Region[] = ["Global", "Europe", "MENA", "Asia-Pacific", "Americas", "Africa"];

const SEVERITY_BADGE: Record<IntelNewsItem["severity"], string> = {
  CRITICAL: "bg-red-900/50 text-red-400 border-red-800",
  HIGH: "bg-orange-900/50 text-orange-400 border-orange-800",
  MEDIUM: "bg-yellow-900/50 text-yellow-400 border-yellow-800",
  LOW: "bg-green-900/50 text-green-400 border-green-800",
};

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function IntelSidebar({ newsItems = [], className = "" }: IntelSidebarProps) {
  const [activeRegion, setActiveRegion] = useState<Region>("Global");

  const filtered = useMemo(
    () =>
      activeRegion === "Global"
        ? newsItems
        : newsItems.filter((n) => n.region === activeRegion),
    [newsItems, activeRegion]
  );

  return (
    <aside
      className={`flex flex-col bg-panel/95 backdrop-blur border border-panel-border rounded-xl overflow-hidden w-80 ${className}`}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-panel-border">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
          <svg className="w-4 h-4 text-tactical-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Intel Feed
        </h2>
      </div>

      {/* Region Tabs */}
      <div className="flex gap-1 px-3 py-2 overflow-x-auto border-b border-panel-border scrollbar-thin">
        {REGIONS.map((r) => (
          <button
            key={r}
            onClick={() => setActiveRegion(r)}
            className={`shrink-0 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              activeRegion === r
                ? "bg-tactical-600 text-white"
                : "text-gray-500 hover:text-gray-300 hover:bg-panel-light"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* News List */}
      <div className="flex-1 overflow-y-auto divide-y divide-panel-border">
        {filtered.length === 0 && (
          <p className="text-gray-600 text-sm text-center py-8">No intel for this region.</p>
        )}
        {filtered.map((item) => {
          const isBreaking = item.severity === "CRITICAL" || item.severity === "HIGH";

          return (
            <a
              key={item.id}
              href={item.url ?? "#"}
              target={item.url ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="block px-4 py-3 hover:bg-panel-light/50 transition-colors group"
            >
              <div className="flex items-start gap-2 mb-1">
                {isBreaking && (
                  <span className="shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-red-600 text-white animate-pulse-slow">
                    Breaking
                  </span>
                )}
                <h3 className="text-sm font-medium text-gray-200 group-hover:text-tactical-400 transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[11px] text-gray-500">{item.source}</span>
                <span className="text-gray-700">·</span>
                <span className="text-[11px] text-gray-600">{timeAgo(item.timestamp)}</span>
                <span
                  className={`ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${SEVERITY_BADGE[item.severity]}`}
                >
                  {item.severity}
                </span>
              </div>
            </a>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-panel-border text-center">
        <span className="text-[11px] text-gray-600">{filtered.length} items</span>
      </div>
    </aside>
  );
}
