'use client';

import React from 'react';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { OnchainLayout } from '../components/layouts/OnchainLayout';
import { CartProvider } from '../components/CartContext';

export default function Web3Page() {
  const handleConnect = (address: string) => {
    console.log('Wallet connected:', address);
  };

  return (
    <CartProvider>
      <OnchainLayout>
        <div className="w-full min-h-screen bg-gradient-to-b from-black to-gray-900">
          <div className="flex flex-col items-center justify-center w-full">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center max-w-7xl mx-auto pt-32">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                  Onchain Experience
                </h1>
                <p className="text-xl sm:text-2xl mb-10 text-gray-200 max-w-3xl text-center">
                  Welcome to the blockchain side of Dude Box. We&apos;re building something special here.
                </p>
                
                <div className="w-full max-w-md p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl mt-8">
                  <h2 className="text-2xl font-bold text-white mb-6 text-center">Connect Your Wallet</h2>
                  
                </div>
              </div>
            </div>
            
            <SpeedInsights />
            <Analytics />
          </div>
        </div>
      </OnchainLayout>
    </CartProvider>
  );
}