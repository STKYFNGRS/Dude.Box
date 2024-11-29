'use client';

import { ShieldCheck, Wallet } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useWeb3 } from '@/app/context/Web3Context';
import { createCoinbaseWalletSDK } from '@coinbase/wallet-sdk';
import { useState } from 'react';

type WalletType = 'none' | 'coinbase' | 'metamask';

export const WalletOptions = () => {
  const { connectSmartWallet, connectTraditionalWallet, state } = useWeb3();
  const [activeWallet, setActiveWallet] = useState<WalletType>('none');

  const handleCoinbaseWallet = async () => {
    if (activeWallet !== 'none') return;
    try {
      setActiveWallet('coinbase');
      const sdk = createCoinbaseWalletSDK({
        appName: "Dude Box",
        appLogoUrl: "/Dude logo 3.jpg",
        appChainIds: [84532],
        preference: {
          options: "smartWalletOnly",
          attribution: {
            auto: true,
          }
        }
      });

      const provider = sdk.getProvider();
      await connectSmartWallet(provider);
    } catch (error) {
      console.error('Smart wallet connection error:', error);
      setActiveWallet('none');
    }
  };

  const handleMetaMask = async () => {
    if (activeWallet !== 'none') return;
    try {
      setActiveWallet('metamask');
      await connectTraditionalWallet();
    } catch (error) {
      console.error('MetaMask connection error:', error);
      setActiveWallet('none');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">
      {/* Coinbase Option */}
      <Card 
        className={`relative group transition-all cursor-pointer
          ${activeWallet === 'none' ? 'bg-gray-800/50 border-gray-700 hover:border-blue-500' : 
            activeWallet === 'coinbase' ? 'bg-blue-900/20 border-blue-500' : 'opacity-50 cursor-not-allowed bg-gray-800/20 border-gray-800'}
        `}
        onClick={handleCoinbaseWallet}
      >
        <CardHeader>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-blue-400" />
            <div>
              <CardTitle className="text-xl text-white">Coinbase Wallet</CardTitle>
              <CardDescription className="text-gray-400">Smart Wallet Experience</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• Simple Web3 Experience</li>
            <li>• Built for New Users</li>
            <li>• Secure & Non-Custodial</li>
          </ul>
        </CardContent>
      </Card>

      {/* MetaMask Option */}
      <Card 
        className={`relative group transition-all cursor-pointer
          ${activeWallet === 'none' ? 'bg-gray-800/50 border-gray-700 hover:border-orange-500' : 
            activeWallet === 'metamask' ? 'bg-orange-900/20 border-orange-500' : 'opacity-50 cursor-not-allowed bg-gray-800/20 border-gray-800'}
        `}
        onClick={handleMetaMask}
      >
        <CardHeader>
          <div className="flex items-center gap-3">
            <Wallet className="w-8 h-8 text-orange-400" />
            <div>
              <CardTitle className="text-xl text-white">MetaMask</CardTitle>
              <CardDescription className="text-gray-400">Advanced Web3 Wallet</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• Full Web3 Features</li>
            <li>• Multi-Chain Support</li>
            <li>• Self-Custodial</li>
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