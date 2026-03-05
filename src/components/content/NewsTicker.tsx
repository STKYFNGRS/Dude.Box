"use client";

interface NewsTickerProps {
  headlines: { id: string; title: string; url: string; source?: string }[];
}

export default function NewsTicker({ headlines }: NewsTickerProps) {
  if (!headlines.length) return null;

  const doubled = [...headlines, ...headlines];

  return (
    <div className="relative w-full overflow-hidden border-b border-white/5 bg-[var(--panel)]">
      <div className="flex items-center">
        <span className="shrink-0 z-10 px-3 py-1.5 bg-tactical-600/80 text-white text-[10px] font-bold uppercase tracking-widest">
          Live
        </span>
        <div className="overflow-hidden flex-1">
          <div className="flex animate-ticker whitespace-nowrap py-1.5">
            {doubled.map((item, i) => (
              <a
                key={`${item.id}-${i}`}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 text-xs text-gray-400 hover:text-white transition-colors shrink-0"
              >
                <span className="w-1 h-1 rounded-full bg-tactical-500/60 shrink-0" />
                <span className="truncate max-w-[250px]">{item.title}</span>
                {item.source && (
                  <span className="text-[10px] text-gray-700">
                    {item.source}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
