import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin";
import { sendStoreApproved } from "@/lib/email";

export const dynamic = 'force-dynamic';

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
    const store = await prisma.store.update({
      where: { id },
      data: {
        status: "approved",
        approved_at: new Date(),
        approved_by: admin.id,
      },
      include: {
        owner: true,
      },
    });

    // Send approval email to store owner
    try {
      await sendStoreApproved({
        to: store.owner.email,
        vendorName: store.owner.first_name || "Vendor",
        storeName: store.name,
        subdomain: store.subdomain,
      });
    } catch (error) {
      console.error("Failed to send approval email:", error);
      // Don't fail the approval if email fails
    }

    return NextResponse.json({ store });
  } catch (error) {
    console.error("Error approving store:", error);
    return NextResponse.json(
      { error: "Failed to approve store" },
      { status: 500 }
    );
  }
}
