import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { conflictZoneSchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status");
    const region = searchParams.get("region");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (region) where.region = { contains: region, mode: "insensitive" };

    const zones = await prisma.conflictZone.findMany({
      where,
      include: {
        _count: { select: { events: true } },
      },
      orderBy: { lastUpdated: "desc" },
    });

    return NextResponse.json(zones);
  } catch (error) {
    console.error("Failed to fetch conflict zones:", error);
    return NextResponse.json(
      { error: "Failed to fetch conflict zones" },
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
    if ((session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = conflictZoneSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const zone = await prisma.conflictZone.create({
      data: parsed.data,
      include: { _count: { select: { events: true } } },
    });

    return NextResponse.json(zone, { status: 201 });
  } catch (error) {
    console.error("Failed to create conflict zone:", error);
    return NextResponse.json(
      { error: "Failed to create conflict zone" },
      { status: 500 }
    );
  }
}
