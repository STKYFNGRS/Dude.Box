// Server-side chain configuration
export const chainConfig = {
  mainnet: {
    chainId: process.env.BASE_CHAIN_ID,
    name: 'Base',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    }
  },
  testnet: {
    chainId: process.env.BASE_SEPOLIA_CHAIN_ID,
    name: 'Base Sepolia',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    }
  }
};