'use client';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Suspense } from 'react';
import Web3Footer from './components/layout/web3-footer';
import Web3Header from './components/layout/web3-header';

export default function Web3Page() {
  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-b from-black to-gray-900">
      <Web3Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-3xl mx-auto text-center text-white space-y-8">
          <h1 className="text-4xl font-bold mb-6" style={{ color: '#A020F0' }}>Web3</h1>
          <p className="text-xl leading-relaxed">
            Web3 Experience Under Construction
          </p>
        </div>
      </main>
      <Web3Footer />
      <Analytics />
      <SpeedInsights />
    </div>
  );
}