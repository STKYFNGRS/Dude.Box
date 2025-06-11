'use client';

import React, { useEffect, useState } from 'react';
import { CartProvider } from '@/context/CartContext';
import { wagmiAdapter, projectId, metadata, networks as appNetworks } from '@/config/reownAppKitConfig';
import { createAppKit } from '@reown/appkit/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, State } from 'wagmi';

// Create a new query client instance for each component mount
// This ensures proper cleanup and prevents stale state issues on mobile
const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,         // Reduce retries for mobile
      staleTime: 10000, // Shorter stale time for better mobile experience
    },
  },
});

// Check for projectId at runtime instead of build time
export default function Providers({ children, initialState }: { children: React.ReactNode, initialState?: State }) {
  const [isAppKitInitialized, setIsAppKitInitialized] = useState(false);
  // Create a new query client for each component instance
  const [queryClient] = useState(() => createQueryClient());
  
  // Detect mobile browsers on the client side
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Update mobile detection on client side
    const checkIfMobile = () => {
      setIsMobile(
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      );
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Initialize Reown AppKit only on the client side
  useEffect(() => {
    // Only initialize if projectId is a non-empty string
    const safeProjectId = typeof projectId === 'string' && projectId.trim() !== '' ? projectId : null;
    
    if (!isAppKitInitialized && safeProjectId) {
      try {
        // Add a small delay for mobile devices to ensure proper initialization
        const initializeAppKit = () => {
          createAppKit({
            adapters: [wagmiAdapter],
            networks: [appNetworks[0], ...appNetworks.slice(1)],
            projectId: safeProjectId, // Use safeProjectId which is guaranteed to be a string
            metadata: metadata,
            defaultNetwork: appNetworks[0],
            features: {
              analytics: false, // Disable analytics
              onramp: false, // Disable onramp features
              swaps: false, // Disable swap features
            },
            enableWalletConnect: false, // Disable WalletConnect auto-connection
          });
          setIsAppKitInitialized(true);
        };
        
        if (isMobile) {
          // Slight delay on mobile to ensure proper DOM mounting
          const timer = setTimeout(initializeAppKit, 100);
          return () => clearTimeout(timer);
        } else {
          initializeAppKit();
        }
      } catch (error) {
        console.error("Failed to initialize AppKit:", error);
      }
    } else if (!safeProjectId) {
      console.error("Cannot initialize AppKit: Project ID is not defined");
    }
  }, [isAppKitInitialized, isMobile]);

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
