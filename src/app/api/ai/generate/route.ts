import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { aiGenerateSchema } from "@/lib/validation";
import { generateArticle } from "@/lib/claude";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if ((session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = aiGenerateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { prompt, categoryId } = parsed.data;

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const generated = await generateArticle(prompt, category.name);

    const draft = await prisma.aIDraft.create({
      data: {
        prompt,
        generatedTitle: generated.title,
        generatedContent: generated.content,
        generatedExcerpt: generated.excerpt,
        categoryId,
        status: "PENDING_REVIEW",
      },
      include: { category: true },
    });

    return NextResponse.json(draft, { status: 201 });
  } catch (error) {
    console.error("Failed to generate AI content:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
