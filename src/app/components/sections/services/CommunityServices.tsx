'use client';

import React from 'react';

export const CommunityServices: React.FC = () => {
  return (
    <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 shadow-lg transition duration-300 hover:bg-gray-800">
      <h3 className="text-xl font-semibold mb-3">Community-Driven Growth</h3>
      <ul className="text-left space-y-3">
        <li className="flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
          Founding member NFTs with real voting power
        </li>
        <li className="flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
          Premium social spaces with coffee bar and gaming
        </li>
        <li className="flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
          Regular community events and gatherings
        </li>
        <li className="flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
          Multi-purpose venue for events
        </li>
      </ul>
    </div>
  );
};