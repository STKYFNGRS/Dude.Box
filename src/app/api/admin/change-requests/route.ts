import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin";

export const dynamic = 'force-dynamic';

/**
 * GET - List all change requests (with filters)
 */
export async function GET(request: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "pending";
    const changeType = searchParams.get("change_type");
    const storeId = searchParams.get("store_id");
    const severity = searchParams.get("severity");

    // Build where clause
    const where: {
      status?: string;
      change_type?: string;
      store_id?: string;
      moderation_severity?: string;
    } = {};

    if (status && status !== "all") {
      where.status = status;
    }
    if (changeType) {
      where.change_type = changeType;
    }
    if (storeId) {
      where.store_id = storeId;
    }
    if (severity && severity !== "all") {
      where.moderation_severity = severity;
    }

    const changeRequests = await prisma.storeChangeRequest.findMany({
      where,
      include: {
        store: {
          select: {
            id: true,
            name: true,
            subdomain: true,
            contact_email: true,
            owner: {
              select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
              },
            },
          },
        },
        reviewer: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
          },
        },
      },
      orderBy: [
        { status: "asc" }, // pending first
        { moderation_severity: "desc" }, // severe first within status
        { created_at: "asc" }, // oldest first
      ],
      take: 100, // Limit to 100 for performance
    });

    // Get counts for different statuses
    const counts = await prisma.storeChangeRequest.groupBy({
      by: ["status"],
      _count: true,
    });

    const statusCounts = counts.reduce((acc, item) => {
      acc[item.status] = item._count;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      changeRequests,
      counts: statusCounts,
      total: changeRequests.length,
    });
  } catch (error) {
    console.error("Error fetching change requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch change requests" },
      { status: 500 }
    );
  }
}
