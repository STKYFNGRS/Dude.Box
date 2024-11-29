'use client';

import { Coins, Activity, Lock, Users } from 'lucide-react';

export const TokenProject = () => {
  return (
    <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <Coins className="w-8 h-8 text-blue-400" />
        <h2 className="text-2xl font-bold">$DUDE Token</h2>
      </div>
      <ul className="space-y-4">
        <li className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-blue-400" />
          <div>
            <p className="font-semibold">Utility First</p>
            <p className="text-sm text-gray-400">Platform currency and governance</p>
          </div>
        </li>
        <li className="flex items-center gap-3">
          <Lock className="w-5 h-5 text-blue-400" />
          <div>
            <p className="font-semibold">Fair Launch</p>
            <p className="text-sm text-gray-400">Community-focused distribution</p>
          </div>
        </li>
        <li className="flex items-center gap-3">
          <Users className="w-5 h-5 text-blue-400" />
          <div>
            <p className="font-semibold">Governance Rights</p>
            <p className="text-sm text-gray-400">Shape the future of the platform</p>
          </div>
        </li>
      </ul>
      <button className="w-full mt-6 py-3 bg-gray-700 cursor-not-allowed rounded-lg font-semibold transition-colors">
        Coming Soon
      </button>
    </div>
  );
};
