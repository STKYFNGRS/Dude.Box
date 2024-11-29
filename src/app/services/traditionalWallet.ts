import { createPublicClient, createWalletClient, custom, http, type EIP1193Provider } from 'viem';
import { DEFAULT_CHAIN } from '../config/web3';

class TraditionalWalletService {
  private provider: EIP1193Provider | null = null;
  private publicClient;

  constructor() {
    this.publicClient = createPublicClient({
      chain: DEFAULT_CHAIN,
      transport: http(),
    });
  }

  async connect() {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('No Web3 provider found');
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      // Create wallet client
      const walletClient = createWalletClient({
        chain: DEFAULT_CHAIN,
        transport: custom(window.ethereum),
      });

      // Switch to the correct chain
      await this.switchChain(DEFAULT_CHAIN.id);

      this.provider = window.ethereum;

      return {
        address: accounts[0],
        walletClient,
        publicClient: this.publicClient,
      };
    } catch (error: unknown) {
      console.error('Wallet connection error:', error);
      throw error;
    }
  }

  async switchChain(chainId: number) {
    if (!this.provider) throw new Error('No provider available');

    try {
      await this.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: unknown) {
      // Chain doesn't exist, add it
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

  async disconnect() {
    this.provider = null;
  }

  setupEventListeners(handlers: {
    onAccountsChanged: (accounts: string[]) => void;
    onChainChanged: (chainId: string) => void;
    onDisconnect: () => void;
  }) {
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

export const traditionalWalletService = new TraditionalWalletService();