import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin";
import { applyChangeRequest, rejectChangeRequest } from "@/lib/change-requests";

export const dynamic = 'force-dynamic';

/**
 * POST - Approve or reject a change request
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { action, rejection_reason } = body;

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { error: 'Action must be "approve" or "reject"' },
        { status: 400 }
      );
    }

    const changeRequest = await prisma.storeChangeRequest.findUnique({
      where: { id },
      include: {
        store: {
          select: {
            name: true,
            subdomain: true,
            contact_email: true,
            owner: {
              select: {
                email: true,
                first_name: true,
              },
            },
          },
        },
      },
    });

    if (!changeRequest) {
      return NextResponse.json(
        { error: "Change request not found" },
        { status: 404 }
      );
    }

    if (changeRequest.status !== "pending") {
      return NextResponse.json(
        { error: `Change request is already ${changeRequest.status}` },
        { status: 400 }
      );
    }

    if (action === "approve") {
      await applyChangeRequest(id, admin.id);
      
      console.log(`✅ Admin ${admin.email} approved change request ${id}`);
      
      return NextResponse.json({
        success: true,
        message: "Change request approved and applied",
        changeRequest,
      });
    } else {
      await rejectChangeRequest(id, admin.id, rejection_reason);
      
      console.log(`❌ Admin ${admin.email} rejected change request ${id}`);
      
      return NextResponse.json({
        success: true,
        message: "Change request rejected",
        changeRequest,
      });
    }
  } catch (error) {
    console.error("Error reviewing change request:", error);
    return NextResponse.json(
      { error: "Failed to review change request" },
      { status: 500 }
    );
  }
}
