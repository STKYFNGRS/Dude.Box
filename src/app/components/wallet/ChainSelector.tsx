'use client';

import { useWeb3 } from '@/app/context/Web3Context';
import { SUPPORTED_CHAINS } from '@/app/config/web3';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from 'react';

export const ChainSelector = () => {
  const { state, switchChain } = useWeb3();
  const [isChanging, setIsChanging] = useState(false);

  const handleChainChange = async (chainId: string) => {
    setIsChanging(true);
    try {
      await switchChain(parseInt(chainId));
    } catch (error) {
      console.error('Failed to switch chain:', error);
    } finally {
      setIsChanging(false);
    }
  };

  if (!state.wallet) return null;

  return (
    <Select
      value={state.wallet.chain.id.toString()}
      onValueChange={handleChainChange}
      disabled={isChanging}
    >
      <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700">
        <SelectValue placeholder="Select chain" />
      </SelectTrigger>
      <SelectContent>
        {Object.values(SUPPORTED_CHAINS).map((chain) => (
          <SelectItem 
            key={chain.id} 
            value={chain.id.toString()}
          >
            {chain.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};