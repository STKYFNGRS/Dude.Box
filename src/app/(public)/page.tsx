"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  Newspaper,
  Wrench,
  Flame,
  ChevronDown,
  ArrowRight,
  Clock,
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
}

const CATEGORIES = [
  {
    name: "News",
    slug: "news",
    icon: Newspaper,
    description:
      "Live AI-curated global news, conflict tracking, and real-time video feeds from around the world.",
    gradient: "from-tactical-500/20 via-tactical-600/10 to-transparent",
    border: "border-tactical-500/20 hover:border-tactical-500/40",
    iconColor: "text-tactical-400",
    glow: "group-hover:shadow-glow",
  },
  {
    name: "The Workshop",
    slug: "workshop",
    icon: Wrench,
    description:
      "Gaming, gear reviews, DIY builds, and hands-on projects. The place to tinker, test, and create.",
    gradient: "from-amber-500/20 via-amber-600/10 to-transparent",
    border: "border-amber-500/20 hover:border-amber-500/40",
    iconColor: "text-amber-400",
    glow: "group-hover:shadow-glow-amber",
  },
  {
    name: "The Forge",
    slug: "forge",
    icon: Flame,
    description:
      "Tactical strategy, military history, timeless philosophy, and matters of faith. A thinking man's corner.",
    gradient: "from-orange-500/20 via-red-600/10 to-transparent",
    border: "border-orange-500/20 hover:border-orange-500/40",
    iconColor: "text-orange-400",
    glow: "group-hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]",
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
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  useEffect(() => {
    fetch("/api/articles?limit=6")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setArticles(data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <motion.div
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Animated gradient mesh */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-tactical-950/80 via-[var(--background)] to-steel-950/60" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-tactical-500/5 rounded-full blur-[120px] animate-float" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-steel-500/5 rounded-full blur-[100px] animate-float [animation-delay:2s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-tactical-500/3 rounded-full blur-[150px]" />
        </div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-white leading-none">
              DUDE
              <span className="text-gradient-green">.BOX</span>
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Global intelligence. Hands-on builds. Deep thinking.
            <br className="hidden sm:block" />
            Everything a man needs in one tactical hub.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-10 flex items-center justify-center gap-4"
          >
            <Link
              href="/news"
              className="btn-primary text-base px-8 py-3 rounded-xl flex items-center gap-2 group"
            >
              Enter the Feed
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-6 h-6 text-gray-600" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Categories */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight">
                EXPLORE
              </h2>
              <div className="mt-2 h-1 w-16 mx-auto bg-gradient-to-r from-tactical-500 to-tactical-400 rounded-full" />
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CATEGORIES.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <AnimatedSection key={cat.slug} delay={i * 0.15}>
                  <Link
                    href={`/${cat.slug}`}
                    className={`group block glass-card p-8 h-full border ${cat.border} ${cat.glow} transition-all duration-500`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/5">
                          <Icon className={`w-6 h-6 ${cat.iconColor}`} />
                        </div>
                        <h3 className="font-display text-2xl font-bold text-white tracking-wide">
                          {cat.name}
                        </h3>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {cat.description}
                      </p>
                      <div className="mt-6 flex items-center gap-2 text-sm font-medium text-gray-500 group-hover:text-gray-300 transition-colors">
                        <span>Explore</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Content */}
      <section className="relative py-24 px-6">
        <div className="section-divider mb-24" />
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  LATEST
                </h2>
                <div className="mt-2 h-0.5 w-12 bg-tactical-500/50 rounded-full" />
              </div>
              <Link
                href="/news"
                className="text-sm text-gray-500 hover:text-tactical-400 transition-colors flex items-center gap-1"
              >
                View all
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </AnimatedSection>

          {articles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, i) => (
                <AnimatedSection key={article.id} delay={i * 0.1}>
                  <Link
                    href={`/articles/${article.slug}`}
                    className="group block glass-card overflow-hidden"
                  >
                    <div className="relative h-48 bg-gradient-to-br from-panel-light to-panel overflow-hidden">
                      {article.featuredImage ? (
                        <Image
                          src={article.featuredImage}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                            <Newspaper className="w-6 h-6 text-gray-700" />
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--panel)] via-transparent to-transparent" />
                    </div>
                    <div className="p-5">
                      {article.category && (
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-tactical-400">
                          {article.category.name}
                        </span>
                      )}
                      <h3 className="mt-1 text-white font-semibold leading-snug group-hover:text-tactical-300 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                          {article.excerpt}
                        </p>
                      )}
                      <div className="mt-4 flex items-center gap-3 text-xs text-gray-600">
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
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <AnimatedSection>
              <div className="glass-card p-16 text-center">
                <p className="text-gray-600 text-sm">
                  Content is being curated. Check back soon.
                </p>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>
    </div>
  );
}
