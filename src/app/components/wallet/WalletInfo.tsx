'use client';

import { useWeb3 } from '@/app/context/Web3Context';
import { useWalletData } from '@/app/hooks/useWalletData';
import { Wallet, RefreshCw } from 'lucide-react';

export const WalletInfo = () => {
  const { state, disconnect } = useWeb3();
  const { balance, isLoading, refetch } = useWalletData();

  if (!state.wallet) return null;

  return (
    <div className="mb-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-blue-400" />
          <span className="text-gray-300">Connected:</span>
          <span className="font-mono">{`${state.wallet.address.slice(0, 6)}...${state.wallet.address.slice(-4)}`}</span>
          <button 
            onClick={() => refetch()} 
            className="p-1 hover:bg-gray-700 rounded-full transition-colors"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-400">Balance</span>
            <span className="font-mono font-medium">{balance} ETH</span>
          </div>
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