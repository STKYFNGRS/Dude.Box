'use client';

import { createContext, useContext, useCallback, useState, ReactNode } from 'react';
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';

interface Web3ContextType {
  isConnected: boolean;
  address: string | null;
  error: string | null;
  connect: (createWallet?: boolean) => Promise<void>;
  disconnect: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | null>(null);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sdk, setSdk] = useState<CoinbaseWalletSDK | null>(null);

  const connect = useCallback(async (createWallet?: boolean) => {
    try {
      let currentSdk = sdk;
      
      if (!currentSdk) {
        currentSdk = new CoinbaseWalletSDK({
          appName: 'Dude Box',
          appLogoUrl: '/Dude logo 3.jpg',
        });
        setSdk(currentSdk);
      }

      const provider = currentSdk.makeWeb3Provider();

      const response = await provider.request({
        method: 'eth_requestAccounts'
      }) as string[];

      if (!Array.isArray(response) || response.length === 0) {
        throw new Error('No account selected');
      }

      const selectedAddress = response[0];
      if (typeof selectedAddress !== 'string') {
        throw new Error('Invalid account format');
      }

      setAddress(selectedAddress);
      setIsConnected(true);
      setError(null);

    } catch (err) {
      console.error('Connection failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
      setIsConnected(false);
      setAddress(null);
    }
  }, [sdk]);

  const disconnect = useCallback(async () => {
    try {
      if (sdk) {
        const provider = sdk.makeWeb3Provider();
        // Instead of using close(), just clear the connection state
        await provider.request({
          method: 'eth_accounts',
          params: []
        });
      }
      // Reset all state
      setIsConnected(false);
      setAddress(null);
      setError(null);
      setSdk(null);
    } catch (err) {
      console.error('Disconnect failed:', err);
      // Even if there's an error, reset the state
      setIsConnected(false);
      setAddress(null);
      setError('Failed to disconnect wallet');
      setSdk(null);
    }
  }, [sdk]);

  return (
    <Web3Context.Provider 
      value={{
        isConnected,
        address,
        error,
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