/**
 * Rate Limiting with Upstash Redis
 * 
 * SETUP REQUIRED:
 * 1. Create free account at https://upstash.com/
 * 2. Create Redis database
 * 3. Add to .env:
 *    UPSTASH_REDIS_REST_URL=your_redis_rest_url
 *    UPSTASH_REDIS_REST_TOKEN=your_redis_rest_token
 */

// Conditional import - will only work if Upstash credentials are configured
let Ratelimit: any;
let Redis: any;

try {
  const upstashRatelimit = require('@upstash/ratelimit');
  const upstashRedis = require('@upstash/redis');
  Ratelimit = upstashRatelimit.Ratelimit;
  Redis = upstashRedis.Redis;
} catch (error) {
  console.warn('⚠️  @upstash/ratelimit not installed. Rate limiting disabled.');
  console.warn('   Install with: npm install @upstash/ratelimit @upstash/redis');
}

// Create Redis instance if credentials are available
let redis: any = null;
if (Ratelimit && Redis && process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

// Auth endpoints: 5 attempts per 15 minutes
export const authLimiter = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  analytics: true,
  prefix: 'ratelimit:auth',
}) : null;

// API endpoints: 100 requests per minute
export const apiLimiter = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  analytics: true,
  prefix: 'ratelimit:api',
}) : null;

// Password reset: 3 attempts per hour
export const passwordResetLimiter = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h'),
  analytics: true,
  prefix: 'ratelimit:password-reset',
}) : null;

/**
 * Helper function to check rate limit
 * Returns { success: boolean, remaining: number, reset: Date }
 */
export async function checkRateLimit(
  limiter: any,
  identifier: string
): Promise<{ success: boolean; limit?: number; remaining?: number; reset?: number }> {
  if (!limiter) {
    // Rate limiting not configured - allow request
    console.warn('⚠️  Rate limiting not configured, allowing request');
    return { success: true };
  }

  try {
    const result = await limiter.limit(identifier);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch (error) {
    console.error('❌ Rate limit check failed:', error);
    // On error, allow request (fail open)
    return { success: true };
  }
}

/**
 * Get identifier for rate limiting (typically IP address or user ID)
 */
export function getRateLimitIdentifier(request: Request): string {
  // Try to get IP from various headers (for Vercel/proxies)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  // Fallback to a generic identifier
  return 'unknown';
}

/**
 * Usage in API routes:
 * 
 * import { authLimiter, checkRateLimit, getRateLimitIdentifier } from '@/lib/rate-limit';
 * 
 * export async function POST(request: Request) {
 *   const identifier = getRateLimitIdentifier(request);
 *   const { success, remaining, reset } = await checkRateLimit(authLimiter, identifier);
 *   
 *   if (!success) {
 *     return NextResponse.json(
 *       { error: `Too many attempts. Try again in ${Math.ceil((reset - Date.now()) / 1000 / 60)} minutes.` },
 *       { status: 429 }
 *     );
 *   }
 *   
 *   // Process request...
 * }
 */
