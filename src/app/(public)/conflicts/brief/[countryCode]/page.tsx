"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { COUNTRY_NAMES } from "@/lib/conflict-data";

interface BriefData {
  countryCode: string;
  ciiScore: number;
  breakdown: {
    conflictIntensity: number;
    eventDensity: number;
    unrestScore: number;
    newsVelocity: number;
  };
  aiSummary: string | null;
  headlines: { title: string; url: string; publishedAt: string }[];
  events: {
    id: string;
    title: string;
    date: string;
    severity: string;
    eventType: string;
  }[];
}

/* ---------- CII donut gauge ---------- */
function CIIGauge({ score }: { score: number }) {
  const radius = 60;
  const stroke = 10;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color =
    score >= 75
      ? "#ef4444"
      : score >= 50
        ? "#f97316"
        : score >= 25
          ? "#eab308"
          : "#22c55e";

  return (
    <div className="relative flex items-center justify-center">
      <svg width={150} height={150} className="-rotate-90">
        <circle
          cx={75}
          cy={75}
          r={radius}
          fill="none"
          stroke="#1f2937"
          strokeWidth={stroke}
        />
        <circle
          cx={75}
          cy={75}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-white">{score}</span>
        <span className="text-xs text-gray-400 uppercase tracking-wider">
          CII
        </span>
      </div>
    </div>
  );
}

/* ---------- breakdown bar ---------- */
function BreakdownBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-white font-mono">{value}</span>
      </div>
      <div className="w-full h-2 rounded-full bg-panel-light overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

/* ---------- event timeline ---------- */
function EventTimeline({
  events,
}: {
  events: BriefData["events"];
}) {
  const severityDot: Record<string, string> = {
    CRITICAL: "bg-red-500",
    HIGH: "bg-orange-500",
    MEDIUM: "bg-yellow-500",
    LOW: "bg-green-500",
  };

  return (
    <div className="relative pl-6 space-y-4">
      <div className="absolute left-2 top-1 bottom-1 w-px bg-panel-border" />
      {events.map((ev) => (
        <div key={ev.id} className="relative">
          <div
            className={`absolute left-[-18px] top-1.5 w-3 h-3 rounded-full border-2 border-[#0a0f1a] ${severityDot[ev.severity] || "bg-gray-500"}`}
          />
          <div>
            <p className="text-sm text-white leading-snug">{ev.title}</p>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
              <span>{new Date(ev.date).toLocaleDateString()}</span>
              <span className="uppercase">{ev.eventType}</span>
            </div>
          </div>
        </div>
      ))}
      {events.length === 0 && (
        <p className="text-sm text-gray-500">No recent events on record.</p>
      )}
    </div>
  );
}

/* ---------- main page ---------- */
export default function CountryBriefPage() {
  const params = useParams<{ countryCode: string }>();
  const code = params.countryCode?.toUpperCase() ?? "";
  const countryInfo = COUNTRY_NAMES[code];
  const country = countryInfo
    ? { name: countryInfo.name, flag: countryInfo.flag }
    : { name: code, flag: "" };

  const [brief, setBrief] = useState<BriefData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;
    setLoading(true);
    fetch(`/api/conflicts/brief/${code}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load brief");
        return r.json();
      })
      .then(setBrief)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-tactical-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading intelligence brief…</p>
        </div>
      </div>
    );
  }

  if (error || !brief) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">
            {error ?? "No brief data available"}
          </p>
          <Link
            href="/news"
            className="btn-secondary text-sm"
          >
            &larr; Back to News
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/news"
            className="text-sm text-tactical-500 hover:text-tactical-400 transition-colors"
          >
            &larr; News &amp; Conflict Map
          </Link>
        </div>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-5xl">{country.flag}</span>
          <div>
            <h1 className="text-3xl font-bold text-white">{country.name}</h1>
            <p className="text-gray-400 text-sm mt-1">
              Intelligence Brief — {code}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CII Score card */}
          <div className="card p-6 flex flex-col items-center">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
              Conflict Instability Index
            </h2>
            <CIIGauge score={brief.ciiScore} />
            <div className="w-full mt-6 space-y-3">
              <BreakdownBar
                label="Conflict Intensity"
                value={brief.breakdown.conflictIntensity}
                color="bg-red-500"
              />
              <BreakdownBar
                label="Event Density"
                value={brief.breakdown.eventDensity}
                color="bg-amber-500"
              />
              <BreakdownBar
                label="Unrest Score"
                value={brief.breakdown.unrestScore}
                color="bg-orange-500"
              />
              <BreakdownBar
                label="News Velocity"
                value={brief.breakdown.newsVelocity}
                color="bg-blue-500"
              />
            </div>
          </div>

          {/* AI Analysis + Headlines */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Analysis */}
            {brief.aiSummary && (
              <div className="card p-6">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-tactical-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                  </svg>
                  AI Analysis
                </h2>
                <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {brief.aiSummary}
                </div>
              </div>
            )}

            {/* Top Headlines */}
            <div className="card p-6">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                Top Headlines
              </h2>
              {brief.headlines.length > 0 ? (
                <ul className="space-y-3">
                  {brief.headlines.map((h, i) => (
                    <li key={i}>
                      <a
                        href={h.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-3"
                      >
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-tactical-500 shrink-0" />
                        <div>
                          <p className="text-sm text-gray-300 group-hover:text-white transition-colors leading-snug">
                            {h.title}
                          </p>
                          {h.publishedAt && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {new Date(h.publishedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                            </p>
                          )}
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">
                  No headlines available.
                </p>
              )}
            </div>

            {/* Event Timeline */}
            <div className="card p-6">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                Event Timeline
              </h2>
              <EventTimeline events={brief.events} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
