import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Always return success for security (don't reveal if email exists)
    // This prevents user enumeration attacks
    if (!user) {
      return NextResponse.json({ success: true });
    }

    // Generate secure reset token (32 bytes = 256 bits)
    const resetToken = crypto.randomBytes(32).toString("hex");
    
    // Token expires in 1 hour
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // TODO: Store reset token in database
    // This requires adding reset_token and reset_token_expiry fields to User model
    // For now, we're just generating the token
    // In Phase 7 (Email Notifications), we'll:
    // 1. Add reset_token fields to schema
    // 2. Store the token in database
    // 3. Send reset email with token link
    
    console.log(`Password reset requested for: ${user.email}`);
    console.log(`Reset token (for testing): ${resetToken}`);
    console.log(`Expires at: ${expiresAt.toISOString()}`);
    console.log(`Reset URL would be: ${process.env.NEXTAUTH_URL}/portal/reset-password?token=${resetToken}`);

    return NextResponse.json({ 
      success: true,
      // TODO: Remove this in production - only for testing without email
      ...(process.env.NODE_ENV === 'development' && { 
        _dev_token: resetToken,
        _dev_reset_url: `/portal/reset-password?token=${resetToken}`
      })
    });
  } catch (error) {
    console.error("Password recovery error:", error);
    return NextResponse.json(
      { error: "Unable to process request. Please try again." },
      { status: 500 }
    );
  }
}
