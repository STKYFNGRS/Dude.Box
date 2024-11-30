'use client';

import { ClientLayout } from '@/app/components/Client-Layout';
import { Analytics } from "@vercel/analytics/react";
import { WalletOptions } from '../components/wallet/WalletOptions';
import { useWeb3 } from '../context/Web3Context';

export default function Onchain() {
  const { state } = useWeb3();

  return (
    <ClientLayout>
      <div className="relative z-0 pt-24 min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
          {!state.isConnected ? (
            <div className="mb-8 p-8 bg-gray-800/50 rounded-xl border border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-center">Choose Your Wallet</h2>
              <p className="text-gray-300 mb-8 text-center">Select how you'd like to connect to the Dude Box Web3 experience</p>
              <WalletOptions />
            </div>
          ) : (
            <div className="p-8 bg-gray-800/50 rounded-xl border border-gray-700">
              <p className="text-center text-gray-300">
                Connected Address: <span className="font-mono">{`${state.address?.slice(0, 6)}...${state.address?.slice(-4)}`}</span>
              </p>
            </div>
          )}
        </div>
        <Analytics />
      </div>
    </ClientLayout>
  );
}