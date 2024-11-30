'use client';

import { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import type { CoinbaseWalletProvider } from '@coinbase/wallet-sdk';

type WalletType = 'none' | 'smart' | 'regular';

// Custom SDK options interface
interface SDKOptions {
  appName: string;
  chainId?: number;
  rpcUrl?: string;
}

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
      return {
        ...state,
        isConnecting: true,
        error: null
      };
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
        ...state,
        isConnecting: false,
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

      const sdkOptions: SDKOptions = {
        appName: 'Dude Box',
        chainId: Number(process.env.NEXT_PUBLIC_BASE_CHAIN_ID) || 84532,
        rpcUrl: process.env.NEXT_PUBLIC_BASE_MAINNET_RPC || ''
      };

      const sdk = new CoinbaseWalletSDK(sdkOptions);
      const provider = sdk.makeWeb3Provider() as unknown as CoinbaseWalletProvider;

      const accountsResponse = await provider.request({
        method: 'eth_requestAccounts'
      }) as string[];

      if (!accountsResponse || !accountsResponse[0]) {
        throw new Error('No account selected');
      }

      const walletType = detectWalletType(accountsResponse[0]);

      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ 
          chainId: `0x${Number(process.env.NEXT_PUBLIC_BASE_CHAIN_ID || 84532).toString(16)}` 
        }]
      });

      dispatch({ 
        type: 'CONNECT_SUCCESS', 
        address: accountsResponse[0],
        walletType,
        provider
      });

      console.log('Connected with wallet type:', walletType, 'Address:', accountsResponse[0]);

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
        state.provider.disconnect?.();
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