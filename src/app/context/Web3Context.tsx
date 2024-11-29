'use client';

import { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { createCoinbaseWalletSDK } from '@coinbase/wallet-sdk';

type WalletType = 'none' | 'smart' | 'regular';

interface Web3State {
  isConnected: boolean;
  address: string | null;
  isConnecting: boolean;
  error: string | null;
  walletType: WalletType;
}

type Web3Action =
  | { type: 'START_CONNECTING' }
  | { type: 'CONNECTION_SUCCESSFUL'; address: string; walletType: WalletType }
  | { type: 'CONNECTION_FAILED'; error: string }
  | { type: 'DISCONNECT' };

const initialState: Web3State = {
  isConnected: false,
  address: null,
  isConnecting: false,
  error: null,
  walletType: 'none'
};

const Web3Context = createContext<{
  state: Web3State;
  connectSmartWallet: () => Promise<void>;
  connectRegularWallet: () => Promise<void>;
  disconnect: () => void;
} | null>(null);

function reducer(state: Web3State, action: Web3Action): Web3State {
  switch (action.type) {
    case 'START_CONNECTING':
      return { ...state, isConnecting: true, error: null };
    case 'CONNECTION_SUCCESSFUL':
      return {
        ...state,
        isConnected: true,
        address: action.address,
        walletType: action.walletType,
        isConnecting: false,
        error: null
      };
    case 'CONNECTION_FAILED':
      return {
        ...state,
        isConnected: false,
        address: null,
        isConnecting: false,
        error: action.error,
        walletType: 'none'
      };
    case 'DISCONNECT':
      return initialState;
    default:
      return state;
  }
}

export function Web3Provider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const connectSmartWallet = useCallback(async () => {
    dispatch({ type: 'START_CONNECTING' });

    try {
      const sdk = createCoinbaseWalletSDK({
        appName: 'Dude Box',
        appLogoUrl: '/Dude logo 3.jpg',
        darkMode: true,
        preference: {
          options: 'smartWalletOnly'
        }
      });

      const provider = sdk.getProvider();
      const accounts = await provider.request({ method: 'eth_requestAccounts' });

      if (!accounts[0]) {
        throw new Error('No accounts returned');
      }

      dispatch({ 
        type: 'CONNECTION_SUCCESSFUL', 
        address: accounts[0],
        walletType: 'smart'
      });
    } catch (err) {
      console.error('Smart wallet connection failed:', err);
      dispatch({ 
        type: 'CONNECTION_FAILED', 
        error: err instanceof Error ? err.message : 'Failed to connect smart wallet'
      });
    }
  }, []);

  const connectRegularWallet = useCallback(async () => {
    dispatch({ type: 'START_CONNECTING' });

    try {
      const sdk = createCoinbaseWalletSDK({
        appName: 'Dude Box',
        appLogoUrl: '/Dude logo 3.jpg',
        darkMode: true,
        preference: {
          options: 'eoaOnly'
        }
      });

      const provider = sdk.getProvider();
      const accounts = await provider.request({ method: 'eth_requestAccounts' });

      if (!accounts[0]) {
        throw new Error('No accounts returned');
      }

      dispatch({ 
        type: 'CONNECTION_SUCCESSFUL', 
        address: accounts[0],
        walletType: 'regular'
      });
    } catch (err) {
      console.error('Regular wallet connection failed:', err);
      dispatch({ 
        type: 'CONNECTION_FAILED', 
        error: err instanceof Error ? err.message : 'Failed to connect wallet'
      });
    }
  }, []);

  const disconnect = useCallback(() => {
    dispatch({ type: 'DISCONNECT' });
  }, []);

  return (
    <Web3Context.Provider value={{ 
      state, 
      connectSmartWallet, 
      connectRegularWallet, 
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