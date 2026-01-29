import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin";

export const dynamic = 'force-dynamic';

// PATCH - Update announcement (admin only)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, excerpt, published } = body;

    const announcement = await prisma.announcement.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(excerpt !== undefined && { excerpt }),
        ...(published !== undefined && { published }),
      },
    });

    return NextResponse.json({ announcement });
  } catch (error) {
    console.error("Error updating announcement:", error);
    return NextResponse.json(
      { error: "Failed to update announcement" },
      { status: 500 }
    );
  }
}

// DELETE - Delete announcement (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.announcement.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return NextResponse.json(
      { error: "Failed to delete announcement" },
      { status: 500 }
    );
  }
}
