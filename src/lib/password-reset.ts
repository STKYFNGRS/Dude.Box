import { prisma } from './prisma';
import crypto from 'crypto';

/**
 * Generate a secure random token for password reset
 */
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Create a password reset token and store it in the database
 * Expires in 15 minutes
 */
export async function createPasswordResetToken(email: string): Promise<string> {
  const token = generateResetToken();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  // Delete any existing unused tokens for this email
  await prisma.passwordResetToken.deleteMany({
    where: {
      email: email.toLowerCase().trim(),
      used: false,
    },
  });

  // Create new token
  await prisma.passwordResetToken.create({
    data: {
      email: email.toLowerCase().trim(),
      token,
      expires_at: expiresAt,
    },
  });

  return token;
}

/**
 * Verify a password reset token
 * Returns the email if valid, null if invalid/expired/used
 */
export async function verifyPasswordResetToken(token: string): Promise<string | null> {
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken) {
    return null; // Token doesn't exist
  }

  if (resetToken.used) {
    return null; // Token already used
  }

  if (resetToken.expires_at < new Date()) {
    return null; // Token expired
  }

  return resetToken.email;
}

/**
 * Mark a password reset token as used
 */
export async function markTokenAsUsed(token: string): Promise<void> {
  await prisma.passwordResetToken.update({
    where: { token },
    data: { used: true },
  });
}

/**
 * Clean up expired tokens (run periodically)
 */
export async function cleanupExpiredTokens(): Promise<number> {
  const result = await prisma.passwordResetToken.deleteMany({
    where: {
      expires_at: {
        lt: new Date(),
      },
    },
  });

  return result.count;
}

/**
 * Usage example:
 * 
 * // 1. When user requests password reset:
 * const token = await createPasswordResetToken(user.email);
 * await sendPasswordResetEmail(user.email, token);
 * 
 * // 2. When user submits reset form:
 * const email = await verifyPasswordResetToken(token);
 * if (!email) {
 *   return { error: 'Invalid or expired reset link' };
 * }
 * 
 * // 3. After successfully resetting password:
 * await markTokenAsUsed(token);
 */
