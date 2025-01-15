'use client';

import { ReactNode } from 'react';
import { WagmiProvider, createConfig } from 'wagmi';
import { base, mainnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { injected } from 'wagmi/connectors';
import { http } from 'viem';
import Web3Header from './components/layout/web3-header';

const config = createConfig({
  chains: [base, mainnet],
  connectors: [injected()],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http()
  }
});

const queryClient = new QueryClient();

export default function Web3Layout({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-900">
          <Web3Header />
          {children}
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}