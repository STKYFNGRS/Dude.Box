import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Check if the current user is an admin
 * @returns Promise<boolean>
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return false;
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { is_admin: true },
    });

    return user?.is_admin === true;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

/**
 * Get the current admin user (returns null if not admin)
 */
export async function getAdminUser() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || !user.is_admin) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Error getting admin user:", error);
    return null;
  }
}

/**
 * Require admin access - use in server components/API routes
 * Throws an error if user is not an admin
 */
export async function requireAdmin() {
  const admin = await isAdmin();
  
  if (!admin) {
    throw new Error("Unauthorized: Admin access required");
  }
}
