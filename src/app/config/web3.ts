import { baseSepolia } from 'viem/chains';

export const SUPPORTED_CHAINS = {
  BASE_SEPOLIA: {
    ...baseSepolia,
    rpcUrls: {
      default: {
        http: [process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://sepolia.base.org'],
      },
      public: {
        http: [process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://sepolia.base.org'],
      },
    },
  },
} as const;

export const DEFAULT_CHAIN = SUPPORTED_CHAINS.BASE_SEPOLIA;

export const APP_CONFIG = {
  name: 'Dude Box',
  description: 'Dude Box Web3 Platform',
  icon: '/Dude logo 3.jpg',
  rpcUrl: process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://sepolia.base.org',
  apiKey: process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || '',
} as const;