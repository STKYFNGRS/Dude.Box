/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.shopify.com'],
    remotePatterns: [{
      protocol: 'https',
      hostname: 'cdn.shopify.com',
      pathname: '/s/files/**'
    }]
  }
};

module.exports = nextConfig;