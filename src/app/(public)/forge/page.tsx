"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import {
  Flame,
  Swords,
  BookOpen,
  Brain,
  Heart,
  Clock,
  Newspaper,
  ArrowRight,
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

const PILLARS = [
  {
    id: "tactical",
    icon: Swords,
    title: "Tactical",
    subtitle: "Strategy & Preparedness",
    description:
      "Tactics, training methodologies, fieldcraft, and the warrior mindset. Sharpen your edge.",
    gradient: "from-emerald-500/10 to-transparent",
    border: "border-emerald-500/20 hover:border-emerald-500/40",
    iconColor: "text-emerald-400",
  },
  {
    id: "history",
    icon: BookOpen,
    title: "History",
    subtitle: "Lessons from the Past",
    description:
      "Military history, decisive battles, legendary commanders, and the campaigns that shaped the world.",
    gradient: "from-amber-500/10 to-transparent",
    border: "border-amber-500/20 hover:border-amber-500/40",
    iconColor: "text-amber-400",
  },
  {
    id: "philosophy",
    icon: Brain,
    title: "Philosophy",
    subtitle: "The Strategy of Mind",
    description:
      "Stoicism, leadership thinking, Sun Tzu to Marcus Aurelius. Ideas that forge resilience and clarity.",
    gradient: "from-sky-500/10 to-transparent",
    border: "border-sky-500/20 hover:border-sky-500/40",
    iconColor: "text-sky-400",
  },
  {
    id: "faith",
    icon: Heart,
    title: "Faith & Morality",
    subtitle: "The Warrior's Compass",
    description:
      "Faith traditions, moral frameworks, chaplain perspectives, and the spiritual dimension of service.",
    gradient: "from-violet-500/10 to-transparent",
    border: "border-violet-500/20 hover:border-violet-500/40",
    iconColor: "text-violet-400",
  },
];

const QUOTES = [
  {
    text: "The more you sweat in training, the less you bleed in combat.",
    author: "Richard Marcinko",
  },
  {
    text: "In the midst of chaos, there is also opportunity.",
    author: "Sun Tzu",
  },
  {
    text: "We suffer more often in imagination than in reality.",
    author: "Seneca",
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

export default function ForgePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [quoteIndex] = useState(() => Math.floor(Math.random() * QUOTES.length));

  useEffect(() => {
    fetch("/api/articles?limit=9&status=PUBLISHED")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setArticles(
            data.filter(
              (a: Article) => a.category.slug === "the-forge"
            )
          );
        }
      })
      .catch(() => {});
  }, []);

  const quote = QUOTES[quoteIndex];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 mb-6">
              <Flame className="w-8 h-8 text-orange-400" />
            </div>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight">
              THE{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500">
                FORGE
              </span>
            </h1>
            <p className="mt-5 text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Where steel meets soul. A thinking man&apos;s corner for tactical
              strategy, military history, timeless philosophy, and matters of
              faith.
            </p>
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-600">
              {PILLARS.map((p) => {
                const Icon = p.icon;
                return (
                  <span key={p.id} className="flex items-center gap-1.5">
                    <Icon className={`w-4 h-4 ${p.iconColor}`} />
                    <span>{p.title}</span>
                  </span>
                );
              })}
            </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Four Pillars */}
        <section className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PILLARS.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <AnimatedSection key={pillar.id} delay={i * 0.1}>
                  <div
                    className={`glass-card p-6 border ${pillar.border}`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${pillar.gradient} rounded-2xl`}
                    />
                    <div className="relative z-10 flex items-start gap-4">
                      <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/5 border border-white/5 shrink-0">
                        <Icon className={`w-5 h-5 ${pillar.iconColor}`} />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold text-white">
                          {pillar.title}
                        </h3>
                        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mt-0.5">
                          {pillar.subtitle}
                        </p>
                        <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                          {pillar.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </section>

        {/* Quote */}
        <AnimatedSection>
          <section className="mb-16">
            <div className="glass-card p-10 md:p-14 text-center">
              <blockquote className="text-xl md:text-2xl font-medium text-gray-200 italic leading-relaxed max-w-3xl mx-auto">
                &ldquo;{quote.text}&rdquo;
              </blockquote>
              <cite className="mt-4 block text-sm text-gray-600 not-italic">
                &mdash; {quote.author}
              </cite>
            </div>
          </section>
        </AnimatedSection>

        <div className="section-divider mb-16" />

        {/* Articles */}
        <section className="pb-24">
          <AnimatedSection>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display text-3xl font-bold text-white tracking-tight">
                  FROM THE FORGE
                </h2>
                <div className="mt-2 h-0.5 w-12 bg-orange-500/50 rounded-full" />
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
                          <Flame className="w-8 h-8 text-gray-800" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--panel)] via-transparent to-transparent" />
                    </div>
                    <div className="p-4">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-orange-400">
                        The Forge
                      </span>
                      <h3 className="mt-1 text-sm font-semibold text-white group-hover:text-orange-300 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="mt-1.5 text-xs text-gray-500 line-clamp-2">
                          {article.excerpt}
                        </p>
                      )}
                      <div className="mt-3 flex items-center gap-3 text-[10px] text-gray-600">
                        {article.publishedAt && (
                          <span>
                            {new Date(
                              article.publishedAt
                            ).toLocaleDateString("en-US", {
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
              <div className="glass-card p-16 text-center">
                <Flame className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-300 mb-1">
                  The Forge Awaits
                </h3>
                <p className="text-sm text-gray-600">
                  Content on tactics, history, philosophy, and faith will be
                  forged here soon. Iron sharpens iron.
                </p>
              </div>
            </AnimatedSection>
          )}
        </section>
      </div>
    </div>
  );
}
