'use client';

import React from 'react';
import Header from '../Header';
import { OnchainKitProvider } from '@coinbase/onchainkit';

const onchainConfig = {
  rpcUrl: process.env.NEXT_PUBLIC_BASE_MAINNET_RPC,
  chainId: Number(process.env.NEXT_PUBLIC_BASE_MAINNET_CHAIN_ID),
  walletConnect: {
    projectId: process.env.NEXT_PUBLIC_COINBASE_SMART_WALLET_CLIENT_ID,
    metadata: {
      name: 'Dude Box',
      description: 'Onchain Experience',
      url: process.env.NEXT_PUBLIC_APP_URL,
      icons: ['/Dude logo 3.jpg']
    }
  }
};

export function OnchainLayout({ children }: { children: React.ReactNode }) {
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