import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";

export const dynamic = 'force-dynamic';

// GET - Get current cart
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const cookieStore = await cookies();
    let sessionId = cookieStore.get("cart_session_id")?.value;

    let cart;

    if (session?.user?.email) {
      // Logged in user - get cart by user_id
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (user) {
        cart = await prisma.cart.findFirst({
          where: { user_id: user.id },
          include: {
            items: {
              include: {
                product: true,
                store: true,
              },
            },
          },
        });
      }
    } else if (sessionId) {
      // Guest - get cart by session_id
      cart = await prisma.cart.findUnique({
        where: { session_id: sessionId },
        include: {
          items: {
            include: {
              product: true,
              store: true,
            },
          },
        },
      });
    }

    return NextResponse.json({ cart: cart || null });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

// POST - Add item to cart
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const cookieStore = await cookies();
    let sessionId = cookieStore.get("cart_session_id")?.value;

    const body = await request.json();
    const { productId, quantity } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID required" },
        { status: 400 }
      );
    }

    // Get product to find store_id
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.active) {
      return NextResponse.json(
        { error: "Product not found or inactive" },
        { status: 404 }
      );
    }

    let cart;
    let userId = null;

    if (session?.user?.email) {
      // Logged in user
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      userId = user.id;

      // Find or create cart
      cart = await prisma.cart.findFirst({
        where: { user_id: userId },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: { user_id: userId },
        });
      }
    } else {
      // Guest user
      if (!sessionId) {
        sessionId = randomUUID();
        cookieStore.set("cart_session_id", sessionId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 30, // 30 days
        });
      }

      // Find or create cart
      cart = await prisma.cart.findUnique({
        where: { session_id: sessionId },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: { session_id: sessionId },
        });
      }
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cart_id: cart.id,
        product_id: productId,
      },
    });

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + (quantity || 1) },
      });
    } else {
      // Add new item
      await prisma.cartItem.create({
        data: {
          cart_id: cart.id,
          product_id: productId,
          store_id: product.store_id!,
          quantity: quantity || 1,
        },
      });
    }

    // Return updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: true,
            store: true,
          },
        },
      },
    });

    return NextResponse.json({ cart: updatedCart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}

// DELETE - Remove item from cart
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("itemId");

    if (!itemId) {
      return NextResponse.json(
        { error: "Item ID required" },
        { status: 400 }
      );
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      { error: "Failed to remove from cart" },
      { status: 500 }
    );
  }
}
