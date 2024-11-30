'use client';

import { createContext, useContext, useCallback, useState, ReactNode } from 'react';
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';

const sdk = new CoinbaseWalletSDK({
  appName: 'Dude Box',
  appLogoUrl: '/Dude logo 3.jpg',
  appChainIds: [84532], // Base Sepolia
});

const provider = sdk.makeWeb3Provider();

interface Web3ContextType {
  isConnected: boolean;
  address: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | null>(null);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  const connect = useCallback(async () => {
    try {
      const [accounts] = await provider.request({
        method: 'eth_requestAccounts'
      }) as string[];

      if (accounts) {
        setAddress(accounts);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Connection failed:', error);
    }
  }, []);

  const disconnect = useCallback(async () => {
    setIsConnected(false);
    setAddress(null);
  }, []);

  return (
    <Web3Context.Provider 
      value={{
        isConnected,
        address,
        connect,
        disconnect
      }}
    >
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