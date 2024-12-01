'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Web3Provider } from '@/app/context/Web3Context';
import { Toaster } from '@/components/ui/toaster';
import { OnchainKitProvider } from '@coinbase/onchainkit';

const queryClient = new QueryClient();

const onchainConfig = {
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || '',
  appName: 'Dude Box',
  appIcon: '/Dude logo 3.jpg',
  chainId: Number(process.env.NEXT_PUBLIC_BASE_SEPOLIA_CHAIN_ID) || 84532
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <OnchainKitProvider {...onchainConfig}>
        <Web3Provider>
          {children}
          <Toaster />
        </Web3Provider>
      </OnchainKitProvider>
    </QueryClientProvider>
  );
}