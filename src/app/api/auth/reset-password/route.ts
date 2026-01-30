import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { verifyPasswordResetToken, markTokenAsUsed } from "@/lib/password-reset";

export async function POST(request: Request) {
  try {
    const { resetToken, customerId, password } = await request.json();

    // Validate required fields
    if (!password || !resetToken) {
      return NextResponse.json(
        { error: "Invalid reset request." },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    // Verify reset token from database
    const email = await verifyPasswordResetToken(resetToken);
    
    if (!email) {
      return NextResponse.json(
        { error: "Invalid or expired reset link. Please request a new password reset." },
        { status: 400 }
      );
    }

    // Find user by email from verified token
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    // Verify customerId matches if provided (for backward compatibility)
    if (customerId && user.id !== customerId) {
      return NextResponse.json(
        { error: "Invalid reset request." },
        { status: 400 }
      );
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 10);

    // Update user's password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password_hash: passwordHash,
        updated_at: new Date(),
      },
    });

    // Mark token as used to prevent reuse
    await markTokenAsUsed(resetToken);

    console.log(`✅ Password reset successful for: ${user.email}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Password reset error:", error);
    return NextResponse.json(
      { error: "Unable to reset password. Please try again." },
      { status: 500 }
    );
  }
}
