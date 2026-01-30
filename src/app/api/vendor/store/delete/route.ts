import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireVendor } from "@/lib/vendor";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

// DELETE - Vendor deletes their own store
export async function DELETE() {
  try {
    const store = await requireVendor();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user to update their role
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete all products first (cascade deletes cart items and order items)
    await prisma.product.deleteMany({
      where: { store_id: store.id },
    });

    // Delete the store
    await prisma.store.delete({
      where: { id: store.id },
    });

    // Downgrade user role from vendor to customer
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "customer" },
    });

    console.log(`✅ Store ${store.name} (${store.subdomain}) deleted by owner`);

    return NextResponse.json({ 
      success: true,
      message: "Store deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting store:", error);
    return NextResponse.json(
      { error: "Failed to delete store" },
      { status: 500 }
    );
  }
}
