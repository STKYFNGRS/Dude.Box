import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@coinbase/onchainkit'],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      encoding: false,
      bufferutil: false,
      'utf-8-validate': false
    };
    return config;
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp'
          }
        ]
      }
    ];
  }
};

export default nextConfig;