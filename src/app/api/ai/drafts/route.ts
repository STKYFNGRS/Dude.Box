import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if ((session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const drafts = await prisma.aIDraft.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(drafts);
  } catch (error) {
    console.error("Failed to fetch drafts:", error);
    return NextResponse.json(
      { error: "Failed to fetch drafts" },
      { status: 500 }
    );
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if ((session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { id, action, adminNotes } = body as {
      id: string;
      action: "approve" | "reject";
      adminNotes?: string;
    };

    if (!id || !action) {
      return NextResponse.json(
        { error: "Missing id or action" },
        { status: 400 }
      );
    }

    const draft = await prisma.aIDraft.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!draft) {
      return NextResponse.json({ error: "Draft not found" }, { status: 404 });
    }

    if (draft.status !== "PENDING_REVIEW") {
      return NextResponse.json(
        { error: "Draft has already been reviewed" },
        { status: 400 }
      );
    }

    if (action === "reject") {
      const updated = await prisma.aIDraft.update({
        where: { id },
        data: {
          status: "REJECTED",
          adminNotes,
          reviewedAt: new Date(),
        },
        include: { category: true },
      });
      return NextResponse.json(updated);
    }

    const title = draft.generatedTitle || "Untitled AI Article";
    let slug = slugify(title);
    const existingArticle = await prisma.article.findUnique({
      where: { slug },
    });
    if (existingArticle) {
      slug = `${slug}-${Date.now()}`;
    }

    const [article, updatedDraft] = await prisma.$transaction([
      prisma.article.create({
        data: {
          title,
          slug,
          content: draft.generatedContent,
          excerpt: draft.generatedExcerpt,
          categoryId: draft.categoryId!,
          authorId: session.user.id!,
          status: "REVIEW",
        },
      }),
      prisma.aIDraft.update({
        where: { id },
        data: {
          status: "APPROVED",
          adminNotes,
          reviewedAt: new Date(),
        },
        include: { category: true },
      }),
    ]);

    return NextResponse.json({ draft: updatedDraft, article });
  } catch (error) {
    console.error("Failed to update draft:", error);
    return NextResponse.json(
      { error: "Failed to update draft" },
      { status: 500 }
    );
  }
}
