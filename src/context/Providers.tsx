'use client';

import React, { useEffect, useState } from 'react';
import { CartProvider } from '@/context/CartContext';
import { wagmiAdapter, projectId, metadata, networks as appNetworks } from '@/config/reownAppKitConfig';
import { createAppKit } from '@reown/appkit/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, State } from 'wagmi';

const queryClient = new QueryClient();

// Check for projectId at runtime instead of build time
export default function Providers({ children, initialState }: { children: React.ReactNode, initialState?: State }) {
  const [isAppKitInitialized, setIsAppKitInitialized] = useState(false);

  // Initialize Reown AppKit only on the client side
  useEffect(() => {
    if (!isAppKitInitialized && projectId) {
      try {
        createAppKit({
          adapters: [wagmiAdapter],
          networks: [appNetworks[0], ...appNetworks.slice(1)],
          projectId: projectId,
          metadata: metadata,
        });
        setIsAppKitInitialized(true);
      } catch (error) {
        console.error("Failed to initialize AppKit:", error);
      }
    } else if (!projectId) {
      console.error("Cannot initialize AppKit: Project ID is not defined");
    }
  }, [isAppKitInitialized]);

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
