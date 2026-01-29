import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireVendor } from "@/lib/vendor";

export const dynamic = 'force-dynamic';

// PATCH - Update store settings
export async function PATCH(request: Request) {
  try {
    const store = await requireVendor();
    const body = await request.json();
    const {
      name,
      description,
      contact_email,
      shipping_policy,
      return_policy,
      logo_url,
      banner_url,
    } = body;

    const updatedStore = await prisma.store.update({
      where: { id: store.id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(contact_email !== undefined && { contact_email }),
        ...(shipping_policy !== undefined && { shipping_policy }),
        ...(return_policy !== undefined && { return_policy }),
        ...(logo_url !== undefined && { logo_url }),
        ...(banner_url !== undefined && { banner_url }),
      },
    });

    return NextResponse.json({ store: updatedStore });
  } catch (error) {
    console.error("Error updating store:", error);
    return NextResponse.json(
      { error: "Failed to update store" },
      { status: 500 }
    );
  }
}
