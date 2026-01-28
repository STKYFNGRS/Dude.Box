import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { resetToken, customerId, password } = await request.json();

    // Validate required fields
    if (!customerId || !password) {
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

    // Validate reset token is provided
    if (!resetToken) {
      return NextResponse.json(
        { error: "Invalid reset link." },
        { status: 400 }
      );
    }

    // Find user by ID
    const user = await prisma.user.findUnique({
      where: { id: customerId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid reset request." },
        { status: 400 }
      );
    }

    // TODO: Verify reset token from database
    // This requires adding reset_token and reset_token_expiry fields to User model
    // For now, we're accepting the token from the email link
    // In a future phase, we should:
    // 1. Add reset_token and reset_token_expiry fields to User schema
    // 2. Verify token matches and hasn't expired
    // 3. Invalidate token after successful reset
    // 
    // Current flow:
    // 1. User requests password reset (sends email with token)
    // 2. Token is generated and sent via email link
    // 3. User clicks link with token in URL
    // 4. This endpoint accepts the token and resets password
    //
    // Security note: In production, this should verify the token against
    // a stored hash in the database and check expiration time

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
