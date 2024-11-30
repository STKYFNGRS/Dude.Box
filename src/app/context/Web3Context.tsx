'use client';

import { createContext, useContext, useCallback, useState, ReactNode } from 'react';
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';

interface Web3ContextType {
  isConnected: boolean;
  address: string | null;
  sdk: CoinbaseWalletSDK | null;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | null>(null);

interface CoinbaseSDKConfig {
  appName: string;
  appLogoUrl: string;
  defaultChainId: number;
}

export function Web3Provider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [sdk, setSdk] = useState<CoinbaseWalletSDK | null>(null);
  const [error, setError] = useState<string | null>(null);

  const initializeSDK = useCallback(() => {
    try {
      const config: CoinbaseSDKConfig = {
        appName: 'Dude Box',
        appLogoUrl: '/Dude logo 3.jpg',
        defaultChainId: Number(process.env.NEXT_PUBLIC_BASE_CHAIN_ID),
      };

      const newSdk = new CoinbaseWalletSDK(config);
      setSdk(newSdk);
      return newSdk;
    } catch (err) {
      console.error('Failed to initialize SDK:', err);
      setError('Failed to initialize wallet');
      return null;
    }
  }, []);

  const connect = useCallback(async () => {
    try {
      const currentSdk = sdk || initializeSDK();
      if (!currentSdk) throw new Error('Failed to initialize wallet');

      const provider = currentSdk.makeWeb3Provider(
        process.env.NEXT_PUBLIC_BASE_MAINNET_RPC,
        Number(process.env.NEXT_PUBLIC_BASE_CHAIN_ID)
      );

      const accounts = await provider.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts?.[0]) throw new Error('No account selected');

      setAddress(accounts[0]);
      setIsConnected(true);
      setError(null);
    } catch (err) {
      console.error('Connection failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
      setIsConnected(false);
      setAddress(null);
    }
  }, [sdk, initializeSDK]);

  const disconnect = useCallback(async () => {
    try {
      if (sdk) {
        const provider = sdk.makeWeb3Provider(
          process.env.NEXT_PUBLIC_BASE_MAINNET_RPC,
          Number(process.env.NEXT_PUBLIC_BASE_CHAIN_ID)
        );
        await provider.close();
        
        // Reset state
        setIsConnected(false);
        setAddress(null);
        setError(null);
        setSdk(null);
      }
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
        sdk,
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