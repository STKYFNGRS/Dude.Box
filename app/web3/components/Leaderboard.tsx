'use client';

import { useEffect, useState } from 'react';

interface LeaderboardData {
  address: string;
  points: number;
  rank: number;
  previousRank?: number;
}

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<LeaderboardData[]>([]);

  useEffect(() => {
    // Simulate data fetching
    const fetchLeaderboardData = async () => {
      const mockData = [
        { address: "0xEA82...37Da", points: 2500, rank: 1, previousRank: 2 },
        { address: "0x1234...5678", points: 2200, rank: 2, previousRank: 1 },
        { address: "0xABCD...EFGH", points: 1800, rank: 3, previousRank: 3 },
        { address: "0x9876...5432", points: 1600, rank: 4, previousRank: 5 },
        { address: "0x5555...4444", points: 1400, rank: 5, previousRank: 4 },
        { address: "0x7777...8888", points: 1200, rank: 6, previousRank: 7 },
        { address: "0x2222...3333", points: 1000, rank: 7, previousRank: 6 },
        { address: "0x4444...5555", points: 800, rank: 8, previousRank: 9 },
        { address: "0x6666...7777", points: 600, rank: 9, previousRank: 8 },
        { address: "0x8888...9999", points: 400, rank: 10, previousRank: 10 },
        { address: "0xAAAA...BBBB", points: 380, rank: 11, previousRank: 12 },
        { address: "0xCCCC...DDDD", points: 360, rank: 12, previousRank: 11 },
        { address: "0xEEEE...FFFF", points: 340, rank: 13, previousRank: 13 },
        { address: "0x1111...2222", points: 320, rank: 14, previousRank: 14 },
        { address: "0x3333...4444", points: 300, rank: 15, previousRank: 15 },
        { address: "0x5555...6666", points: 280, rank: 16, previousRank: 16 },
        { address: "0x7777...8888", points: 260, rank: 17, previousRank: 17 },
        { address: "0x9999...AAAA", points: 240, rank: 18, previousRank: 18 },
        { address: "0xBBBB...CCCC", points: 220, rank: 19, previousRank: 19 },
        { address: "0xDDDD...EEEE", points: 200, rank: 20, previousRank: 20 }
      ];

      setLeaders(mockData);
    };

    fetchLeaderboardData();
  }, []);

  const LeaderboardEntry = ({ data, index }: { data: LeaderboardData, index: number }) => (
    <div className="flex items-center justify-between p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700/70 transition-colors">
      <div className="flex items-center gap-3">
        <span className={`text-base font-bold ${
          data.rank === 1 ? 'text-yellow-400' :
          data.rank === 2 ? 'text-gray-300' :
          data.rank === 3 ? 'text-amber-600' :
          'text-gray-400'
        }`}>
          #{data.rank}
        </span>
        <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
          <span className="text-white text-xs">0</span>
        </div>
        <span className="font-medium text-white">{data.address}</span>
      </div>
      <span className="text-purple-400 font-bold">{data.points.toLocaleString()} points</span>
    </div>
  );

  return (
    <div>
      
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          {leaders.slice(0, 10).map((leader, index) => (
            <LeaderboardEntry key={leader.rank} data={leader} index={index} />
          ))}
        </div>
        <div className="space-y-2">
          {leaders.slice(10, 20).map((leader, index) => (
            <LeaderboardEntry key={leader.rank} data={leader} index={index + 10} />
          ))}
        </div>
      </div>
    </div>
  );
}