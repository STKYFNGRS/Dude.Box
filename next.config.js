/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
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