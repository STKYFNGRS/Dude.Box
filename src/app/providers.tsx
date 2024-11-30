'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Web3Provider } from '@/app/context/Web3Context';
import { Toaster } from '@/components/ui/toaster';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Web3Provider>
        {children}
        <Toaster />
      </Web3Provider>
    </QueryClientProvider>
  );
}