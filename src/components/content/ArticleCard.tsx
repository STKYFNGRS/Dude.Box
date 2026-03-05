"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Newspaper } from "lucide-react";

interface ArticleCardProps {
  title: string;
  slug: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  categoryName?: string;
  categorySlug?: string;
  publishedAt?: Date | null;
  readingTime?: number | null;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export default function ArticleCard({
  title,
  slug,
  excerpt,
  featuredImage,
  categoryName,
  publishedAt,
  readingTime,
}: ArticleCardProps) {
  return (
    <Link
      href={`/articles/${slug}`}
      className="group block glass-card overflow-hidden"
    >
      <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-panel-light to-[var(--panel)]">
        {featuredImage ? (
          <Image
            src={featuredImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
        {categoryName && (
          <span className="text-[10px] font-semibold uppercase tracking-widest text-tactical-400">
            {categoryName}
          </span>
        )}
        <h3 className="mt-1 text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-tactical-300 transition-colors">
          {title}
        </h3>
        {excerpt && (
          <p className="mt-2 text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {excerpt}
          </p>
        )}
        <div className="mt-3 flex items-center gap-3 text-[10px] text-gray-600">
          {publishedAt && <time>{formatDate(new Date(publishedAt))}</time>}
          {readingTime && (
            <span className="flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              {readingTime} min
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
