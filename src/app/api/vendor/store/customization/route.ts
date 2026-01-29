import { NextResponse } from "next/server";
import { getVendorStore } from "@/lib/vendor";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const store = await getVendorStore();
    if (!store) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const updated = await prisma.store.update({
      where: { id: store.id },
      data: {
        custom_colors_enabled: data.custom_colors_enabled,
        primary_color: data.primary_color,
        secondary_color: data.secondary_color,
        background_color: data.background_color,
        text_color: data.text_color,
        custom_text: data.custom_text,
      },
    });

    return NextResponse.json({ store: updated });
  } catch (error) {
    console.error("Error updating store customization:", error);
    return NextResponse.json(
      { error: "Failed to update customization" },
      { status: 500 }
    );
  }
}
