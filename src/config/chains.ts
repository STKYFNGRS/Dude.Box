export const SUPPORTED_CHAINS = {
  mainnet: {
    id: parseInt(process.env.NEXT_PUBLIC_ETHEREUM_CHAIN_ID || '1'),
    name: 'Ethereum Mainnet',
    rpcUrl: process.env.NEXT_PUBLIC_ETHEREUM_RPC,
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    }
  },
  baseSepolia: {
    id: parseInt(process.env.NEXT_PUBLIC_BASE_SEPOLIA_CHAIN_ID || '84532'),
    name: 'Base Sepolia',
    rpcUrl: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC,
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    }
  },
  sepolia: {
    id: parseInt(process.env.NEXT_PUBLIC_SEPOLIA_CHAIN_ID || '11155111'),
    name: 'Sepolia',
    rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC,
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18,
    }
  },
  baseMainnet: {
    id: parseInt(process.env.NEXT_PUBLIC_BASE_MAINNET_CHAIN_ID || '8453'),
    name: 'Base Mainnet',
    rpcUrl: process.env.NEXT_PUBLIC_BASE_MAINNET_RPC,
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    }
  }
} as const;

// Default chain for smart wallet
export const DEFAULT_CHAIN = SUPPORTED_CHAINS.baseSepolia;

// Chains supported by smart wallet
export const SMART_WALLET_CHAINS = [
  SUPPORTED_CHAINS.baseSepolia,
  SUPPORTED_CHAINS.baseMainnet
];

// Chains supported by regular wallets (MetaMask/Coinbase Wallet)
export const REGULAR_WALLET_CHAINS = [
  SUPPORTED_CHAINS.mainnet,
  SUPPORTED_CHAINS.sepolia,
  SUPPORTED_CHAINS.baseSepolia,
  SUPPORTED_CHAINS.baseMainnet
];