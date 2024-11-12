import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'cdn.shopify.com', // Allow Shopify CDN
      'cdn.accentuate.io' // Optional: Add other domains if needed
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '**',
      }
    ]
  },
  // Enable experimental features
  experimental: {
    // Add any experimental features if needed
  },
  // Environment variables that should be available on the client
  env: {
    NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
    NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  },
  // TypeScript configuration
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: false,
  },
  // Enable strict mode for additional checks
  reactStrictMode: true,
  // Disable x-powered-by header
  poweredByHeader: false,
  // Configure compression
  compress: true,
  // Asset prefix configuration (if needed)
  assetPrefix: undefined,
};

export default nextConfig;