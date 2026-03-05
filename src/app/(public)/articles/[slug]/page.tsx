import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ArticleCard from "@/components/content/ArticleCard";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
    select: { title: true, excerpt: true, featuredImage: true },
  });

  if (!article) return { title: "Article Not Found | Dude.Box" };

  return {
    title: `${article.title} | Dude.Box`,
    description: article.excerpt ?? undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
      images: article.featuredImage ? [article.featuredImage] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
    take: 50,
  });
  return articles.map((a) => ({ slug: a.slug }));
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      category: true,
      author: { select: { name: true, image: true } },
      tags: { include: { tag: true } },
    },
  });

  if (!article || article.status !== "PUBLISHED") notFound();

  const relatedArticles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      categoryId: article.categoryId,
      id: { not: article.id },
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
    include: { category: true },
  });

  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      {/* Hero Image */}
      {article.featuredImage && (
        <div className="relative w-full h-[40vh] md:h-[50vh]">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/60 to-transparent" />
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <article
          className={
            article.featuredImage ? "-mt-32 relative z-10" : "pt-12"
          }
        >
          {/* Header */}
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Link
                href={`/${article.category.slug}`}
                className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-tactical-500/90 text-white rounded hover:bg-tactical-600 transition-colors"
              >
                {article.category.name}
              </Link>
              {article.readingTime && (
                <span className="text-xs text-gray-500">
                  {article.readingTime} min read
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="mt-4 text-lg text-gray-400 leading-relaxed">
                {article.excerpt}
              </p>
            )}

            <div className="mt-6 flex items-center gap-4 pb-6 border-b border-panel-border">
              {article.author.image && (
                <Image
                  src={article.author.image}
                  alt={article.author.name ?? "Author"}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div>
                {article.author.name && (
                  <p className="text-sm font-medium text-white">
                    {article.author.name}
                  </p>
                )}
                {article.publishedAt && (
                  <time className="text-xs text-gray-500">
                    {formatDate(new Date(article.publishedAt))}
                  </time>
                )}
              </div>
            </div>
          </header>

          {/* Body */}
          <div
            className="prose prose-invert prose-lg max-w-none
              prose-headings:text-white prose-headings:font-bold
              prose-a:text-tactical-400 prose-a:no-underline hover:prose-a:text-tactical-300
              prose-strong:text-white
              prose-code:text-tactical-300 prose-code:bg-panel-light prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-blockquote:border-tactical-500 prose-blockquote:text-gray-400
              prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-panel-border">
              <div className="flex flex-wrap gap-2">
                {article.tags.map(({ tag }) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 text-xs font-medium text-gray-400 bg-panel-light rounded-full border border-panel-border"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Source */}
          {article.sourceUrl && (
            <div className="mt-6">
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-tactical-400 hover:text-tactical-300 transition-colors"
              >
                View Original Source →
              </a>
            </div>
          )}
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-16 pb-16">
            <h2 className="text-xl font-bold text-white mb-6">
              Related <span className="text-tactical-500">Articles</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <ArticleCard
                  key={related.id}
                  title={related.title}
                  slug={related.slug}
                  excerpt={related.excerpt}
                  featuredImage={related.featuredImage}
                  categoryName={related.category.name}
                  categorySlug={related.category.slug}
                  publishedAt={related.publishedAt}
                  readingTime={related.readingTime}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
