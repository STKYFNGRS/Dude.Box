'use client';

import React from 'react';
import { getDefaultWallets } from '@coinbase/onchainkit/wallet';

interface WalletConnectProps {
  onConnect?: (address: string) => void;
}

export function WalletConnect({ onConnect }: WalletConnectProps) {
  const { connect, connected, address } = getDefaultWallets();

  React.useEffect(() => {
    if (connected && address && onConnect) {
      onConnect(address);
    }
  }, [connected, address, onConnect]);

  return (
    <button
      onClick={connect}
      disabled={connected}
      className="px-8 py-4 text-lg font-medium bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-blue-500/25 active:scale-95"
    >
      {connected ? `Connected: ${address?.slice(0,6)}...${address?.slice(-4)}` : 'Connect Wallet'}
    </button>
  );
}