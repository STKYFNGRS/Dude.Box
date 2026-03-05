import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      article: {
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featuredImage: true,
          publishedAt: true,
          category: { select: { name: true, slug: true } },
        },
      },
    },
  });

  return NextResponse.json({ bookmarks });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { articleId } = await req.json();
  if (!articleId || typeof articleId !== "string") {
    return NextResponse.json(
      { error: "articleId is required" },
      { status: 400 },
    );
  }

  const article = await prisma.article.findUnique({
    where: { id: articleId },
  });
  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  const bookmark = await prisma.bookmark.upsert({
    where: {
      userId_articleId: {
        userId: session.user.id,
        articleId,
      },
    },
    update: {},
    create: {
      userId: session.user.id,
      articleId,
    },
  });

  return NextResponse.json({ bookmark }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { articleId } = await req.json();
  if (!articleId || typeof articleId !== "string") {
    return NextResponse.json(
      { error: "articleId is required" },
      { status: 400 },
    );
  }

  await prisma.bookmark.deleteMany({
    where: {
      userId: session.user.id,
      articleId,
    },
  });

  return NextResponse.json({ success: true });
}
