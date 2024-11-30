'use client';

import { useEffect, useState } from 'react';
import { formatEther, type Transaction } from 'viem';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useAccount, usePublicClient, useBlockNumber } from 'wagmi';

interface SimplifiedTransaction {
  hash: string;
  from: string;
  to: string;
  value: bigint;
  timestamp: number;
}

export const TransactionHistory = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: blockNumber } = useBlockNumber();
  const [transactions, setTransactions] = useState<SimplifiedTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!address || !blockNumber) return;
      
      const userAddress = address.toLowerCase();
      setIsLoading(true);
      
      try {
        const fromBlock = blockNumber - BigInt(100);
        
        const blockPromises = [];
        for (let i = fromBlock; i <= blockNumber; i++) {
          blockPromises.push(
            publicClient.getBlock({
              blockNumber: i,
              includeTransactions: true
            })
          );
        }

        const blocks = await Promise.all(blockPromises);
        
        const txs = blocks.flatMap(block => {
          const blockTimestamp = Number(block.timestamp);
          return (block.transactions as Array<Transaction>)
            .filter(tx => (
              'from' in tx && 'to' in tx && 
              (tx.from.toLowerCase() === userAddress ||
               tx.to?.toLowerCase() === userAddress)
            ))
            .map(tx => ({
              hash: tx.hash,
              from: tx.from,
              to: tx.to || '',
              value: tx.value,
              timestamp: blockTimestamp
            }));
        });

        setTransactions(txs);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [address, blockNumber, publicClient]);

  if (!address) return null;

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
            const isSent = tx.from.toLowerCase() === address.toLowerCase();
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