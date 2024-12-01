'use client';

import { ClientLayout } from '@/app/components/Client-Layout';
import { Analytics } from "@vercel/analytics/react";
import { useWeb3 } from '../context/Web3Context';
import Image from 'next/image';

export default function Onchain() {
  const { isConnected, address, connect, disconnect } = useWeb3();

  return (
    <ClientLayout>
      <div className="relative flex-1 min-h-[calc(100vh-64px)]">
        {/* Background Image */}
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
                  Join the decentralized revolution. Connect your wallet to explore the boundless possibilities of Web3.
                </p>
              </div>
            </div>
          </div>

          {/* Wallet Section */}
          <div className="w-full max-w-7xl mx-auto px-4 py-8">
            {!isConnected ? (
              <div className="mb-8 p-8 bg-gray-800/50 rounded-xl border border-gray-700 backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-4 text-center">Get Started with Web3</h2>
                <div className="max-w-xl mx-auto space-y-8">
                  {/* Create Wallet Section */}
                  <div className="text-center p-6 rounded-lg border border-purple-500/20 bg-purple-500/5">
                    <h3 className="text-lg font-semibold mb-2">New to Web3?</h3>
                    <p className="text-gray-400 mb-4">Create your first smart wallet - no extension needed.</p>
                    <button
                      onClick={connect}
                      className="w-full sm:w-auto px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition-colors text-lg"
                    >
                      Create Wallet
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-gray-800/50 rounded-xl border border-gray-700 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Connected Wallet</h3>
                    <p className="text-gray-300">
                      Address: <span className="font-mono">{`${address?.slice(0, 6)}...${address?.slice(-4)}`}</span>
                    </p>
                  </div>
                  <button
                    onClick={disconnect}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    Disconnect
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