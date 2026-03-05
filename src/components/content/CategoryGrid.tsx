"use client";

import Link from "next/link";
import { Newspaper, Wrench, Flame } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface CategoryDef {
  name: string;
  slug: string;
  icon: LucideIcon;
  description: string;
  iconColor: string;
  border: string;
}

const categories: CategoryDef[] = [
  {
    name: "News",
    slug: "news",
    icon: Newspaper,
    description: "Live AI-curated global news, conflict tracking & real-time coverage",
    iconColor: "text-tactical-400",
    border: "border-tactical-500/20 hover:border-tactical-500/40",
  },
  {
    name: "The Workshop",
    slug: "workshop",
    icon: Wrench,
    description: "Gaming, gear reviews, DIY builds & hands-on projects",
    iconColor: "text-amber-400",
    border: "border-amber-500/20 hover:border-amber-500/40",
  },
  {
    name: "The Forge",
    slug: "forge",
    icon: Flame,
    description: "Tactical strategy, military history, philosophy & faith",
    iconColor: "text-orange-400",
    border: "border-orange-500/20 hover:border-orange-500/40",
  },
];

interface CategoryGridProps {
  counts?: Record<string, number>;
}

export default function CategoryGrid({ counts }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {categories.map((cat) => {
        const Icon = cat.icon;
        return (
          <Link
            key={cat.slug}
            href={`/${cat.slug}`}
            className={`group glass-card p-6 border ${cat.border} transition-all duration-500`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5">
                <Icon className={`w-5 h-5 ${cat.iconColor}`} />
              </div>
              <h3 className="font-display text-xl font-bold text-white">
                {cat.name}
              </h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {cat.description}
            </p>
            {counts?.[cat.slug] !== undefined && (
              <span className="mt-3 inline-block text-xs font-mono text-gray-500">
                {counts[cat.slug]} articles
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
