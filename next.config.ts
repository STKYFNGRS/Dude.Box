/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@coinbase/onchainkit', '@wagmi', '@metamask/sdk'],
  webpack: (config) => {
    // Ignore .d.ts files from @metamask/sdk
    config.module.rules.push({
      test: /\.d\.ts$/,
      exclude: /node_modules\/@metamask\/sdk/,
      use: [
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      ],
    });

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      encoding: false,
      bufferutil: false,
      'utf-8-validate': false
    };
    return config;
  },
  // Headers for CORS
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