'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useOnchainKit } from '@coinbase/onchainkit';
import type { Address } from 'viem';

interface Web3ContextType {
  isConnected: boolean;
  address: Address | undefined;
  connect: () => void;
  disconnect: () => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: ReactNode }) {
  const { isConnected, address, connect, disconnect } = useOnchainKit();

  return (
    <Web3Context.Provider value={{
      isConnected: Boolean(isConnected),
      address: address as Address,
      connect: () => {
        if (connect) connect();
      },
      disconnect: () => {
        if (disconnect) disconnect();
      }
    }}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}