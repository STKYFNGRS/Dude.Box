import { type PublicClient, type WalletClient } from 'viem';

export type ConnectedWallet = {
  address: string;
  chain: {
    id: number;
    name: string;
  };
};

export type Web3ContextState = {
  wallet: ConnectedWallet | null;
  isConnecting: boolean;
  connectionError: string | null;
  publicClient: PublicClient | null;
  walletClient: WalletClient | null;
};

export type Web3ContextType = {
  state: Web3ContextState;
  connectTraditionalWallet: () => Promise<void>;
  connectSmartWallet: (provider: any) => Promise<void>;
  disconnect: () => Promise<void>;
  switchChain: (chainId: number) => Promise<void>;
};