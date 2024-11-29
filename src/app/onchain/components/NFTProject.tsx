'use client';

import { ImageIcon, ShieldCheck, Users, Zap } from 'lucide-react';

export const NFTProject = () => {
  return (
    <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <ImageIcon className="w-8 h-8 text-blue-400" />
        <h2 className="text-2xl font-bold">Founding Dudes NFT</h2>
      </div>
      <ul className="space-y-4">
        <li className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-400" />
          <div>
            <p className="font-semibold">Founding Member Status</p>
            <p className="text-sm text-gray-400">Exclusive rights and early access</p>
          </div>
        </li>
        <li className="flex items-center gap-3">
          <Users className="w-5 h-5 text-blue-400" />
          <div>
            <p className="font-semibold">Community Governance</p>
            <p className="text-sm text-gray-400">Vote on key decisions</p>
          </div>
        </li>
        <li className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-blue-400" />
          <div>
            <p className="font-semibold">Personalized Display</p>
            <p className="text-sm text-gray-400">Featured at our physical locations</p>
          </div>
        </li>
      </ul>
      <button className="w-full mt-6 py-3 bg-gray-700 cursor-not-allowed rounded-lg font-semibold transition-colors">
        Coming Soon
      </button>
    </div>
  );
};
