export default {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/s/files/**'
      }
    ],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['cdn.shopify.com'],
    unoptimized: true  // Added this line
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  httpAgentOptions: {
    keepAlive: true,
  }
};