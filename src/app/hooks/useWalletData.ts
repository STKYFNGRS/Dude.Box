'use client';

import { useEffect, useState, useCallback } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { formatEther } from 'viem';
import type { PublicClient } from 'viem';

interface WalletData {
  balance: string;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface EthereumProvider extends PublicClient {
  request: (args: { method: string; params: unknown[] }) => Promise<unknown>;
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
      const provider = state.publicClient as EthereumProvider;
      const result = await provider.request({
        method: 'eth_getBalance',
        params: [state.wallet.address, 'latest']
      });
      
      const balanceInWei = BigInt(result as string);
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