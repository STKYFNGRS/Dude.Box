'use client';

import { useEffect, useState, useCallback } from 'react';
import { useWeb3 } from '@/app/context/Web3Context';
import { formatEther } from 'viem';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: bigint;
  timestamp: number;
}

export const TransactionHistory = () => {
  const { state } = useWeb3();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTransactions = useCallback(async () => {
    if (!state.wallet?.address || !state.publicClient) return;
    const userAddress = state.wallet.address.toLowerCase();

    setIsLoading(true);
    try {
      const blocks = await state.publicClient.getBlockNumbers({
        fromBlock: BigInt(-100),
        toBlock: 'latest'
      });

      const txs: Transaction[] = [];
      for (const blockNumber of blocks) {
        const block = await state.publicClient.getBlock({ blockNumber });
        const blockTxs = block.transactions.filter(tx => 
          tx.from.toLowerCase() === userAddress ||
          tx.to?.toLowerCase() === userAddress
        );
        
        txs.push(...blockTxs.map(tx => ({
          hash: tx.hash,
          from: tx.from,
          to: tx.to || '',
          value: tx.value,
          timestamp: Number(block.timestamp)
        })));
      }

      setTransactions(txs);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [state.publicClient, state.wallet?.address]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  if (!state.wallet) return null;

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800/50 overflow-hidden">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-medium">Recent Transactions</h3>
      </div>
      
      <div className="divide-y divide-gray-700">
        {isLoading ? (
          <div className="p-4 text-center text-gray-400">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="p-4 text-center text-gray-400">No transactions found</div>
        ) : (
          transactions.map((tx) => {
            const isSent = tx.from.toLowerCase() === state.wallet!.address.toLowerCase();
            return (
              <div key={tx.hash} className="p-4 hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isSent ? (
                      <ArrowUpRight className="w-5 h-5 text-red-400" />
                    ) : (
                      <ArrowDownLeft className="w-5 h-5 text-green-400" />
                    )}
                    <div>
                      <span className="text-sm font-medium">
                        {isSent ? 'Sent' : 'Received'}
                      </span>
                      <p className="text-xs text-gray-400">
                        {new Date(tx.timestamp * 1000).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`font-medium ${isSent ? 'text-red-400' : 'text-green-400'}`}>
                      {isSent ? '-' : '+'}{formatEther(tx.value)} ETH
                    </span>
                    <p className="text-xs text-gray-400">
                      {isSent ? `To: ${tx.to.slice(0, 6)}...${tx.to.slice(-4)}` :
                        `From: ${tx.from.slice(0, 6)}...${tx.from.slice(-4)}`}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};