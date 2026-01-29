import { NextResponse } from "next/server";
import { moderateContent } from "@/lib/ai-moderation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

// POST - Check content for violations
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      productId,
      storeId,
      productName,
      productDescription,
      storeName,
      storeDescription,
      customText,
    } = body;

    // Run AI moderation
    const result = await moderateContent({
      productName,
      productDescription,
      storeName,
      storeDescription,
      customText,
    });

    // Log moderation result
    await prisma.moderationLog.create({
      data: {
        product_id: productId || null,
        store_id: storeId || null,
        content_type: productId ? "product" : "store",
        is_violation: result.isViolation,
        severity: result.severity,
        categories: result.categories.join(", "),
        reason: result.reason,
        confidence: result.confidence,
        checked_at: new Date(),
      },
    });

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Moderation check error:", error);
    return NextResponse.json(
      { error: "Moderation check failed" },
      { status: 500 }
    );
  }
}
