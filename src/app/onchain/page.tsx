'use client';

import { ClientLayout } from '@/app/components/Client-Layout';
import { Analytics } from "@vercel/analytics/react";
import { useWeb3 } from '../context/Web3Context';
import { useCallback } from 'react';
import Image from 'next/image';

export default function Onchain() {
  const { state, connectSmartWallet, disconnect } = useWeb3();

  const handleConnect = useCallback(() => {
    connectSmartWallet();
  }, [connectSmartWallet]);

  const handleDisconnect = useCallback(() => {
    disconnect();
  }, [disconnect]);

  return (
    <ClientLayout>
      {/* Main content area excluding footer */}
      <div className="relative flex-1 min-h-[calc(100vh-64px)]">
        {/* Background Image - now contained within main content */}
        <div className="absolute inset-0">
          <Image
            src="/hunt pick 2.png"
            alt="Background"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-gray-900/80" />
        </div>

        {/* Page Content */}
        <div className="relative z-10">
          {/* Hero Section */}
          <div className="pt-32 md:pt-40 pb-12">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
                  Welcome to the future, dude
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                  Join the decentralized revolution. Connect your wallet to explore the boundless possibilities of Web3 - where innovation meets community.
                </p>
              </div>
            </div>
          </div>

          {/* Wallet Section */}
          <div className="w-full max-w-7xl mx-auto px-4 py-8">
            {!state.isConnected ? (
              <div className="mb-8 p-8 bg-gray-800/50 rounded-xl border border-gray-700 backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-4 text-center">Connect Your Wallet</h2>
                <p className="text-gray-300 mb-8 text-center">Choose between Smart Wallet or browser extension in the next step</p>
                <div className="flex justify-center">
                  <button
                    onClick={handleConnect}
                    className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition-colors text-lg"
                  >
                    Connect Wallet
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-gray-800/50 rounded-xl border border-gray-700 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Connected Wallet</h3>
                    <p className="text-gray-300">
                      Address: <span className="font-mono">{`${state.address?.slice(0, 6)}...${state.address?.slice(-4)}`}</span>
                    </p>
                    <p className="text-gray-300">
                      Type: <span className="capitalize">{state.walletType}</span>
                    </p>
                  </div>
                  <button
                    onClick={handleDisconnect}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    Disconnect Wallet
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <Analytics />
      </div>
    </ClientLayout>
  );
}