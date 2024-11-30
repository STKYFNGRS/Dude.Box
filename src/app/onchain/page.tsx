'use client';

import { ClientLayout } from '@/app/components/Client-Layout';
import { Analytics } from "@vercel/analytics/react";
import { HeroSection } from './components/HeroSection';
import { WalletOptions } from '../components/wallet/WalletOptions';
import { TabContent } from './components/TabContent';
import { useWeb3 } from '@/app/context/Web3Context';

export default function Onchain() {
  const { isConnected, address } = useWeb3();

  return (
    <ClientLayout>
      <div className="relative z-0 pt-24 min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
        <HeroSection />
        
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
          {!isConnected ? (
            <div className="mb-8 p-8 bg-gray-800/50 rounded-xl border border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-center">Create Your Smart Wallet</h2>
              <p className="text-gray-300 mb-8 text-center">Get started with your Web3 experience in seconds</p>
              <WalletOptions />
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-xl font-bold text-blue-400">Connected Wallet</h2>
                <p className="font-mono text-sm text-gray-400 mt-2">{address}</p>
              </div>
              <TabContent activeTab="wallet" />
            </>
          )}
        </div>
        
        <Analytics />
      </div>
    </ClientLayout>
  );
}