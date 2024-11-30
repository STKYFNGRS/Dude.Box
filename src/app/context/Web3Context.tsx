'use client';

import { 
  createContext, 
  useContext, 
  useReducer, 
  useCallback,
  ReactNode 
} from 'react';
import { useConnect, useDisconnect } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';

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
  const { connectAsync, connectors } = useConnect();
  const { disconnectAsync } = useDisconnect();

  const connectSmartWallet = useCallback(async () => {
    dispatch({ type: 'START_CONNECTING' });

    try {
      const connector = connectors[0]; // Coinbase Wallet connector
      const result = await connectAsync({ connector });
      
      dispatch({ 
        type: 'CONNECTION_SUCCESSFUL', 
        address: result.accounts[0],
        walletType: 'smart'
      });
    } catch (err) {
      console.error('Smart wallet connection failed:', err);
      dispatch({ 
        type: 'CONNECTION_FAILED', 
        error: err instanceof Error ? err.message : 'Failed to connect smart wallet'
      });
    }
  }, [connectors, connectAsync]);

  const connectRegularWallet = useCallback(async () => {
    dispatch({ type: 'START_CONNECTING' });

    try {
      const connector = connectors[0]; // Coinbase Wallet connector
      const result = await connectAsync({ connector });
      
      dispatch({ 
        type: 'CONNECTION_SUCCESSFUL', 
        address: result.accounts[0],
        walletType: 'regular'
      });
    } catch (err) {
      console.error('Regular wallet connection failed:', err);
      dispatch({ 
        type: 'CONNECTION_FAILED', 
        error: err instanceof Error ? err.message : 'Failed to connect wallet'
      });
    }
  }, [connectors, connectAsync]);

  const disconnect = useCallback(async () => {
    try {
      await disconnectAsync();
      dispatch({ type: 'DISCONNECT' });
    } catch (err) {
      console.error('Error disconnecting:', err);
    }
  }, [disconnectAsync]);

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