'use client';

import { 
  createContext, 
  useContext, 
  useReducer, 
  useCallback,
  ReactNode 
} from 'react';
import { createCoinbaseWalletSDK } from '@coinbase/wallet-sdk';
import { DEFAULT_CHAIN } from '@/config/chains';

type WalletType = 'none' | 'smart' | 'regular';

interface Wallet {
  address: string;
  provider: any;
}

interface Web3State {
  isConnected: boolean;
  address: string | null;
  isConnecting: boolean;
  error: string | null;
  walletType: WalletType;
  wallet: Wallet | null;
}

type Web3Action =
  | { type: 'START_CONNECTING' }
  | { type: 'CONNECTION_SUCCESSFUL'; address: string; walletType: WalletType; provider: any }
  | { type: 'CONNECTION_FAILED'; error: string }
  | { type: 'DISCONNECT' };

const initialState: Web3State = {
  isConnected: false,
  address: null,
  isConnecting: false,
  error: null,
  walletType: 'none',
  wallet: null
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
        error: null,
        wallet: {
          address: action.address,
          provider: action.provider
        }
      };
    case 'CONNECTION_FAILED':
      return {
        ...state,
        isConnected: false,
        address: null,
        isConnecting: false,
        error: action.error,
        walletType: 'none',
        wallet: null
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
    // For now, just use regular wallet connection as smart wallet feature
    // will be implemented in a future update
    connectRegularWallet();
  }, []);

  const connectRegularWallet = useCallback(async () => {
    dispatch({ type: 'START_CONNECTING' });

    try {
      const sdk = createCoinbaseWalletSDK({
        appName: 'Dude.Box',
        appLogoUrl: '/logo.png',
        darkMode: true
      });

      const provider = sdk.makeWeb3Provider(DEFAULT_CHAIN.rpcUrl, DEFAULT_CHAIN.id);
      const accounts = await provider.request({ method: 'eth_requestAccounts' });

      if (!accounts[0]) throw new Error('No accounts returned');

      dispatch({ 
        type: 'CONNECTION_SUCCESSFUL', 
        address: accounts[0],
        walletType: 'regular',
        provider
      });
    } catch (err) {
      console.error('Wallet connection failed:', err);
      dispatch({ 
        type: 'CONNECTION_FAILED', 
        error: err instanceof Error ? err.message : 'Failed to connect wallet'
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
    dispatch({ type: 'DISCONNECT' });
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