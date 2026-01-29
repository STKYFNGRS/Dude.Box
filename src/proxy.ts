import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";

  // Extract subdomain
  const subdomain = hostname.split(".")[0];

  // Skip main domain, localhost, and Vercel preview URLs
  if (
    subdomain === "www" ||
    subdomain === "dude" ||
    hostname.includes("localhost") ||
    hostname.includes("127.0.0.1") ||
    hostname.includes("vercel.app")
  ) {
    return NextResponse.next();
  }

  // Security: This rewrite is safe because:
  // 1. Store pages validate subdomain exists in database
  // 2. Only approved stores (status="approved") are accessible
  // 3. Reserved subdomains are blocked during store creation
  // 4. No user input is executed - only database queries
  
  // Rewrite subdomain requests to /stores/[subdomain]
  // This allows subdomain.dude.box to load /stores/subdomain pages
  url.pathname = `/stores/${subdomain}${url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
