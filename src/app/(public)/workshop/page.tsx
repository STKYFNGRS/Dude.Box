"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Wrench,
  Gamepad2,
  Backpack,
  Hammer,
  ArrowRight,
  Clock,
  Newspaper,
} from "lucide-react";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string | null;
  publishedAt: string | null;
  readingTime: number | null;
  category: { name: string; slug: string };
  tags?: { tag: { name: string } }[];
}

const TABS = [
  { id: "all", label: "All", icon: Wrench },
  { id: "gaming", label: "Gaming", icon: Gamepad2 },
  { id: "gear", label: "Gear", icon: Backpack },
  { id: "diy", label: "DIY & Projects", icon: Hammer },
] as const;

const SUB_SECTIONS = [
  {
    id: "gaming",
    title: "Gaming",
    icon: Gamepad2,
    description: "Tactical shooters, mil-sim, strategy, and honest reviews.",
    cards: [
      { title: "Tactical & Mil-Sim", sub: "Arma, Squad, Ready or Not" },
      { title: "Strategy & RTS", sub: "C&C, Hearts of Iron, Civilization" },
      { title: "Reviews & Picks", sub: "Honest takes on the latest" },
    ],
    gradient: "from-purple-500/10 to-transparent",
    accent: "text-purple-400",
    border: "border-purple-500/20",
  },
  {
    id: "gear",
    title: "Gear",
    icon: Backpack,
    description: "Honest reviews of tactical gear, EDC, tools, and equipment.",
    cards: [
      { title: "EDC", sub: "Everyday carry essentials" },
      { title: "Tools & Knives", sub: "Field-tested and reviewed" },
      { title: "Tech & Comms", sub: "Radios, optics, electronics" },
    ],
    gradient: "from-blue-500/10 to-transparent",
    accent: "text-blue-400",
    border: "border-blue-500/20",
  },
  {
    id: "diy",
    title: "DIY & Projects",
    icon: Hammer,
    description: "Hands-on builds, modifications, and project guides.",
    cards: [
      { title: "Workshop Builds", sub: "From blueprints to finished product" },
      { title: "Modifications", sub: "Upgrades and custom work" },
      { title: "Survival Prep", sub: "Practical readiness projects" },
    ],
    gradient: "from-amber-500/10 to-transparent",
    accent: "text-amber-400",
    border: "border-amber-500/20",
  },
];

function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function WorkshopPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/articles?limit=30&status=PUBLISHED")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setArticles(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = articles.filter((a) => {
    if (activeTab === "all") {
      return ["the-workshop", "gaming", "gear", "diy-projects"].includes(
        a.category.slug
      );
    }
    if (activeTab === "gaming") return a.category.slug === "gaming" || a.tags?.some((t) => t.tag.name.toLowerCase() === "gaming");
    if (activeTab === "gear") return a.category.slug === "gear" || a.tags?.some((t) => t.tag.name.toLowerCase() === "gear");
    if (activeTab === "diy") return a.category.slug === "diy-projects" || a.tags?.some((t) => t.tag.name.toLowerCase().includes("diy"));
    return true;
  });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-[var(--background)] to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px]" />

        <div className="relative max-w-6xl mx-auto px-6 py-20">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <Wrench className="w-7 h-7 text-amber-400" />
              </div>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-bold text-white tracking-tight">
              THE <span className="text-gradient-amber">WORKSHOP</span>
            </h1>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl leading-relaxed">
              Gaming, gear reviews, DIY builds, and hands-on projects. The place
              where you tinker, test, and create.
            </p>
        </div>
      </div>

      {/* Sub-sections */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SUB_SECTIONS.map((section, i) => {
            const Icon = section.icon;
            return (
              <AnimatedSection key={section.id} delay={i * 0.1}>
                <div
                  className={`glass-card p-6 border ${section.border} h-full`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${section.gradient} rounded-2xl`}
                  />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className={`w-5 h-5 ${section.accent}`} />
                      <h3 className="font-display text-xl font-bold text-white">
                        {section.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">
                      {section.description}
                    </p>
                    <div className="space-y-2">
                      {section.cards.map((card) => (
                        <div
                          key={card.title}
                          className="flex items-center gap-2 text-xs"
                        >
                          <div className="w-1 h-1 rounded-full bg-gray-600" />
                          <span className="text-gray-300 font-medium">
                            {card.title}
                          </span>
                          <span className="text-gray-600">{card.sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </section>

      {/* Tab filter + Articles */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <AnimatedSection>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl font-bold text-white tracking-tight">
              CONTENT
            </h2>
          </div>
        </AnimatedSection>

        {/* Tabs */}
        <AnimatedSection delay={0.1}>
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                    isActive
                      ? "text-white"
                      : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-xl bg-white/5 border border-white/10"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  <Icon className="relative z-10 w-4 h-4" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </AnimatedSection>

        {/* Article grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="glass-card h-80 animate-pulse"
                  />
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((article) => (
                  <Link
                    key={article.id}
                    href={`/articles/${article.slug}`}
                    className="group block glass-card overflow-hidden"
                  >
                    <div className="relative h-44 bg-gradient-to-br from-panel-light to-panel overflow-hidden">
                      {article.featuredImage ? (
                        <Image
                          src={article.featuredImage}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Newspaper className="w-8 h-8 text-gray-700" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--panel)] via-transparent to-transparent" />
                    </div>
                    <div className="p-5">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-400">
                        {article.category.name}
                      </span>
                      <h3 className="mt-1 text-white font-semibold leading-snug group-hover:text-amber-300 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                          {article.excerpt}
                        </p>
                      )}
                      <div className="mt-3 flex items-center gap-3 text-xs text-gray-600">
                        {article.publishedAt && (
                          <span>
                            {new Date(article.publishedAt).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" }
                            )}
                          </span>
                        )}
                        {article.readingTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {article.readingTime} min
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="glass-card p-16 text-center">
                <Wrench className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-300 mb-1">
                  The Workshop Awaits
                </h3>
                <p className="text-sm text-gray-600">
                  Content is being crafted. Check back soon for gear reviews,
                  gaming coverage, and DIY projects.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
}
