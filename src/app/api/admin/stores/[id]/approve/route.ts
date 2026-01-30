import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { sendStoreApproved } from "@/lib/email";
import { provisionStoreSubdomain } from "@/lib/dns-provisioning";

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();

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

    // Automatically provision subdomain DNS and Vercel domain
    // This runs asynchronously and doesn't block the approval response
    provisionStoreSubdomain(store.subdomain)
      .then((result) => {
        if (result.success) {
          console.log(`✅ Subdomain provisioned for ${store.subdomain}`);
        } else {
          console.error(`⚠️ Subdomain provisioning failed for ${store.subdomain}:`, result);
        }
      })
      .catch((error) => {
        console.error(`❌ Error provisioning subdomain for ${store.subdomain}:`, error);
      });

    return NextResponse.json({ store });
  } catch (error) {
    console.error("Error approving store:", error);
    return NextResponse.json(
      { error: "Failed to approve store" },
      { status: 500 }
    );
  }
}
