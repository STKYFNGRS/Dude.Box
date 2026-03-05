import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendPushNotification } from "@/lib/push";

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
    const { title, body: notifBody, url, userIds } = body as {
      title: string;
      body: string;
      url?: string;
      userIds?: string[];
    };

    if (!title || !notifBody) {
      return NextResponse.json(
        { error: "Title and body are required" },
        { status: 400 }
      );
    }

    const where: Record<string, unknown> = {};
    if (userIds?.length) {
      where.userId = { in: userIds };
    }

    const subscriptions = await prisma.pushSubscription.findMany({ where });

    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        const keys = JSON.parse(sub.keysJson) as {
          p256dh: string;
          auth: string;
        };
        const result = await sendPushNotification(
          { endpoint: sub.endpoint, keys },
          { title, body: notifBody, url }
        );

        if (result?.expired) {
          await prisma.pushSubscription.delete({ where: { id: sub.id } });
        }

        return { id: sub.id, expired: result?.expired ?? false };
      })
    );

    const sent = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return NextResponse.json({ sent, failed, total: subscriptions.length });
  } catch (error) {
    console.error("Failed to send push notifications:", error);
    return NextResponse.json(
      { error: "Failed to send notifications" },
      { status: 500 }
    );
  }
}
