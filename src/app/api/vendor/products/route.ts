import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireVendor } from "@/lib/vendor";

export const dynamic = 'force-dynamic';

// GET - List vendor's products
export async function GET() {
  try {
    const store = await requireVendor();

    const products = await prisma.product.findMany({
      where: { store_id: store.id },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Unauthorized or failed to fetch products" },
      { status: 401 }
    );
  }
}

// POST - Create new product
export async function POST(request: Request) {
  try {
    const store = await requireVendor();
    const body = await request.json();
    const { name, description, price, interval, active } = body;

    if (!name || !price) {
      return NextResponse.json(
        { error: "Name and price are required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price,
        interval: interval || "one_time",
        active: active !== undefined ? active : true,
        store_id: store.id,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
