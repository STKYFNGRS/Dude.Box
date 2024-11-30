'use client';

import { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { CoinbaseWalletProvider, CoinbaseWalletSDK } from '@coinbase/wallet-sdk';

type WalletType = 'none' | 'smart' | 'regular';

interface Web3State {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  walletType: WalletType;
  error: string | null;
  provider: CoinbaseWalletProvider | null;
}

const initialState: Web3State = {
  isConnected: false,
  isConnecting: false,
  address: null,
  walletType: 'none',
  error: null,
  provider: null
};

type Web3Action =
  | { type: 'CONNECT_START' }
  | { type: 'CONNECT_SUCCESS'; address: string; walletType: WalletType; provider: CoinbaseWalletProvider }
  | { type: 'CONNECT_ERROR'; error: string }
  | { type: 'DISCONNECT' };

const Web3Context = createContext<{
  state: Web3State;
  connectSmartWallet: (forceCreate?: boolean) => Promise<void>;
  disconnect: () => void;
} | null>(null);

function reducer(state: Web3State, action: Web3Action): Web3State {
  switch (action.type) {
    case 'CONNECT_START':
      return { ...state, isConnecting: true, error: null };
    case 'CONNECT_SUCCESS':
      return {
        ...state,
        isConnected: true,
        isConnecting: false,
        address: action.address,
        walletType: action.walletType,
        provider: action.provider,
        error: null
      };
    case 'CONNECT_ERROR':
      return {
        ...initialState,
        error: action.error
      };
    case 'DISCONNECT':
      return initialState;
    default:
      return state;
  }
}

export function Web3Provider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const detectWalletType = (address: string): WalletType => {
    return address.toLowerCase().endsWith('37db') ? 'smart' : 'regular';
  };

  const connectSmartWallet = useCallback(async (forceCreate?: boolean) => {
    try {
      dispatch({ type: 'CONNECT_START' });

      const sdk = new CoinbaseWalletSDK({
        appName: 'Dude Box',
        appLogoUrl: '/Dude logo 3.jpg',
        darkMode: true,
        defaultChainId: Number(process.env.NEXT_PUBLIC_BASE_CHAIN_ID) || 84532,
        reloadOnDisconnect: false,
        appWebUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://dude-box.vercel.app',
        enableMobileWalletLink: true,
      });

      const provider = sdk.makeWeb3Provider(
        process.env.NEXT_PUBLIC_BASE_MAINNET_RPC,
        Number(process.env.NEXT_PUBLIC_BASE_CHAIN_ID),
        {
          ...(forceCreate ? { walletMode: 'smart' as const } : undefined)
        }
      );
      
      const accounts = await provider.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts[0]) {
        throw new Error('No account selected');
      }

      const walletType = detectWalletType(accounts[0]);

      // Switch to Base chain
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${Number(process.env.NEXT_PUBLIC_BASE_CHAIN_ID || 84532).toString(16)}` }],
      });

      dispatch({ 
        type: 'CONNECT_SUCCESS', 
        address: accounts[0],
        walletType,
        provider
      });

      console.log('Connected with wallet type:', walletType, 'Address:', accounts[0]);

    } catch (error) {
      console.error('Wallet connection failed:', error);
      dispatch({ 
        type: 'CONNECT_ERROR', 
        error: error instanceof Error ? error.message : 'Failed to connect wallet'
      });
    }
  }, []);

  const disconnect = useCallback(() => {
    if (state.provider) {
      try {
        state.provider.close();
      } catch (error) {
        console.error('Error disconnecting:', error);
      }
    }
    dispatch({ type: 'DISCONNECT' });
  }, [state.provider]);

  return (
    <Web3Context.Provider value={{ 
      state, 
      connectSmartWallet, 
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