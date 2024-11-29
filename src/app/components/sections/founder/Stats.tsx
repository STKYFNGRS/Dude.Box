'use client';

import React from 'react';

export const Stats: React.FC = () => {
  return (
    <div className="bg-gray-800/50 p-4 rounded-lg">
      <h4 className="font-semibold mb-3 text-white">The Reality We Face:</h4>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-3 bg-gray-900/50 rounded-lg">
          <p className="text-2xl font-bold text-blue-400">1 in 3</p>
          <p className="text-sm text-gray-300">men will seek help when struggling with mental health</p>
        </div>
        <div className="p-3 bg-gray-900/50 rounded-lg">
          <p className="text-2xl font-bold text-blue-400">3.7x</p>
          <p className="text-sm text-gray-300">higher suicide rate among men than women</p>
        </div>
        <div className="p-3 bg-gray-900/50 rounded-lg">
          <p className="text-2xl font-bold text-blue-400">75%</p>
          <p className="text-sm text-gray-300">of men feel unable to discuss personal challenges</p>
        </div>
        <div className="p-3 bg-gray-900/50 rounded-lg">
          <p className="text-2xl font-bold text-blue-400">5 months</p>
          <p className="text-sm text-gray-300">average wait time for mental health services</p>
        </div>
      </div>
    </div>
  );
};