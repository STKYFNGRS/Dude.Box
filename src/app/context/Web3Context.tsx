'use client';

import { createContext, useContext, useCallback, useState, ReactNode } from 'react';
import { createCoinbaseWalletSDK } from '@coinbase/wallet-sdk';

// Initialize SDK with recommended configuration
const sdk = createCoinbaseWalletSDK({
  appName: 'Dude Box',
  appLogoUrl: '/Dude logo 3.jpg',
  appChainIds: [84532] // Base Sepolia
});

const provider = sdk.getProvider();

interface Web3ContextType {
  isConnected: boolean;
  address: string | null;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const Web3Context = createContext<Web3ContextType | null>(null);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    try {
      const [address] = await provider.request({
        method: 'eth_requestAccounts',
      });

      if (address) {
        setIsConnected(true);
        setAddress(address);
        setError(null);
      }
    } catch (error) {
      console.error('Failed to connect:', error);
      setError(error instanceof Error ? error.message : 'Failed to connect wallet');
    }
  }, []);

  const disconnect = useCallback(() => {
    setIsConnected(false);
    setAddress(null);
    setError(null);
  }, []);

  return (
    <Web3Context.Provider value={{
      isConnected,
      address,
      error,
      connect,
      disconnect
    }}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}