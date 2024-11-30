'use client';

import { Mail, Wallet } from 'lucide-react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const WalletOptions = () => {
  const { address } = useAccount();
  const { connect, connectors, isLoading } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = async (isSmartWallet = false) => {
    const connector = connectors[0];
    if (connector) {
      try {
        await connect({ 
          connector,
          chainId: 84532, // Base Sepolia testnet
          ...(isSmartWallet ? { headlessMode: true } : {})
        });
      } catch (error) {
        console.error('Connection error:', error);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">
      {/* Smart Wallet Option */}
      <Card 
        className={`relative group transition-all cursor-pointer
          ${!address ? 'bg-gray-800/50 border-gray-700 hover:border-blue-500' : 
            'opacity-50 cursor-not-allowed bg-gray-800/20 border-gray-800'}
        `}
        onClick={() => !address && !isLoading && handleConnect(true)}
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
        className={`relative group transition-all cursor-pointer
          ${!address ? 'bg-gray-800/50 border-gray-700 hover:border-orange-500' : 
            'opacity-50 cursor-not-allowed bg-gray-800/20 border-gray-800'}
        `}
        onClick={() => !address && !isLoading && handleConnect(false)}
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

      {address && (
        <div className="col-span-2 text-center">
          <button
            onClick={() => disconnect()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}

      {isLoading && (
        <div className="col-span-2 text-center text-blue-400 bg-blue-900/20 p-4 rounded-lg">
          Connecting...
        </div>
      )}
    </div>
  );
};