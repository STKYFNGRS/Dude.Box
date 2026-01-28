/**
 * Vendor authorization helpers
 */

import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./prisma";

/**
 * Get the current vendor's store (if they own an approved store)
 */
export async function getVendorStore() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      owned_stores: {
        where: {
          status: "approved",
        },
      },
    },
  });

  // Return the first approved store (in future, handle multiple stores)
  return user?.owned_stores[0] || null;
}

/**
 * Require vendor authorization (throws error if not a vendor)
 */
export async function requireVendor() {
  const store = await getVendorStore();
  if (!store) {
    throw new Error("Unauthorized: Vendor store required");
  }
  return store;
}

/**
 * Check if user is a vendor (has an approved store)
 */
export async function isVendor(): Promise<boolean> {
  const store = await getVendorStore();
  return store !== null;
}

/**
 * Get vendor user data
 */
export async function getVendorUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      owned_stores: true,
    },
  });

  return user;
}
