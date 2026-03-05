"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface FeaturedHeroProps {
  title: string;
  slug: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  categoryName?: string;
  publishedAt?: Date | null;
}

export default function FeaturedHero({
  title,
  slug,
  excerpt,
  featuredImage,
  categoryName,
}: FeaturedHeroProps) {
  return (
    <Link
      href={`/articles/${slug}`}
      className="group relative block w-full rounded-2xl overflow-hidden aspect-[21/9] min-h-[320px]"
    >
      {featuredImage ? (
        <Image
          src={featuredImage}
          alt={title}
          fill
          priority
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-tactical-900/50 via-[var(--background)] to-steel-950/50" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
        {categoryName && (
          <span className="inline-block px-2.5 py-1 mb-3 text-[10px] font-bold uppercase tracking-widest bg-tactical-500/20 text-tactical-400 rounded-lg border border-tactical-500/30">
            {categoryName}
          </span>
        )}
        <h1 className="text-2xl md:text-4xl font-display font-bold text-white leading-tight max-w-3xl group-hover:text-tactical-300 transition-colors">
          {title}
        </h1>
        {excerpt && (
          <p className="mt-3 text-sm md:text-base text-gray-400 max-w-2xl line-clamp-2">
            {excerpt}
          </p>
        )}
        <span className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-tactical-400 group-hover:text-tactical-300 transition-colors">
          Read More
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
