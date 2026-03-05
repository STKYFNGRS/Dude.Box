"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import FloatingChat from "@/components/chat/FloatingChat";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Layers,
  Radio,
  Newspaper,
  Clock,
  ArrowRight,
  AlertTriangle,
  TrendingUp,
  X,
  RefreshCw,
  Zap,
  Shield,
  DollarSign,
  Cpu,
  Leaf,
  Users,
  Filter,
} from "lucide-react";
import type { MapMarker } from "@/components/maps/types";

const DynamicFlatMap = dynamic(() => import("@/components/maps/FlatMap"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-tactical-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-gray-600 font-mono">Loading Map...</span>
      </div>
    </div>
  ),
});

interface ConflictZone {
  id: string; name: string; lat: number; lng: number;
  region: string; countryCode: string | null;
  status: string; severity: string; conflictType: string;
}
interface ConflictEvent {
  id: string; title: string; description: string | null;
  date: string; lat: number; lng: number;
  severity: string; eventType: string;
}
interface NewsItem {
  id: string; title: string; url: string;
  source: string; publishedAt: string;
}
interface CIIEntry { countryCode: string; score: number; }
interface CuratedItem {
  id: string; title: string; summary: string;
  originalUrl: string; sourceName: string;
  region: string; topic: string; importance: number;
  curatedAt: string;
}
interface ArticleItem {
  id: string; title: string; slug: string;
  excerpt: string | null; featuredImage: string | null;
  publishedAt: string | null; readingTime: number | null;
  category: { name: string; slug: string };
}

interface LiveFeed {
  name: string; description: string;
  videoId?: string; embedUrl?: string;
}

const LIVE_FEEDS: LiveFeed[] = [
  { name: "BBC News", videoId: "jUFAhdeNab4", description: "24/7 live coverage from the BBC World Service." },
  { name: "Al Jazeera English", videoId: "gCNeDWCI0vo", description: "International news from the Middle East and around the globe." },
  { name: "PBS NewsHour", videoId: "3D2MMlSqX5U", description: "In-depth news analysis and reporting from PBS." },
  { name: "AP Live", videoId: "LRVLH07nQ48", description: "Breaking news from the Associated Press." },
  { name: "ABC News", videoId: "eCRKedOcXbs", description: "24/7 news, context and analysis from ABC News." },
  { name: "NBC News NOW", videoId: "3GRQf3tHEJk", description: "24/7 live news coverage from NBC News." },
  { name: "Euronews", videoId: "pykpO5kQJ98", description: "European and world news from a continental perspective." },
  { name: "CNA", videoId: "XWq5kBlakcQ", description: "24/7 breaking news and documentaries from Channel News Asia." },
  { name: "i24NEWS", videoId: "HykmOgUvbV4", description: "24/7 Israeli and international news in English." },
  { name: "India Today", videoId: "cj2EaznuJpE", description: "Live English news from India's leading news network." },
  { name: "Hindustan Times", videoId: "6vOhlJvIAFc", description: "Breaking news and analysis from Hindustan Times." },
  { name: "CGTN", videoId: "BOy2xDU1LC8", description: "China Global Television Network — English news, 24/7." },
  { name: "RT News", embedUrl: "https://rumble.com/embed/vtp5hp/?pub=4", description: "Russian perspective on international news via Rumble." },
];

const TOPIC_FILTERS = [
  { id: "all", label: "All", icon: Newspaper },
  { id: "Conflict", label: "Conflict", icon: AlertTriangle },
  { id: "Politics", label: "Politics", icon: Shield },
  { id: "Economics", label: "Economics", icon: DollarSign },
  { id: "Security", label: "Security", icon: Zap },
  { id: "Technology", label: "Tech", icon: Cpu },
  { id: "Environment", label: "Environment", icon: Leaf },
  { id: "Society", label: "Society", icon: Users },
] as const;

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function importanceBadge(level: number) {
  if (level >= 5) return { text: "CRITICAL", cls: "bg-red-500/10 text-red-400 border-red-500/20" };
  if (level >= 4) return { text: "HIGH", cls: "bg-orange-500/10 text-orange-400 border-orange-500/20" };
  if (level >= 3) return { text: "NOTABLE", cls: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" };
  return { text: "MONITOR", cls: "bg-green-500/10 text-green-400 border-green-500/20" };
}

const WORLD_CLOCKS = [
  { label: "DC", tz: "America/New_York" },
  { label: "LON", tz: "Europe/London" },
  { label: "TLV", tz: "Asia/Jerusalem" },
  { label: "BJ", tz: "Asia/Shanghai" },
  { label: "TOK", tz: "Asia/Tokyo" },
] as const;

function WorldClocks() {
  const [times, setTimes] = useState<string[]>([]);

  const getTimes = useCallback(() => {
    return WORLD_CLOCKS.map(({ tz }) =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: tz,
        hour12: false,
      }).format(new Date())
    );
  }, []);

  useEffect(() => {
    setTimes(getTimes());
    const interval = setInterval(() => setTimes(getTimes()), 1000);
    return () => clearInterval(interval);
  }, [getTimes]);

  if (times.length === 0) return null;

  return (
    <div className="flex items-center gap-3">
      {WORLD_CLOCKS.map(({ label }, i) => (
        <div key={label} className="flex items-center gap-1">
          <span className="text-xs font-semibold text-gray-200 uppercase">{label}</span>
          <span className="text-xs font-mono text-gray-200 tabular-nums">{times[i]}</span>
        </div>
      ))}
    </div>
  );
}

function AnimatedSection({
  children, className = "", delay = 0,
}: { children: React.ReactNode; className?: string; delay?: number; }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >{children}</motion.div>
  );
}

export default function NewsPage() {
  const [layersOpen, setLayersOpen] = useState(false);
  const [zones, setZones] = useState<ConflictZone[]>([]);
  const [events, setEvents] = useState<ConflictEvent[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [cii, setCii] = useState<CIIEntry[]>([]);
  const [curated, setCurated] = useState<CuratedItem[]>([]);
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTopic, setActiveTopic] = useState("all");
  const [showVideoSection, setShowVideoSection] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [zonesRes, eventsRes, newsRes, ciiRes, curatedRes, articlesRes] =
          await Promise.all([
            fetch("/api/conflicts/zones").then((r) => (r.ok ? r.json() : [])),
            fetch("/api/conflicts/events").then((r) => (r.ok ? r.json() : [])),
            fetch("/api/news/feed").then((r) => (r.ok ? r.json() : [])),
            fetch("/api/conflicts/cii").then((r) => (r.ok ? r.json() : [])),
            fetch("/api/news/curate").then((r) => (r.ok ? r.json() : [])),
            fetch("/api/articles?limit=9").then((r) => (r.ok ? r.json() : [])),
          ]);
        setZones(zonesRes);
        setEvents(eventsRes);
        setArticles(Array.isArray(articlesRes) ? articlesRes : []);
        setCurated(Array.isArray(curatedRes) ? curatedRes : []);

        const flattenedNews: NewsItem[] = (Array.isArray(newsRes) ? newsRes : []).map(
          (item: Record<string, unknown>) => ({
            id: item.id as string,
            title: item.title as string,
            url: item.url as string,
            source:
              typeof item.source === "string"
                ? item.source
                : (item.source as Record<string, string>)?.name ?? "Unknown",
            publishedAt: item.publishedAt as string,
          })
        );

        if (flattenedNews.length === 0) {
          fetch("/api/news/refresh", { method: "POST" })
            .then((r) => (r.ok ? r.json() : null))
            .then(() => fetch("/api/news/feed"))
            .then((r) => (r.ok ? r.json() : []))
            .then((retried: Record<string, unknown>[]) => {
              setNews(
                (retried || []).map((item) => ({
                  id: item.id as string,
                  title: item.title as string,
                  url: item.url as string,
                  source:
                    typeof item.source === "string"
                      ? item.source
                      : (item.source as Record<string, string>)?.name ?? "Unknown",
                  publishedAt: item.publishedAt as string,
                }))
              );
            })
            .catch(() => {});
        } else {
          setNews(flattenedNews);
        }

        setCii(
          Array.isArray(ciiRes)
            ? ciiRes
            : Object.entries(ciiRes).map(([k, v]: [string, unknown]) => ({
                countryCode: k,
                score: (v as Record<string, number>).score ?? (v as number),
              }))
        );

        // Lazy auto-refresh: if the newest feed item is older than 1 hour, re-fetch in background
        const allFeedDates = (flattenedNews as NewsItem[]).map((n) => new Date(n.publishedAt).getTime());
        const newest = allFeedDates.length > 0 ? Math.max(...allFeedDates) : 0;
        if (newest > 0 && Date.now() - newest > 3600000) {
          fetch("/api/news/refresh", { method: "POST" }).catch(() => {});
          fetch("/api/news/curate", { method: "POST" }).catch(() => {});
        }
      } catch {
        /* silently degrade */
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const markers: MapMarker[] = useMemo(() => {
    const zoneMarkers: MapMarker[] = zones.map((z) => ({
      lat: z.lat, lng: z.lng, label: z.name,
      severity: (["CRITICAL", "HIGH", "MEDIUM", "LOW"].includes(z.severity) ? z.severity : "MEDIUM") as MapMarker["severity"],
      type: z.conflictType,
    }));
    const eventMarkers: MapMarker[] = events.map((e) => ({
      lat: e.lat, lng: e.lng, label: e.title,
      severity: (["CRITICAL", "HIGH", "MEDIUM", "LOW"].includes(e.severity) ? e.severity : "LOW") as MapMarker["severity"],
      type: e.eventType,
    }));
    return [...zoneMarkers, ...eventMarkers];
  }, [zones, events]);

  const filteredCurated = useMemo(() => {
    if (activeTopic === "all") return curated;
    return curated.filter((item) => item.topic === activeTopic);
  }, [curated, activeTopic]);

  const sortedCii = useMemo(
    () => [...cii].sort((a, b) => b.score - a.score).slice(0, 10),
    [cii]
  );

  return (
    <div className="min-h-screen">
      {/* Compact news ticker */}
      {news.length > 0 && (
        <div className="relative w-full overflow-hidden bg-black/60 border-b border-red-500/10" style={{ boxShadow: "0 2px 12px rgba(239, 68, 68, 0.06)" }}>
          <div className="flex items-center">
            <span className="shrink-0 z-10 px-3 py-1.5 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
              </span>
              Live
            </span>
            <div className="overflow-hidden flex-1">
              <div className="flex animate-ticker whitespace-nowrap py-1.5">
                {[...news.slice(0, 8), ...news.slice(0, 8)].map((item, i) => (
                  <a
                    key={`${item.id}-${i}`}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 text-xs text-gray-200 hover:text-white transition-colors shrink-0"
                  >
                    <span className="w-1 h-1 rounded-full bg-red-500/60 shrink-0" />
                    <span className="max-w-[250px] truncate">{item.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conflict Map Section */}
      <section className="relative z-0 h-[55vh] flex border-b border-white/5">
        <div className="relative flex-1 flex flex-col min-w-0">
          {/* Map controls + World Clocks */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 glass-panel">
            <button
              onClick={() => setLayersOpen((p) => !p)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                layersOpen
                  ? "text-tactical-400 bg-tactical-500/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Layers
            </button>
            <div className="mx-2 w-px h-5 bg-white/5 hidden sm:block" />
            <div className="hidden sm:flex flex-1 justify-center">
              <WorldClocks />
            </div>
            <div className="flex items-center gap-2 text-[10px] text-gray-600 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-tactical-500 animate-pulse" />
              {zones.length} zones &middot; {events.length} events
            </div>
          </div>

          {/* Map */}
          <div className="relative flex-1 min-h-0 overflow-hidden">
            <AnimatePresence>
              {layersOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-2 left-4 z-30 w-52 glass-panel rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Layers</h4>
                    <button onClick={() => setLayersOpen(false)} className="text-gray-500 hover:text-white">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {["Conflicts", "Protests", "Military", "Disasters"].map((layer) => (
                    <label key={layer} className="flex items-center gap-2 py-1.5 cursor-pointer text-xs text-gray-400 hover:text-white transition-colors">
                      <input type="checkbox" defaultChecked className="rounded border-white/10 bg-white/5 text-tactical-500 focus:ring-tactical-600/50 w-3.5 h-3.5" />
                      {layer}
                    </label>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-2 border-tactical-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <DynamicFlatMap markers={markers} />
            )}
          </div>
        </div>

        {/* Intel Sidebar */}
        <aside className="w-80 min-w-[280px] border-l border-white/5 glass-panel overflow-hidden hidden lg:flex flex-col">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-6 h-6 border-2 border-tactical-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto">
                <div className="px-4 py-3 border-b border-white/5">
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Radio className="w-3 h-3 text-tactical-500" />
                    Intel Feed
                  </h3>
                </div>
                <div className="divide-y divide-white/5">
                  {news.length === 0 ? (
                    <div className="p-4 text-center text-xs text-gray-600">No recent intel</div>
                  ) : (
                    news.slice(0, 20).map((item) => (
                      <a
                        key={item.id}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2.5 hover:bg-white/[0.02] transition-colors group"
                      >
                        <p className="text-xs text-gray-400 group-hover:text-white transition-colors line-clamp-2 leading-relaxed">
                          {item.title}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-[10px] text-gray-600">
                          <span>{item.source}</span>
                          <span>&middot;</span>
                          <span>{timeAgo(item.publishedAt)}</span>
                        </div>
                      </a>
                    ))
                  )}
                </div>
              </div>
              {sortedCii.length > 0 && (
                <div className="border-t border-white/5">
                  <div className="px-4 py-3 border-b border-white/5">
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      <TrendingUp className="w-3 h-3 text-amber-500" />
                      CII Index
                    </h3>
                  </div>
                  <div className="max-h-44 overflow-y-auto divide-y divide-white/[0.03]">
                    {sortedCii.map((entry) => {
                      const color =
                        entry.score >= 75 ? "text-red-400" : entry.score >= 50 ? "text-orange-400" : entry.score >= 25 ? "text-yellow-400" : "text-green-400";
                      const barColor =
                        entry.score >= 75 ? "bg-red-500" : entry.score >= 50 ? "bg-orange-500" : entry.score >= 25 ? "bg-yellow-500" : "bg-green-500";
                      return (
                        <Link
                          key={entry.countryCode}
                          href={`/conflicts/brief/${entry.countryCode}`}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-white/[0.02] transition-colors"
                        >
                          <span className="text-[10px] font-mono font-bold text-gray-500 w-6">{entry.countryCode}</span>
                          <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                            <div className={`h-full rounded-full ${barColor}`} style={{ width: `${entry.score}%` }} />
                          </div>
                          <span className={`text-[10px] font-mono font-bold ${color} w-6 text-right`}>{entry.score}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </aside>
      </section>

      {/* AI-Curated News Feed */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <AnimatedSection>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                BRIEFING
                <span className="text-[10px] font-mono font-normal text-tactical-500 bg-tactical-500/10 px-2 py-0.5 rounded-full border border-tactical-500/20">
                  AI-CURATED
                </span>
              </h2>
              <div className="mt-2 h-0.5 w-12 bg-tactical-500/50 rounded-full" />
            </div>
          </div>
        </AnimatedSection>

        {/* Topic filters */}
        <AnimatedSection delay={0.1}>
          <div className="flex gap-1.5 mb-8 overflow-x-auto pb-2">
            {TOPIC_FILTERS.map((filter) => {
              const Icon = filter.icon;
              const isActive = activeTopic === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveTopic(filter.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors duration-200 ${
                    isActive
                      ? "text-white"
                      : "text-gray-600 hover:text-gray-300 hover:bg-white/5"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTopic"
                      className="absolute inset-0 rounded-lg bg-white/5 border border-white/10"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  <Icon className="relative z-10 w-3.5 h-3.5" />
                  <span className="relative z-10">{filter.label}</span>
                </button>
              );
            })}
          </div>
        </AnimatedSection>

        {/* Curated items */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTopic}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {filteredCurated.length > 0 ? (
              <div className="space-y-3">
                {filteredCurated.map((item, i) => {
                  const badge = importanceBadge(item.importance);
                  return (
                    <a
                      key={item.id}
                      href={item.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block glass-card p-5 hover:border-tactical-500/20"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className={`badge border text-[10px] ${badge.cls}`}>{badge.text}</span>
                            <span className="text-[10px] font-mono text-gray-600">{item.region}</span>
                            <span className="text-[10px] font-mono text-gray-700">&middot;</span>
                            <span className="text-[10px] font-mono text-gray-600">{item.topic}</span>
                          </div>
                          <h3 className="text-white font-semibold group-hover:text-tactical-400 transition-colors leading-snug">
                            {item.title}
                          </h3>
                          <p className="mt-1.5 text-sm text-gray-500 leading-relaxed line-clamp-2">
                            {item.summary}
                          </p>
                          <div className="mt-2 flex items-center gap-3 text-[10px] text-gray-600">
                            <span>{item.sourceName}</span>
                            <span>&middot;</span>
                            <span>{timeAgo(item.curatedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            ) : curated.length > 0 ? (
              <div className="glass-card p-12 text-center">
                <Filter className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No stories in this topic. Try another filter.</p>
              </div>
            ) : (
              <div className="glass-card p-12 text-center">
                <Newspaper className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  {news.length > 0
                    ? "AI curation available. Raw feed items shown in the intel sidebar."
                    : "News feed is loading. Check back shortly."}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      <div className="section-divider" />

      {/* Live Video Feeds */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <AnimatedSection>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
                </span>
                LIVE FEEDS
              </h2>
              <div className="mt-2 h-0.5 w-12 bg-red-500/50 rounded-full" />
            </div>
            <button
              onClick={() => setShowVideoSection(!showVideoSection)}
              className="text-xs text-gray-500 hover:text-white transition-colors"
            >
              {showVideoSection ? "Collapse" : "Expand All"}
            </button>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {LIVE_FEEDS.map((feed, i) => (
            <AnimatedSection key={feed.videoId ?? feed.name} delay={i * 0.05}>
              <div className="glass-card overflow-hidden group hover:border-red-500/20">
                <div className="relative aspect-video bg-black">
                  <iframe
                    src={feed.embedUrl ?? `https://www.youtube.com/embed/${feed.videoId}?autoplay=0&rel=0`}
                    title={`${feed.name} Live`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                    loading="lazy"
                  />
                </div>
                <div className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{feed.name}</h3>
                    <p className="text-[10px] text-gray-600 mt-0.5 line-clamp-1">{feed.description}</p>
                  </div>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                    Live
                  </span>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      {/* Latest Articles */}
      <section className="max-w-6xl mx-auto px-6 py-16 pb-24">
        <AnimatedSection>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold text-white tracking-tight">ARTICLES</h2>
              <div className="mt-2 h-0.5 w-12 bg-tactical-500/50 rounded-full" />
            </div>
          </div>
        </AnimatedSection>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((article, i) => (
              <AnimatedSection key={article.id} delay={i * 0.08}>
                <Link
                  href={`/articles/${article.slug}`}
                  className="group block glass-card overflow-hidden"
                >
                  <div className="relative h-44 bg-gradient-to-br from-panel-light to-[var(--panel)] overflow-hidden">
                    {article.featuredImage ? (
                      <Image
                        src={article.featuredImage}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Newspaper className="w-8 h-8 text-gray-800" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--panel)] via-transparent to-transparent" />
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-tactical-500">
                      {article.category.name}
                    </span>
                    <h3 className="mt-1 text-sm font-semibold text-white group-hover:text-tactical-300 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="mt-1.5 text-xs text-gray-500 line-clamp-2">{article.excerpt}</p>
                    )}
                    <div className="mt-3 flex items-center gap-3 text-[10px] text-gray-600">
                      {article.publishedAt && (
                        <span>
                          {new Date(article.publishedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                      {article.readingTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {article.readingTime} min
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <AnimatedSection>
            <div className="glass-card p-12 text-center">
              <Newspaper className="w-8 h-8 text-gray-700 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Articles will appear here once published.</p>
            </div>
          </AnimatedSection>
        )}
      </section>

      <FloatingChat />
    </div>
  );
}
