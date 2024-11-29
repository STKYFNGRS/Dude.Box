'use client';

import { useEffect, useState, useCallback } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { formatEther } from 'viem';

interface WalletData {
  balance: string;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useWalletData(): WalletData {
  const { state } = useWeb3();
  const [balance, setBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!state.wallet?.address || !state.publicClient) {
      setBalance('0');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use raw ethereum request method
      const result = await (state.publicClient as any).request({
        method: 'eth_getBalance',
        params: [state.wallet.address, 'latest']
      });
      
      // Convert hex balance to ETH
      const balanceInWei = BigInt(result);
      setBalance(formatEther(balanceInWei));
    } catch (err) {
      console.error('Failed to fetch balance:', err);
      setError('Failed to fetch wallet balance');
    } finally {
      setIsLoading(false);
    }
  }, [state.wallet?.address, state.publicClient]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return {
    balance,
    isLoading,
    error,
    refetch: fetchBalance,
  };
}