'use client';

import React from 'react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  // Placeholder functions for wallet actions
  const initializeWallet = () => {
    console.log("Initializing wallet...");
    // Add actual wallet initialization logic here
  };

  const disconnectWallet = () => {
    console.log("Disconnecting wallet...");
    // Add actual wallet disconnection logic here
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header initializeWallet={initializeWallet} disconnectWallet={disconnectWallet} />
      <main className="flex-grow flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}
