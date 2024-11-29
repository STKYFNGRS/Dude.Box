import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { APP_CONFIG, COINBASE_CONFIG, DEFAULT_CHAIN } from '../config/web3';
import type { ConnectedWallet } from '../types/web3';

class Web3Service {
  private sdk: CoinbaseWalletSDK | null = null;
  private provider: any = null;

  initialize() {
    if (!this.sdk) {
      this.sdk = new CoinbaseWalletSDK({
        appName: APP_CONFIG.name,
        appLogoUrl: APP_CONFIG.icon,
        darkMode: COINBASE_CONFIG.darkMode,
      });
    }
    return this.sdk;
  }

  async connect(): Promise<{
    wallet: ConnectedWallet;
    publicClient: any;
    walletClient: any;
  }> {
    try {
      const sdk = this.initialize();
      this.provider = sdk.makeWeb3Provider(
        DEFAULT_CHAIN.rpcUrls[0],
        DEFAULT_CHAIN.id
      );

      const accounts = await this.provider.request({
        method: 'eth_requestAccounts',
      });

      const chainId = await this.provider.request({
        method: 'eth_chainId',
      });

      // Create viem clients
      const publicClient = createPublicClient({
        transport: http(DEFAULT_CHAIN.rpcUrls[0]),
      });

      const walletClient = createWalletClient({
        transport: custom(this.provider),
      });

      return {
        wallet: {
          address: accounts[0],
          chain: {
            id: parseInt(chainId, 16),
            name: DEFAULT_CHAIN.name,
          },
        },
        publicClient,
        walletClient,
      };
    } catch (error) {
      console.error('Wallet connection error:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.provider) {
      await this.provider.close();
      this.provider = null;
    }
  }

  async switchChain(chainId: number): Promise<void> {
    if (!this.provider) throw new Error('Wallet not connected');

    try {
      await this.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: any) {
      // Chain doesn't exist, add it
      if (error.code === 4902) {
        const chain = Object.values(SUPPORTED_CHAINS).find(
          (chain) => chain.id === chainId
        );
        if (!chain) throw new Error('Unsupported chain');

        await this.provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${chainId.toString(16)}`,
              chainName: chain.name,
              nativeCurrency: chain.nativeCurrency,
              rpcUrls: chain.rpcUrls,
              blockExplorerUrls: [chain.blockExplorers.default.url],
            },
          ],
        });
      } else {
        throw error;
      }
    }
  }

  getProvider() {
    return this.provider;
  }
}

export const web3Service = new Web3Service();