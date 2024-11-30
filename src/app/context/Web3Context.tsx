'use client';

import { createContext, useContext, useCallback, useState, ReactNode } from 'react';
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';

type WalletType = 'none' | 'smart' | 'regular';

interface Web3ContextType {
  isConnected: boolean;
  address: string | null;
  walletType: WalletType;
  error: string | null;
  connect: (createWallet?: boolean) => Promise<void>;
  disconnect: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | null>(null);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<WalletType>('none');
  const [error, setError] = useState<string | null>(null);
  const [sdk, setSdk] = useState<CoinbaseWalletSDK | null>(null);

  const connect = useCallback(async (createWallet?: boolean) => {
    try {
      // Clear any existing state
      setIsConnected(false);
      setAddress(null);
      setWalletType('none');
      setError(null);
      
      // Initialize new SDK instance each time
      const currentSdk = new CoinbaseWalletSDK({
        appName: 'Dude Box',
        appLogoUrl: '/Dude logo 3.jpg',
      });

      setSdk(currentSdk);
      const provider = currentSdk.makeWeb3Provider();

      // Request accounts - this triggers the connection modal
      const accounts = await provider.request({
        method: 'eth_requestAccounts'
      }) as string[];

      if (!Array.isArray(accounts) || accounts.length === 0) {
        throw new Error('No account selected');
      }

      const selectedAddress = accounts[0];
      const newWalletType = createWallet || selectedAddress.toLowerCase().endsWith('37db') ? 'smart' : 'regular';
      
      setAddress(selectedAddress);
      setIsConnected(true);
      setWalletType(newWalletType);
      setError(null);

    } catch (err) {
      console.error('Connection failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
      setIsConnected(false);
      setAddress(null);
      setWalletType('none');
      setSdk(null);
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      if (sdk) {
        const provider = sdk.makeWeb3Provider();
        // Clear provider state
        await provider.request({
          method: 'wallet_accounts',
          params: []
        }).catch(console.error);
      }
    } catch (err) {
      console.error('Disconnect error:', err);
    } finally {
      // Always reset state
      setIsConnected(false);
      setAddress(null);
      setWalletType('none');
      setError(null);
      setSdk(null);
    }
  }, [sdk]);

  return (
    <Web3Context.Provider 
      value={{
        isConnected,
        address,
        walletType,
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