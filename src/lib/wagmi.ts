import { http, createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';

// Configure Coinbase Wallet SDK
const cbwsdk = new CoinbaseWalletSDK({
  appName: 'Dude.Box',
});

// Configuration for wagmi client
export const config = createConfig({
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC_URL),
    [baseSepolia.id]: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL)
  }
});