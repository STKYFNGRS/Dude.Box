/**
 * Marketplace utilities for platform fee calculations
 * and multi-vendor logic
 */

// Platform fee percentage (10% default)
export const PLATFORM_FEE_PERCENT =
  parseFloat(process.env.STRIPE_PLATFORM_FEE_PERCENT || "10");

/**
 * Calculate platform fee and vendor amount from gross amount
 */
export function calculatePlatformFees(grossAmount: number) {
  const platformFee = (grossAmount * PLATFORM_FEE_PERCENT) / 100;
  const vendorAmount = grossAmount - platformFee;

  return {
    gross_amount: grossAmount,
    platform_fee: platformFee,
    vendor_amount: vendorAmount,
    fee_percentage: PLATFORM_FEE_PERCENT,
  };
}

/**
 * Convert dollars to cents for Stripe
 */
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

/**
 * Convert cents to dollars
 */
export function centsToDollars(cents: number): number {
  return cents / 100;
}

/**
 * Validate subdomain format
 */
export function isValidSubdomain(subdomain: string): boolean {
  // Must be lowercase alphanumeric with hyphens, 3-63 characters
  const regex = /^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$/;
  return regex.test(subdomain);
}

/**
 * Reserved subdomains that cannot be used for stores
 */
export const RESERVED_SUBDOMAINS = [
  "www",
  "api",
  "admin",
  "members",
  "portal",
  "app",
  "mail",
  "smtp",
  "ftp",
  "blog",
  "shop",
  "store",
  "help",
  "support",
  "status",
  "cdn",
  "assets",
  "static",
];

/**
 * Check if subdomain is reserved
 */
export function isReservedSubdomain(subdomain: string): boolean {
  return RESERVED_SUBDOMAINS.includes(subdomain.toLowerCase());
}
