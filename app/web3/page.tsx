'use client';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Suspense } from 'react';
import TabInterface from './components/TabInterface';
import Web3Footer from './components/layout/web3-footer';
import Web3Header from './components/layout/web3-header';

export default function Web3Page() {
  return (
    <div className="fixed inset-0 flex flex-col">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-gray-900 to-black"></div>
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"></div>
      </div>
      <Web3Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-3xl mx-auto text-center text-white space-y-8">
          <h1 className="text-4xl font-bold mb-6" style={{ color: '#A020F0' }}>
            
          </h1>
          <Suspense fallback={<div>Loading...</div>}>
            <TabInterface />
          </Suspense>
        </div>
      </main>
      <Web3Footer />
      <Analytics />
      <SpeedInsights />
    </div>
  );
}