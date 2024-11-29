'use client';

import { ClientLayout } from '@/app/components/Client-Layout';
import { Analytics } from "@vercel/analytics/react";
import { useState } from 'react';
import { BarChart3, ImageIcon, Coins, Wallet } from 'lucide-react';
import { HeroSection } from './components/HeroSection';
import { WalletOptions } from '../components/wallet/WalletOptions';
import { WalletInfo } from '../components/wallet/WalletInfo';
import { ChainSelector } from '../components/wallet/ChainSelector';
import { useWeb3 } from '../context/Web3Context';
import { TabContent } from './components/TabContent';

export default function Onchain() {
  const [activeTab, setActiveTab] = useState('overview');
  const { state } = useWeb3();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'nft', label: 'NFT', icon: ImageIcon },
    { id: 'token', label: 'Token', icon: Coins },
    { id: 'wallet', label: 'Wallet', icon: Wallet }
  ];

  return (
    <ClientLayout>
      <div className="relative z-0 pt-24 min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
        <HeroSection />
        
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
          {!state.wallet ? (
            <div className="mb-8 p-8 bg-gray-800/50 rounded-xl border border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-center">Choose Your Wallet</h2>
              <p className="text-gray-300 mb-8 text-center">Select how you&apos;d like to connect to the Dude Box Web3 experience</p>
              <WalletOptions />
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <WalletInfo />
                  <ChainSelector />
                </div>

                {/* Navigation Tabs */}
                <div className="flex flex-wrap gap-4 mb-8">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                        ${activeTab === tab.id 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                    >
                      <tab.icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <TabContent activeTab={activeTab} />
              </div>
            </>
          )}
        </div>
        
        <Analytics />
      </div>
    </ClientLayout>
  );
}