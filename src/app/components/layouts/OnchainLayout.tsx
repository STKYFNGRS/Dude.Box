'use client';

import React from 'react';
import Header from '../Header';
import { OnchainKitProvider } from '@coinbase/onchainkit';

const onchainConfig = {
  wallets: ['coinbase'],
  chains: [{
    id: Number(process.env.NEXT_PUBLIC_BASE_MAINNET_CHAIN_ID),
    name: 'Base',
    rpcUrl: process.env.NEXT_PUBLIC_BASE_MAINNET_RPC || '',
  }],
  appName: 'Dude Box',
  appIcon: '/Dude logo 3.jpg', // Path to app icon
  theme: 'dark',
};

export function OnchainLayout({ children }: { children: React.ReactNode }) {
  console.log('Rendering OnchainLayout with config:', onchainConfig);
  
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />
      <main className="flex-grow flex flex-col">
        <OnchainKitProvider config={onchainConfig}>
          {children}
        </OnchainKitProvider>
      </main>
    </div>
  );
}