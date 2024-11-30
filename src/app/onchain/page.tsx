'use client';

import { ClientLayout } from '@/app/components/Client-Layout';
import { Analytics } from "@vercel/analytics/react";
import { useWeb3 } from '../context/Web3Context';
import { useCallback } from 'react';
import Image from 'next/image';

const buttonStyles = {
  background: 'transparent',
  border: '1px solid transparent',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: 200,
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'bold',
  fontSize: 18,
  backgroundColor: '#0052FF',
  paddingLeft: 15,
  paddingRight: 30,
  borderRadius: 10,
};

export default function Onchain() {
  const { isConnected, address, connect, disconnect } = useWeb3();

  const handleDisconnect = useCallback(() => {
    disconnect();
  }, [disconnect]);

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
              <div className="flex justify-center">
                <button 
                  style={buttonStyles}
                  onClick={connect}
                >
                  Create Wallet
                </button>
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
                    onClick={handleDisconnect}
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