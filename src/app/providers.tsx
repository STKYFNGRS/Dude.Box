'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi';
import { Toaster } from '@/components/ui/toaster';
import { Web3Provider } from './context/Web3Context';
import { config } from '@/lib/wagmi';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Web3Provider>
          {children}
          <Toaster />
        </Web3Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}