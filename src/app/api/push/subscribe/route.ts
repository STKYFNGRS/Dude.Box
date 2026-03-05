import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { endpoint, keys } = body as {
      endpoint: string;
      keys: { p256dh: string; auth: string };
    };

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json(
        { error: "Invalid push subscription data" },
        { status: 400 }
      );
    }

    const existing = await prisma.pushSubscription.findFirst({
      where: { userId: session.user.id!, endpoint },
    });

    if (existing) {
      await prisma.pushSubscription.update({
        where: { id: existing.id },
        data: { keysJson: JSON.stringify(keys) },
      });
      return NextResponse.json({ message: "Subscription updated" });
    }

    await prisma.pushSubscription.create({
      data: {
        userId: session.user.id!,
        endpoint,
        keysJson: JSON.stringify(keys),
      },
    });

    return NextResponse.json(
      { message: "Subscription saved" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to save push subscription:", error);
    return NextResponse.json(
      { error: "Failed to save subscription" },
      { status: 500 }
    );
  }
}
