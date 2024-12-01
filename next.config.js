/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@coinbase/onchainkit'],
  webpack: (config) => {
    // Handle source maps and declaration files
    config.module.rules.push({
      test: /\.(d\.ts|map)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[hash:8].[ext]',
      },
    });

    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      http: false,
      https: false,
      zlib: false,
      path: false,
    };

    // Exclude problematic dependencies from processing
    config.module.rules.push({
      test: /node_modules\/@metamask\/sdk\/.*\.(js|jsx|ts|tsx)$/,
      loader: 'ignore-loader'
    });

    return config;
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  }
};

module.exports = nextConfig;