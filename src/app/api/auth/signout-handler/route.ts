import { NextResponse } from "next/server";

export async function POST() {
  try {
    // When user signs out, clear any session-related cookies
    const response = NextResponse.json({ success: true });
    
    // Delete the cart cookie if it exists (legacy)
    response.cookies.delete("dudebox_cart");
    
    return response;
  } catch (error) {
    console.error("Error clearing cart cookie:", error);
    // Don't fail signout if cart clear fails
    return NextResponse.json({ success: true });
  }
}
