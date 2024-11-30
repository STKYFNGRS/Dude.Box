'use client';

import { Mail, Wallet } from 'lucide-react';
import { createCoinbaseWalletSDK } from '@coinbase/wallet-sdk';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const WalletOptions = () => {
  const createWallet = async () => {
    const sdk = new createCoinbaseWalletSDK({
      appName: 'Dude.Box',
      appLogoUrl: '/logo.png',
      appChainIds: [84532], // Base Sepolia
    });

    const provider = sdk.getProvider();
    
    try {
      const [address] = await provider.request({
        method: 'eth_requestAccounts',
      });
      console.log('Connected:', address);
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">
      {/* Smart Wallet Option */}
      <Card 
        className="relative group transition-all cursor-pointer bg-gray-800/50 border-gray-700 hover:border-blue-500"
        onClick={createWallet}
      >
        <CardHeader>
          <div className="flex items-center gap-3">
            <Mail className="w-8 h-8 text-blue-400" />
            <div>
              <CardTitle className="text-xl text-white">Smart Wallet</CardTitle>
              <CardDescription className="text-gray-400">Easy Web3 Onboarding</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• No Extension Required</li>
            <li>• Perfect for New Users</li>
            <li>• One-Click Setup</li>
          </ul>
        </CardContent>
      </Card>

      {/* Regular Wallet Option (disabled for now) */}
      <Card className="opacity-50 cursor-not-allowed bg-gray-800/20 border-gray-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Wallet className="w-8 h-8 text-orange-400" />
            <div>
              <CardTitle className="text-xl text-white">Connect Wallet</CardTitle>
              <CardDescription className="text-gray-400">Coming Soon</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• Use Existing Wallet</li>
            <li>• Connect with Extension</li>
            <li>• Full Web3 Features</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};