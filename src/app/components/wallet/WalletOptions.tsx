'use client';

import { ShieldCheck, Wallet, ArrowRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useWeb3 } from '@/app/context/Web3Context';
import { createCoinbaseWalletSDK } from '@coinbase/wallet-sdk';

export const WalletOptions = () => {
  const { state, connectSmartWallet, connectTraditionalWallet } = useWeb3();

  const handleSmartWallet = async () => {
    try {
      const sdk = createCoinbaseWalletSDK({
        appName: "Dude Box",
        appLogoUrl: "/Dude logo 3.jpg",
        appChainIds: [84532], // Base Sepolia
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
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">
      {/* Smart Wallet Option */}
      <Card 
        className={`relative group hover:border-blue-500 transition-all cursor-pointer bg-gray-800/50 border-gray-700 ${
          state.isConnecting ? 'opacity-50 pointer-events-none' : ''
        }`}
        onClick={handleSmartWallet}
      >
        <CardHeader>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-blue-400" />
            <div>
              <CardTitle className="text-xl text-white">Smart Wallet</CardTitle>
              <CardDescription className="text-gray-400">Simple & Easy Web3</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {state.connectionError ? (
            <div className="text-red-400 text-sm mb-4">
              {state.connectionError}
            </div>
          ) : null}
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-blue-400" />
              {state.isConnecting ? 'Connecting...' : 'Create or Connect Smart Wallet'}
            </li>
            <li className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-blue-400" />
              Simplified Web3 Experience
            </li>
            <li className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-blue-400" />
              No Extension Required
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Traditional Wallet Option */}
      <Card 
        className={`relative group hover:border-blue-500 transition-all cursor-pointer bg-gray-800/50 border-gray-700 ${
          state.isConnecting ? 'opacity-50 pointer-events-none' : ''
        }`}
        onClick={connectTraditionalWallet}
      >
        <CardHeader>
          <div className="flex items-center gap-3">
            <Wallet className="w-8 h-8 text-blue-400" />
            <div>
              <CardTitle className="text-xl text-white">Connect Wallet</CardTitle>
              <CardDescription className="text-gray-400">Use existing Web3 wallet</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {state.connectionError && (
            <div className="text-red-400 text-sm mb-4">
              {state.connectionError}
            </div>
          )}
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-blue-400" />
              {state.isConnecting ? 'Connecting...' : 'MetaMask & Other Wallets'}
            </li>
            <li className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-blue-400" />
              Coinbase Wallet
            </li>
            <li className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-blue-400" />
              Full Web3 functionality
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};