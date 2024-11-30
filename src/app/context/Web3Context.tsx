'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';

interface Web3ContextType {
  isConnected: boolean;
  address: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [wallet, setWallet] = useState<CoinbaseWalletSDK | null>(null);
  const [provider, setProvider] = useState<any>(null);

  // Initialize Coinbase Wallet
  const initializeWallet = useCallback(() => {
    try {
      const walletSDK = new CoinbaseWalletSDK({
        appName: 'Dude.Box',
        appLogoUrl: '/logo.png',
        darkMode: true,
        defaultChainId: 84532, // Base Sepolia
      });

      const provider = walletSDK.makeWeb3Provider(
        process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL,
        84532
      );
      
      setWallet(walletSDK);
      setProvider(provider);
      
      return { walletSDK, provider };
    } catch (err) {
      console.error('Failed to initialize wallet:', err);
      return null;
    }
  }, []);

  // Connect wallet
  const connect = useCallback(async () => {
    try {
      const currentProvider = provider || initializeWallet()?.provider;
      if (!currentProvider) {
        throw new Error('Failed to initialize wallet SDK');
      }

      const accounts = await currentProvider.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from wallet');
      }

      const userAddress = accounts[0];
      setAddress(userAddress);
      setIsConnected(true);
      
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletAddress', userAddress);

      // Handle accountsChanged
      currentProvider.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setAddress(accounts[0]);
        }
      });

    } catch (err) {
      console.error('Failed to connect wallet:', err);
      setIsConnected(false);
      setAddress(null);
      localStorage.removeItem('walletConnected');
      localStorage.removeItem('walletAddress');
      throw err;
    }
  }, [provider, initializeWallet]);

  // Disconnect wallet
  const disconnect = useCallback(async () => {
    if (provider) {
      try {
        // Remove event listeners
        provider.removeAllListeners();

        // Close the provider connection
        if (provider.close) {
          await provider.close();
        }

        // Attempt to trigger disconnect in the wallet
        try {
          await provider.request({
            method: 'wallet_disconnect'
          });
        } catch (e) {
          console.log('Wallet disconnect method not supported');
        }

        // Clear the SDK instance
        if (wallet) {
          wallet.disconnect();
        }
      } catch (err) {
        console.error('Error during disconnect:', err);
      }
    }

    // Reset all state regardless of success/failure
    setIsConnected(false);
    setAddress(null);
    setWallet(null);
    setProvider(null);
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletAddress');
  }, [provider, wallet]);

  // Check for existing connection on mount
  useEffect(() => {
    const wasConnected = localStorage.getItem('walletConnected') === 'true';
    const savedAddress = localStorage.getItem('walletAddress');

    if (wasConnected && savedAddress) {
      connect().catch((err) => {
        console.error('Failed to restore connection:', err);
        localStorage.removeItem('walletConnected');
        localStorage.removeItem('walletAddress');
      });
    }

    // Cleanup on unmount
    return () => {
      if (provider) {
        provider.removeAllListeners();
      }
    };
  }, [connect, provider]);

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

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};