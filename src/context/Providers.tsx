'use client';

import React from 'react';
import { CartProvider } from '@/context/CartContext';
import { wagmiAdapter, projectId, metadata, networks as appNetworks } from '@/config/reownAppKitConfig';
import { createAppKit } from '@reown/appkit/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, State } from 'wagmi';

const queryClient = new QueryClient();

if (!projectId) throw new Error('Project ID is not defined for Reown AppKit');

// Initialize Reown AppKit
createAppKit({
  adapters: [wagmiAdapter],
  networks: [appNetworks[0], ...appNetworks.slice(1)],
  projectId: projectId,
  metadata: metadata,
});

export default function Providers({ children, initialState }: { children: React.ReactNode, initialState?: State }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          {children}
        </CartProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
