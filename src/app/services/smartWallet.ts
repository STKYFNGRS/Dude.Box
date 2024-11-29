import { createPublicClient, http } from 'viem';
import { APP_CONFIG, DEFAULT_CHAIN } from '../config/web3';

interface SmartWalletConfig {
  apiKey: string;
  appName: string;
  network: string;
}

class SmartWalletService {
  private config: SmartWalletConfig;
  private publicClient;

  constructor() {
    this.config = {
      apiKey: APP_CONFIG.apiKey,
      appName: APP_CONFIG.name,
      network: DEFAULT_CHAIN.rpcUrls.default.http[0],
    };

    this.publicClient = createPublicClient({
      chain: DEFAULT_CHAIN,
      transport: http(),
    });
  }

  async createSmartWallet(email: string) {
    try {
      // This will need to be updated with actual Coinbase Smart Wallet SDK methods
      // once we have access to the package
      const response = await fetch('https://api.coinbase.com/v1/smart-wallet/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          email,
          app_name: this.config.appName,
          network: this.config.network,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create smart wallet');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Smart wallet creation error:', error);
      throw error;
    }
  }

  async authenticateWithEmail(email: string) {
    try {
      // Placeholder for email authentication
      // Will be replaced with actual Coinbase SDK methods
      const response = await fetch('https://api.coinbase.com/v1/smart-wallet/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }

  async getSmartWalletInfo(address: string) {
    try {
      const balance = await this.publicClient.getBalance({
        address: address as `0x${string}`,
      });

      return {
        balance,
        address,
        chain: DEFAULT_CHAIN,
      };
    } catch (error) {
      console.error('Failed to get wallet info:', error);
      throw error;
    }
  }
}

export const smartWalletService = new SmartWalletService();