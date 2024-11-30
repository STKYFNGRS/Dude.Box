'use client';

import { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { createCoinbaseWalletSDK } from '@coinbase/wallet-sdk';

interface Web3State {
  isConnected: boolean;
  address: string | null;
  walletType: 'none' | 'smart' | 'regular';
  error: string | null;
}

const initialState: Web3State = {
  isConnected: false,
  address: null,
  walletType: 'none',
  error: null
};

type Web3Action =
  | { type: 'CONNECT_START' }
  | { type: 'CONNECT_SUCCESS'; address: string; walletType: 'smart' | 'regular' }
  | { type: 'CONNECT_ERROR'; error: string }
  | { type: 'DISCONNECT' };

function reducer(state: Web3State, action: Web3Action): Web3State {
  switch (action.type) {
    case 'CONNECT_START':
      return { ...state, error: null };
    case 'CONNECT_SUCCESS':
      return {
        isConnected: true,
        address: action.address,
        walletType: action.walletType,
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

const Web3Context = createContext<{
  state: Web3State;
  connectSmartWallet: () => Promise<void>;
  connectRegularWallet: () => Promise<void>;
  disconnect: () => void;
} | null>(null);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const connectSmartWallet = useCallback(async () => {
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

      if (!accounts[0]) throw new Error('No account selected');

      dispatch({ 
        type: 'CONNECT_SUCCESS', 
        address: accounts[0],
        walletType: 'smart'
      });
    } catch (error) {
      dispatch({ 
        type: 'CONNECT_ERROR', 
        error: 'Failed to connect smart wallet'
      });
    }
  }, []);

  const connectRegularWallet = useCallback(async () => {
    try {
      const sdk = createCoinbaseWalletSDK({
        appName: 'Dude Box',
        appLogoUrl: '/Dude logo 3.jpg',
        darkMode: true
      });

      const provider = sdk.getProvider();
      const accounts = await provider.request({ method: 'eth_requestAccounts' });

      if (!accounts[0]) throw new Error('No account selected');

      dispatch({ 
        type: 'CONNECT_SUCCESS', 
        address: accounts[0],
        walletType: 'regular'
      });
    } catch (error) {
      dispatch({ 
        type: 'CONNECT_ERROR', 
        error: 'Failed to connect wallet'
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