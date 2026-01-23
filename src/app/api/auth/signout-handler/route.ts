import { NextResponse } from "next/server";

export async function POST() {
  try {
    // When user signs out, delete the cart cookie
    // This forces a new guest cart to be created on next visit
    // Note: We can't "unassociate" a Shopify cart from a customer once linked
    // The only way to get a guest checkout is to use a new cart
    
    const response = NextResponse.json({ success: true });
    
    // Delete the cart cookie
    response.cookies.delete("dudebox_cart");
    
    return response;
  } catch (error) {
    console.error("Error clearing cart cookie:", error);
    // Don't fail signout if cart clear fails
    return NextResponse.json({ success: true });
  }
}
