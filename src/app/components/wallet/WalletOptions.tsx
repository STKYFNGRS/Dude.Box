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

export const WalletOptions = () => {
  const { state, connectSmartWallet, connectRegularWallet } = useWeb3();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">
      {/* Smart Wallet Option */}
      <Card 
        className={`relative group transition-all cursor-pointer bg-gray-800/50 border-gray-700 hover:border-blue-500 ${
          state.walletType !== 'none' ? 'opacity-50 pointer-events-none' : ''
        }`}
        onClick={connectSmartWallet}
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

      {/* Regular Wallet Option */}
      <Card 
        className={`relative group transition-all cursor-pointer bg-gray-800/50 border-gray-700 hover:border-orange-500 ${
          state.walletType !== 'none' ? 'opacity-50 pointer-events-none' : ''
        }`}
        onClick={connectRegularWallet}
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

      {state.error && (
        <div className="col-span-2 text-center text-red-400 bg-red-900/20 p-4 rounded-lg">
          {state.error}
        </div>
      )}
    </div>
  );
};