import { http, createConfig } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { SUPPORTED_CHAINS } from '@/config/chains'

// Get RPC URLs from our chain config
const rpcUrls = {
  [base.id]: SUPPORTED_CHAINS.baseMainnet.rpcUrls.default.http[0],
  [baseSepolia.id]: SUPPORTED_CHAINS.baseSepolia.rpcUrls.default.http[0]
}

export const config = createConfig({
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(rpcUrls[base.id]),
    [baseSepolia.id]: http(rpcUrls[baseSepolia.id])
  }
});