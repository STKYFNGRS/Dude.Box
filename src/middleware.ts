export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/messages/:path*",
    "/settings/:path*",
    "/admin/:path*",
  ],
};
