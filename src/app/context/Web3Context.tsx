'use client';

import { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';

interface Web3State {
  wallet: {
    address: string;
    provider: any;
  } | null;
  error: string | null;
}

type Web3Action =
  | { type: 'SET_WALLET'; payload: { address: string; provider: any } }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_WALLET' };

const initialState: Web3State = {
  wallet: null,
  error: null
};

const Web3Context = createContext<{
  state: Web3State;
  connectSmartWallet: () => Promise<void>;
  connectRegularWallet: () => Promise<void>;
  disconnect: () => void;
} | null>(null);

function reducer(state: Web3State, action: Web3Action): Web3State {
  switch (action.type) {
    case 'SET_WALLET':
      return {
        ...state,
        wallet: action.payload,
        error: null
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    case 'CLEAR_WALLET':
      return {
        ...state,
        wallet: null,
        error: null
      };
    default:
      return state;
  }
}

export function Web3Provider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const connectSmartWallet = useCallback(async () => {
    try {
      const sdk = new CoinbaseWalletSDK({
        appName: 'Dude.Box',
        appLogoUrl: '/logo.png',
        headlessMode: true
      });

      const provider = sdk.makeWeb3Provider(
        process.env.NEXT_PUBLIC_BASE_RPC_URL,
        Number(process.env.NEXT_PUBLIC_BASE_CHAIN_ID)
      );

      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      
      if (!accounts[0]) throw new Error('No accounts returned');

      dispatch({
        type: 'SET_WALLET',
        payload: {
          address: accounts[0],
          provider
        }
      });
    } catch (err) {
      console.error('Smart wallet connection failed:', err);
      dispatch({
        type: 'SET_ERROR',
        payload: err instanceof Error ? err.message : 'Failed to connect wallet'
      });
    }
  }, []);

  const connectRegularWallet = useCallback(async () => {
    try {
      const sdk = new CoinbaseWalletSDK({
        appName: 'Dude.Box',
        appLogoUrl: '/logo.png'
      });

      const provider = sdk.makeWeb3Provider(
        process.env.NEXT_PUBLIC_BASE_RPC_URL,
        Number(process.env.NEXT_PUBLIC_BASE_CHAIN_ID)
      );

      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      
      if (!accounts[0]) throw new Error('No accounts returned');

      dispatch({
        type: 'SET_WALLET',
        payload: {
          address: accounts[0],
          provider
        }
      });
    } catch (err) {
      console.error('Regular wallet connection failed:', err);
      dispatch({
        type: 'SET_ERROR',
        payload: err instanceof Error ? err.message : 'Failed to connect wallet'
      });
    }
  }, []);

  const disconnect = useCallback(() => {
    if (state.wallet?.provider) {
      try {
        state.wallet.provider.disconnect?.();
      } catch (err) {
        console.error('Error disconnecting wallet:', err);
      }
    }
    dispatch({ type: 'CLEAR_WALLET' });
  }, [state.wallet]);

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