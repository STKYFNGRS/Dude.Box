'use client';

import { useWeb3 } from '@/app/context/Web3Context';
import { ArrowUpRight } from 'lucide-react';

export const TransactionHistory = () => {
  const { state } = useWeb3();

  if (!state.wallet?.address) return null;

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800/50 overflow-hidden">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-medium">Recent Transactions</h3>
      </div>
      
      <div className="p-4 text-center text-gray-400">
        <ArrowUpRight className="w-8 h-8 mx-auto mb-2 text-blue-400" />
        Transaction history coming soon
      </div>
    </div>
  );
};