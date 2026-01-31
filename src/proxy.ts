import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";

  // Extract subdomain
  const subdomain = hostname.split(".")[0];

  // Determine if this is a subdomain request (for rewriting)
  const isSubdomain =
    subdomain !== "www" &&
    subdomain !== "dude" &&
    !hostname.includes("localhost") &&
    !hostname.includes("127.0.0.1") &&
    !hostname.includes("vercel.app");

  // Handle subdomain rewrite for store pages
  let response: NextResponse;
  
  if (isSubdomain) {
    // Redirect cart/checkout/portal paths to www domain (store-agnostic features)
    if (url.pathname.startsWith('/cart') || 
        url.pathname.startsWith('/checkout') ||
        url.pathname.startsWith('/portal') ||
        url.pathname.startsWith('/members')) {
      const wwwUrl = url.clone();
      wwwUrl.host = hostname.replace(subdomain, 'www');
      response = NextResponse.redirect(wwwUrl);
    } else {
      // Security: This rewrite is safe because:
      // 1. Store pages validate subdomain exists in database
      // 2. Only approved stores (status="approved") are accessible
      // 3. Reserved subdomains are blocked during store creation
      // 4. No user input is executed - only database queries
      
      // Rewrite subdomain requests to /stores/[subdomain]
      // This allows subdomain.dude.box to load /stores/subdomain pages
      url.pathname = `/stores/${subdomain}${url.pathname}`;
      response = NextResponse.rewrite(url);
    }
  } else {
    response = NextResponse.next();
  }

  // Add security headers (OWASP 2026 best practices) to ALL responses
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Only set HSTS in production (requires HTTPS)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains'
    );
  }
  
  // Content Security Policy - adjusted for Next.js, Stripe, and UploadThing
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://cdn.jsdelivr.net",
    "connect-src 'self' https://api.stripe.com https://*.uploadthing.com https://uploadthing.com",
    "img-src 'self' data: https: blob: https://*.uploadthing.com https://utfs.io",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    "frame-src https://js.stripe.com https://hooks.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', cspDirectives);
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon and public assets (png, svg, ico, webmanifest)
     */
    "/((?!api|_next/static|_next/image|favicon|.*\\.png$|.*\\.svg$|.*\\.ico$|.*\\.webmanifest$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.webp$).*)",
  ],
};

// For backwards compatibility
export { middleware as proxy };
