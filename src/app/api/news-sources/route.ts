import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const sources = await prisma.newsSource.findMany({
      include: { category: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(sources);
  } catch (error) {
    console.error("Failed to fetch news sources:", error);
    return NextResponse.json(
      { error: "Failed to fetch news sources" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { name, url, feedUrl, categoryId } = await request.json();

    if (!name || !url || !feedUrl) {
      return NextResponse.json(
        { error: "name, url, and feedUrl are required" },
        { status: 400 }
      );
    }

    const source = await prisma.newsSource.create({
      data: {
        name,
        url,
        feedUrl,
        categoryId: categoryId || null,
      },
      include: { category: { select: { id: true, name: true } } },
    });

    return NextResponse.json(source, { status: 201 });
  } catch (error) {
    console.error("Failed to create news source:", error);
    return NextResponse.json(
      { error: "Failed to create news source" },
      { status: 500 }
    );
  }
}

export async function PUT() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const all = await prisma.newsSource.findMany({
      orderBy: { createdAt: "asc" },
    });

    const seen = new Map<string, string>();
    const toDelete: string[] = [];

    for (const src of all) {
      const key = src.feedUrl;
      if (seen.has(key)) {
        toDelete.push(src.id);
      } else {
        seen.set(key, src.id);
      }
    }

    if (toDelete.length > 0) {
      await prisma.newsSource.deleteMany({
        where: { id: { in: toDelete } },
      });
    }

    return NextResponse.json({
      message: `Removed ${toDelete.length} duplicate source(s)`,
      removed: toDelete.length,
    });
  } catch (error) {
    console.error("Failed to deduplicate sources:", error);
    return NextResponse.json(
      { error: "Failed to deduplicate" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id, active } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const source = await prisma.newsSource.update({
      where: { id },
      data: { active },
      include: { category: { select: { id: true, name: true } } },
    });

    return NextResponse.json(source);
  } catch (error) {
    console.error("Failed to update news source:", error);
    return NextResponse.json(
      { error: "Failed to update news source" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = request.nextUrl;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await prisma.newsSource.delete({ where: { id } });

    return NextResponse.json({ message: "Source deleted" });
  } catch (error) {
    console.error("Failed to delete news source:", error);
    return NextResponse.json(
      { error: "Failed to delete news source" },
      { status: 500 }
    );
  }
}
