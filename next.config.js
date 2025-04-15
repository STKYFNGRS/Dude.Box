/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.shopify.com', 'geuyxr-wz.myshopify.com'],
  },
  // Transpile 'three' and related libraries for compatibility
  transpilePackages: ['three'],
  // Enable React strict mode for better development experience
  reactStrictMode: true,
};

module.exports = nextConfig; 