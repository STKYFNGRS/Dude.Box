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

      // Create Web3 Provider without additional options
      const provider = currentSdk.makeWeb3Provider();

      // Request accounts
      const accounts = await provider.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts?.[0]) {
        throw new Error('No account selected');
      }

      setAddress(accounts[0]);
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
        await provider.close();
      }
      setIsConnected(false);
      setAddress(null);
      setError(null);
      setSdk(null);
    } catch (err) {
      console.error('Disconnect failed:', err);
      setError('Failed to disconnect wallet');
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