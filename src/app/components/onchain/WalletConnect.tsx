'use client';

import React from 'react';
import { ConnectWallet } from '@coinbase/onchainkit';

interface WalletConnectProps {
  onConnect?: (address: string) => void;
}

export function WalletConnect({ onConnect }: WalletConnectProps) {
  return (
    <ConnectWallet 
      buttonClassName="px-8 py-4 text-lg font-medium bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-blue-500/25 active:scale-95"
    />
  );
}