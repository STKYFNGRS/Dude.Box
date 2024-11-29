'use client';

import { Toaster } from '@/components/ui/toaster';
import { Web3Provider } from './context/Web3Context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Web3Provider>
      {children}
      <Toaster />
    </Web3Provider>
  );
}