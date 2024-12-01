'use client';

import React from 'react';
import { WalletDropdown } from '@coinbase/onchainkit/wallet';
import { useWallet } from '@coinbase/onchainkit';

interface WalletConnectProps {
  onConnect?: (address: string) => void;
}

export function WalletConnect({ onConnect }: WalletConnectProps) {
  console.log('Rendering WalletConnect');
  const { address, isConnecting } = useWallet();

  React.useEffect(() => {
    if (address && onConnect) {
      console.log('Connected with address:', address);
      onConnect(address);
    }
  }, [address, onConnect]);

  return (
    <div className="flex flex-col items-center gap-4">
      <WalletDropdown 
        label={isConnecting ? 'Connecting...' : address ? `Connected: ${address.slice(0,6)}...` : 'Connect Wallet'}
        className="px-8 py-4 text-lg font-medium bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-blue-500/25 active:scale-95"
      />
      {address && (
        <p className="text-sm text-gray-400">
          Connected with {address.slice(0, 6)}...{address.slice(-4)}
        </p>
      )}
    </div>
  );
}