'use client';

import { useEffect, useState } from 'react';
import { useEnsName, useEnsAvatar } from 'wagmi';

interface LeaderboardEntryProps {
  address: string;
  points: number;
  rank: number;
  previousRank?: number;
}

export default function LeaderboardEntry({ address, points, rank, previousRank }: LeaderboardEntryProps) {
  const { data: ensName } = useEnsName({ 
    address: address as `0x${string}`,
    chainId: 1
  });
  const { data: ensAvatar } = useEnsAvatar({
    name: ensName,
    chainId: 1
  });

  const displayName = ensName || `${address.slice(0, 6)}...${address.slice(-4)}`;
  const rankChange = previousRank ? previousRank - rank : 0;

  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700/70 transition-colors">
      <div className="flex items-center gap-3">
        <span className={`text-base font-bold ${
          rank === 1 ? 'text-yellow-400' :
          rank === 2 ? 'text-gray-300' :
          rank === 3 ? 'text-amber-600' :
          'text-gray-400'
        }`}>
          #{rank}
          {rankChange !== 0 && (
            <span className={`text-xs ml-1 ${rankChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {rankChange > 0 ? '↑' : '↓'}
            </span>
          )}
        </span>
        
        <div className="flex items-center gap-2">
          {ensAvatar ? (
            <img 
              src={ensAvatar} 
              alt={displayName}
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
              <span className="text-white text-xs">{displayName.charAt(0)}</span>
            </div>
          )}
          <div>
            <p className="font-medium text-white">{displayName}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-purple-400 font-bold">{points.toLocaleString()}</span>
        <span className="text-xs text-gray-400">points</span>
      </div>
    </div>
  );
}