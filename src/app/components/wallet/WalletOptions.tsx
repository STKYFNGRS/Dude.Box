// src/app/components/wallet/WalletOptions.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Wallet } from 'lucide-react';
import { useState } from 'react';

export const WalletOptions = () => {
  const [error, setError] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<'none' | 'smart' | 'regular'>('none');

  const handleSmartWalletConnect = async () => {
    try {
      setError(null);
      setWalletType('smart');
      // Smart wallet connection logic here
    } catch (err) {
      setError('Failed to connect smart wallet');
      setWalletType('none');
    }
  };

  const handleRegularWalletConnect = async () => {
    try {
      setError(null);
      setWalletType('regular');
      // Regular wallet connection logic here
    } catch (err) {
      setError('Failed to connect regular wallet');
      setWalletType('none');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">
      <Card 
        className={`relative group transition-all cursor-pointer bg-gray-800/50 border-gray-700 hover:border-blue-500 ${
          walletType !== 'none' ? 'opacity-50 pointer-events-none' : ''
        }`}
        onClick={handleSmartWalletConnect}
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

      <Card 
        className={`relative group transition-all cursor-pointer bg-gray-800/50 border-gray-700 hover:border-orange-500 ${
          walletType !== 'none' ? 'opacity-50 pointer-events-none' : ''
        }`}
        onClick={handleRegularWalletConnect}
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

      {error && (
        <div className="col-span-2 text-center text-red-400 bg-red-900/20 p-4 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};