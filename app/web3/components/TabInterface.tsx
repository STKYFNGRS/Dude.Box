'use client';

import { useState } from 'react';
import Leaderboard from './Leaderboard';

export default function TabInterface() {
  const [activeTab, setActiveTab] = useState('leaderboard');

  return (
    <div className="w-full max-w-5xl mx-auto bg-gray-800/40 backdrop-blur-sm rounded-xl p-6">
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('mint')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'mint'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          Mint
        </button>
        <button
          onClick={() => setActiveTab('enhance')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'enhance'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          Enhance
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'leaderboard'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          Leaderboard
        </button>
      </div>

      <div className="mt-4">
        {activeTab === 'mint' && (
          <div className="text-white min-h-[600px]">
            <h2 className="text-xl font-bold mb-4">Mint Your Robot</h2>
            <p className="text-gray-300">Minting interface coming soon...</p>
          </div>
        )}
        {activeTab === 'enhance' && (
          <div className="text-white min-h-[600px]">
            <h2 className="text-xl font-bold mb-4">Enhance Your Robot</h2>
            <p className="text-gray-300">Enhancement interface coming soon...</p>
          </div>
        )}
        {activeTab === 'leaderboard' && <Leaderboard />}
      </div>
    </div>
  );
}