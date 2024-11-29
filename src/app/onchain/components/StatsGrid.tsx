'use client';

import { ImageIcon, Coins, Image, Users } from 'lucide-react';

export const StatsGrid = () => {
  const stats = [
    { label: 'NFT Floor Price', value: '0.09 ETH', change: '+5.2%', icon: ImageIcon },
    { label: 'Token Price', value: 'Coming Soon', change: '-', icon: Coins },
    { label: 'Total NFTs', value: '20,000', change: '-', icon: Image },
    { label: 'Holders', value: 'Coming Soon', change: '-', icon: Users }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {stats.map((stat, index) => (
        <div key={index} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <stat.icon className="w-6 h-6 text-blue-400" />
            <span className={`text-sm ${
              stat.change.startsWith('+') ? 'text-green-400' : 
              stat.change.startsWith('-') ? 'text-red-400' : 'text-gray-400'
            }`}>
              {stat.change}
            </span>
          </div>
          <p className="text-gray-300">{stat.label}</p>
          <p className="text-2xl font-bold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};
