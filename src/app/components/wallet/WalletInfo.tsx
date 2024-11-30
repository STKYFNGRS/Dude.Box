'use client';

import { useWeb3 } from '@/app/context/Web3Context';
import { Wallet } from 'lucide-react';

export const WalletInfo = () => {
  const { isConnected, address, disconnect } = useWeb3();

  if (!isConnected || !address) return null;

  return (
    <div className="mb-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-blue-400" />
          <span className="text-gray-300">Connected:</span>
          <span className="font-mono">{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={disconnect}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
          >
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
};