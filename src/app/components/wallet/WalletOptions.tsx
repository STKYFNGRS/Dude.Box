'use client';

import { Mail, Wallet } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useWeb3 } from '@/app/context/Web3Context';
import { createCoinbaseWalletSDK } from '@coinbase/wallet-sdk';
import type { CoinbaseWalletProvider } from '@coinbase/wallet-sdk';
import { useState } from 'react';

type WalletType = 'none' | 'smart' | 'traditional';

export const WalletOptions = () => {
  const { connectSmartWallet, connectTraditionalWallet, state } = useWeb3();
  const [activeWallet, setActiveWallet] = useState<WalletType>('none');

  const handleSmartWallet = async () => {
    if (activeWallet !== 'none') return;
    try {
      setActiveWallet('smart');
      const sdk = createCoinbaseWalletSDK({
        appName: "Dude Box",
        appLogoUrl: "/Dude logo 3.jpg",
        appChainIds: [84532],
        preference: {
          options: "smartWalletOnly",
          attribution: { auto: true }
        }
      });

      const provider = sdk.getProvider() as CoinbaseWalletProvider;
      await connectSmartWallet(provider);
    } catch (error) {
      console.error('Smart wallet connection error:', error);
      setActiveWallet('none');
    }
  };

  const handleTraditionalWallet = async () => {
    if (activeWallet !== 'none') return;
    try {
      setActiveWallet('traditional');
      await connectTraditionalWallet();
    } catch (error) {
      console.error('Traditional wallet connection error:', error);
      setActiveWallet('none');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">
      {/* Smart Wallet Option */}
      <Card 
        className={`relative group transition-all cursor-pointer
          ${activeWallet === 'none' ? 'bg-gray-800/50 border-gray-700 hover:border-blue-500' : 
            activeWallet === 'smart' ? 'bg-blue-900/20 border-blue-500' : 'opacity-50 cursor-not-allowed bg-gray-800/20 border-gray-800'}
        `}
        onClick={handleSmartWallet}
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

      {/* Traditional Wallet Option */}
      <Card 
        className={`relative group transition-all cursor-pointer
          ${activeWallet === 'none' ? 'bg-gray-800/50 border-gray-700 hover:border-orange-500' : 
            activeWallet === 'traditional' ? 'bg-orange-900/20 border-orange-500' : 'opacity-50 cursor-not-allowed bg-gray-800/20 border-gray-800'}
        `}
        onClick={handleTraditionalWallet}
      >
        <CardHeader>
          <div className="flex items-center gap-3">
            <Wallet className="w-8 h-8 text-orange-400" />
            <div>
              <CardTitle className="text-xl text-white">Connect Wallet</CardTitle>
              <CardDescription className="text-gray-400">Coinbase Wallet or MetaMask</CardDescription>
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

      {state.connectionError && (
        <div className="col-span-2 text-center text-red-400 bg-red-900/20 p-4 rounded-lg">
          {state.connectionError}
        </div>
      )}
    </div>
  );
};