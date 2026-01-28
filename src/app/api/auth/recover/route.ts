import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";

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

    // NOTE: For production, you should store the reset token in the database
    // and verify it on the reset password page. For now, we're sending the
    // token directly in the email. Consider adding reset_token and
    // reset_token_expiry fields to the User model for enhanced security.
    
    console.log(`Password reset requested for: ${user.email}`);
    console.log(`Reset token generated, expires at: ${expiresAt.toISOString()}`);

    // Send password reset email
    try {
      await sendPasswordResetEmail({
        to: user.email,
        resetToken,
        customerId: user.id,
      });
      console.log(`✅ Password reset email sent to ${user.email}`);
    } catch (error) {
      console.error("Failed to send password reset email:", error);
      // Don't reveal email sending failures to prevent user enumeration
    }

    return NextResponse.json({ 
      success: true,
      // For development only - helps with testing
      ...(process.env.NODE_ENV === 'development' && { 
        _dev_token: resetToken,
        _dev_reset_url: `/portal/reset-password?token=${resetToken}&id=${user.id}`
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
