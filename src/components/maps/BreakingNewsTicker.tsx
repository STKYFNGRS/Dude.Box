"use client";

export interface TickerItem {
  id: string;
  text: string;
  url?: string;
  severity?: "CRITICAL" | "HIGH";
}

interface BreakingNewsTickerProps {
  items?: TickerItem[];
  className?: string;
}

export default function BreakingNewsTicker({ items = [], className = "" }: BreakingNewsTickerProps) {
  if (items.length === 0) return null;

  const doubled = [...items, ...items];

  return (
    <div
      className={`relative w-full overflow-hidden bg-gradient-to-r from-red-950/90 via-red-900/80 to-amber-950/90 border-b border-red-800/40 ${className}`}
    >
      <div className="flex items-center">
        {/* BREAKING label */}
        <span className="shrink-0 z-10 flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white text-xs font-extrabold uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse-slow" />
          Breaking
        </span>

        {/* Scrolling content */}
        <div className="overflow-hidden flex-1">
          <div className="flex animate-ticker whitespace-nowrap py-2">
            {doubled.map((item, i) => (
              <span key={`${item.id}-${i}`} className="inline-flex items-center gap-3 px-6 shrink-0">
                <span className="w-1 h-1 rounded-full bg-red-500 shrink-0" />
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-200 hover:text-amber-400 transition-colors"
                  >
                    {item.text}
                  </a>
                ) : (
                  <span className="text-sm text-gray-200">{item.text}</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
