'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';

interface Web3ContextType {
  isConnected: boolean;
  address: string | null;
  wallet: CoinbaseWalletSDK | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  error: string | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [wallet, setWallet] = useState<CoinbaseWalletSDK | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize Coinbase Wallet
  const initializeWallet = useCallback(() => {
    try {
      const walletSDK = new CoinbaseWalletSDK({
        appName: 'Dude.Box',
        appLogoUrl: '/logo.png',
        darkMode: true,
        defaultChainId: 84532, // Base Sepolia
      });

      // Store the SDK instance
      setWallet(walletSDK);
      return walletSDK;
    } catch (err) {
      console.error('Failed to initialize wallet:', err);
      setError('Failed to initialize wallet');
      return null;
    }
  }, []);

  // Connect wallet
  const connect = useCallback(async () => {
    try {
      setError(null);
      const sdk = wallet || initializeWallet();
      if (!sdk) {
        throw new Error('Failed to initialize wallet SDK');
      }

      const provider = sdk.makeWeb3Provider(
        process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL,
        84532
      );

      // Request accounts
      const accounts = await provider.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from wallet');
      }

      const userAddress = accounts[0];
      setAddress(userAddress);
      setIsConnected(true);
      
      // Store connection info
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletAddress', userAddress);

      // Subscribe to account changes
      provider.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnect();
        } else {
          setAddress(accounts[0]);
        }
      });

      // Subscribe to chain changes
      provider.on('chainChanged', (chainId: string) => {
        if (chainId !== '0x14a34') { // Base Sepolia chainId in hex
          setError('Please switch to Base Sepolia network');
        } else {
          setError(null);
        }
      });

    } catch (err) {
      console.error('Failed to connect wallet:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
      setIsConnected(false);
      setAddress(null);
      localStorage.removeItem('walletConnected');
      localStorage.removeItem('walletAddress');
      throw err;
    }
  }, [wallet, initializeWallet]);

  // Disconnect wallet
  const disconnect = useCallback(async () => {
    if (wallet) {
      try {
        const provider = wallet.makeWeb3Provider(
          process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL,
          84532
        );
        
        // Clean up event listeners
        provider.removeAllListeners();
        
        // Reset state
        setIsConnected(false);
        setAddress(null);
        setWallet(null);
        setError(null);
        
        // Clear storage
        localStorage.removeItem('walletConnected');
        localStorage.removeItem('walletAddress');
      } catch (err) {
        console.error('Error during disconnect:', err);
        setError('Failed to disconnect wallet');
      }
    }
  }, [wallet]);

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
  }, [connect]);

  return (
    <Web3Context.Provider
      value={{
        isConnected,
        address,
        wallet,
        connect,
        disconnect,
        error
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