'use client';

import { WagmiProvider } from 'wagmi';
import { Toaster } from '@/components/ui/toaster';
import { Web3Provider } from './context/Web3Context';
import { config } from '@/lib/wagmi';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <Web3Provider>
        {children}
        <Toaster />
      </Web3Provider>
    </WagmiProvider>
  );
}