'use client';

import { createContext, useContext, useReducer, useCallback, ReactNode, useEffect } from 'react';
import { traditionalWalletService } from '../services/traditionalWallet';
import type { Web3ContextState, Web3ContextType } from '../types/web3';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare global {
  interface Window {
    ethereum: any;
  }
}

const initialState: Web3ContextState = {
  wallet: null,
  isConnecting: false,
  connectionError: null,
  publicClient: null,
  walletClient: null,
};

type Action =
  | { type: 'SET_CONNECTING'; payload: boolean }
  | { type: 'SET_WALLET'; payload: Partial<Web3ContextState> }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'RESET' };

function reducer(state: Web3ContextState, action: Action): Web3ContextState {
  switch (action.type) {
    case 'SET_CONNECTING':
      return { ...state, isConnecting: action.payload, connectionError: null };
    case 'SET_WALLET':
      return { ...state, ...action.payload, connectionError: null, isConnecting: false };
    case 'SET_ERROR':
      return {
        ...state,
        connectionError: action.payload,
        isConnecting: false,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const Web3Context = createContext<Web3ContextType | null>(null);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const connectTraditionalWallet = useCallback(async () => {
    if (state.isConnecting) return;

    try {
      dispatch({ type: 'SET_CONNECTING', payload: true });
      const { address, walletClient, publicClient } = await traditionalWalletService.connect();
      
      dispatch({
        type: 'SET_WALLET',
        payload: {
          wallet: { address, chain: { id: 84532, name: 'Base Sepolia' } },
          walletClient,
          publicClient,
        },
      });
    } catch (error) {
      console.error('Failed to connect traditional wallet:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to connect wallet. Please try again.',
      });
    }
  }, [state.isConnecting]);

  const connectSmartWallet = useCallback(async (provider: CoinbaseWalletProvider) => {
    if (state.isConnecting) return;

    try {
      dispatch({ type: 'SET_CONNECTING', payload: true });
      
      const accounts = await provider.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts[0]) throw new Error('No accounts returned');

      dispatch({
        type: 'SET_WALLET',
        payload: {
          wallet: {
            address: accounts[0],
            chain: { id: 84532, name: 'Base Sepolia' }
          },
          walletClient: provider,
          publicClient: provider,
        },
      });
    } catch (error) {
      console.error('Failed to connect smart wallet:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to connect smart wallet. Please try again.',
      });
    }
  }, [state.isConnecting]);

  const disconnect = useCallback(async () => {
    try {
      await traditionalWalletService.disconnect();
      dispatch({ type: 'RESET' });
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  }, []);

  const switchChain = useCallback(async (chainId: number) => {
    if (!state.wallet) throw new Error('Wallet not connected');

    try {
      await traditionalWalletService.switchChain(chainId);
    } catch (error) {
      console.error('Failed to switch chain:', error);
      throw error;
    }
  }, [state.wallet]);

  useEffect(() => {
    if (!state.wallet) return;

    const cleanup = traditionalWalletService.setupEventListeners({
      onAccountsChanged: (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else if (state.wallet?.address !== accounts[0]) {
          dispatch({
            type: 'SET_WALLET',
            payload: {
              wallet: {
                ...state.wallet,
                address: accounts[0],
              },
            },
          });
        }
      },
      onChainChanged: async () => {
        window.location.reload();
      },
      onDisconnect: () => {
        disconnect();
      },
    });

    return () => {
      cleanup?.();
    };
  }, [state.wallet, disconnect]);

  return (
    <Web3Context.Provider
      value={{
        state,
        connectTraditionalWallet,
        connectSmartWallet,
        disconnect,
        switchChain,
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