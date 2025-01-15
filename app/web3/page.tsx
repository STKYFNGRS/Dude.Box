'use client';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Suspense } from 'react';
import Web3Footer from './components/layout/web3-footer';
import Web3Header from './components/layout/web3-header';
import Web3Hero from './components/Web3Hero';
import NFTValueProps from './components/NFTValueProps';
import LegalDisclaimer from './components/LegalDisclaimer';
import MintInterface from './components/MintInterface';

export default function Web3Page() {
  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-b from-black to-gray-900">
      <Web3Header />
      
      {/* Main Content */}
      <main className="flex-grow overflow-y-auto">
        {/* Hero Section */}
        <Web3Hero />

        {/* Mint Interface Section */}
        <div className="w-full py-16">
          <div className="max-w-3xl mx-auto px-4">
            <Suspense fallback={<div className="text-center text-gray-400">Loading...</div>}>
              <MintInterface />
            </Suspense>
          </div>
        </div>

        {/* Value Proposition Section */}
        <NFTValueProps />

        {/* Legal Disclaimer */}
        <LegalDisclaimer />
      </main>

      <Web3Footer />
      <Analytics />
      <SpeedInsights />
    </div>
  );
}