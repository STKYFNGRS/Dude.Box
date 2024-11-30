'use client';

import { useWeb3 } from '@/app/context/Web3Context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ChainSelector = () => {
  const { state } = useWeb3();

  if (!state.isConnected) return null;

  return (
    <Select defaultValue="base-sepolia" disabled>
      <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700">
        <SelectValue placeholder="Base Sepolia" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="base-sepolia">Base Sepolia</SelectItem>
      </SelectContent>
    </Select>
  );
};