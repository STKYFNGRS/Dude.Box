import { createPublicClient, createWalletClient, custom, http, type PublicClient, type WalletClient } from 'viem';
import type { CoinbaseWalletProvider } from '@coinbase/wallet-sdk';
import { DEFAULT_CHAIN } from '../config/web3';

type EthereumProvider = CoinbaseWalletProvider & {
  close?: () => Promise<void>;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
};

type Web3ServiceResponse = {
  address: string;
  walletClient: WalletClient;
  publicClient: PublicClient;
};

class Web3Service {
  private provider: EthereumProvider | null = null;
  private publicClient: PublicClient;

  constructor() {
    this.publicClient = createPublicClient({
      chain: DEFAULT_CHAIN,
      transport: http(),
    });
  }

  async connect(): Promise<Web3ServiceResponse> {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('No Web3 provider found');
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const walletClient = createWalletClient({
        chain: DEFAULT_CHAIN,
        transport: custom(window.ethereum),
      });

      await this.switchChain(DEFAULT_CHAIN.id);

      this.provider = window.ethereum as EthereumProvider;

      return {
        address: accounts[0] as string,
        walletClient,
        publicClient: this.publicClient,
      };
    } catch (error) {
      console.error('Wallet connection error:', error);
      throw error;
    }
  }

  async switchChain(chainId: number): Promise<void> {
    if (!this.provider) throw new Error('No provider available');

    try {
      await this.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error) {
      if ((error as { code: number }).code === 4902) {
        await this.provider.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${chainId.toString(16)}`,
            chainName: DEFAULT_CHAIN.name,
            nativeCurrency: DEFAULT_CHAIN.nativeCurrency,
            rpcUrls: [DEFAULT_CHAIN.rpcUrls.default.http[0]],
            blockExplorerUrls: [DEFAULT_CHAIN.blockExplorers?.default.url],
          }],
        });
      } else {
        throw error;
      }
    }
  }

  async disconnect(): Promise<void> {
    if (this.provider?.close) {
      await this.provider.close();
    }
    this.provider = null;
  }

  setupEventListeners(handlers: {
    onAccountsChanged: (accounts: string[]) => void;
    onChainChanged: (chainId: string) => void;
    onDisconnect: () => void;
  }): (() => void) | undefined {
    if (!this.provider) return;

    this.provider.on('accountsChanged', handlers.onAccountsChanged);
    this.provider.on('chainChanged', handlers.onChainChanged);
    this.provider.on('disconnect', handlers.onDisconnect);

    return () => {
      this.provider?.removeListener('accountsChanged', handlers.onAccountsChanged);
      this.provider?.removeListener('chainChanged', handlers.onChainChanged);
      this.provider?.removeListener('disconnect', handlers.onDisconnect);
    };
  }
}

export const web3Service = new Web3Service();