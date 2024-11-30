export const SUPPORTED_CHAINS = {
  baseMainnet: {
    id: parseInt(process.env.NEXT_PUBLIC_BASE_CHAIN_ID || '8453'),
    name: 'Base',
    rpcUrl: process.env.NEXT_PUBLIC_BASE_RPC_URL,
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    }
  },
  baseSepolia: {
    id: parseInt(process.env.NEXT_PUBLIC_BASE_SEPOLIA_CHAIN_ID || '84532'),
    name: 'Base Sepolia',
    rpcUrl: process.env.NEXT_PUBLIC_BASE_RPC_URL?.replace('base', 'base-sepolia'),
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    }
  }
} as const;

// Default chain for development
export const DEFAULT_CHAIN = SUPPORTED_CHAINS.baseSepolia;

// All supported chains
export const ALL_SUPPORTED_CHAINS = Object.values(SUPPORTED_CHAINS);