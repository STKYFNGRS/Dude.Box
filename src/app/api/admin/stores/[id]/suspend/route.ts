import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const store = await prisma.store.update({
      where: { id: params.id },
      data: {
        status: "suspended",
      },
      include: {
        owner: true,
      },
    });

    // TODO: Send suspension notification email to store owner

    return NextResponse.json({ store });
  } catch (error) {
    console.error("Error suspending store:", error);
    return NextResponse.json(
      { error: "Failed to suspend store" },
      { status: 500 }
    );
  }
}
