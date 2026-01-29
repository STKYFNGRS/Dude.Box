/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Image configuration for external image sources
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel-storage.app',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'public.blob.vercel-storage.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
        pathname: '/**',
      },
      // Add any other image hosting services vendors might use
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  
  // Redirects for consolidated single-page architecture
  async redirects() {
    return [
      {
        source: '/shop',
        destination: '/#shop',
        permanent: false,
      },
      {
        source: '/about',
        destination: '/#mission',
        permanent: false,
      },
      {
        source: '/our-mission',
        destination: '/#mission',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig; 