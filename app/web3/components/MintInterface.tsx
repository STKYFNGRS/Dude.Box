'use client';

import { ImageIcon } from 'lucide-react';

const MintInterface = () => {
  return (
    <div className="w-full max-w-xl mx-auto">
      {/* NFT Preview Container */}
      <div className="aspect-square w-full bg-gray-900/50 rounded-2xl border border-blue-900/30 backdrop-blur-sm p-8 mb-6">
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="bg-blue-900/20 p-4 rounded-full mb-4">
            <ImageIcon className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-blue-300 mb-2">Coming Soon</h3>
          <p className="text-gray-400 text-center max-w-sm">
            Our Founding Members Collection reveal is just around the corner. Get ready to be among the first.
          </p>
        </div>
      </div>

      {/* Minting Controls */}
      <div className="space-y-6">
        {/* Price and Supply Info */}
        <div className="flex justify-between items-center px-4">
          <div>
            <p className="text-sm text-gray-400">Price</p>
            <p className="text-xl font-semibold text-blue-300">0.15 ETH</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Supply</p>
            <p className="text-xl font-semibold text-blue-300">20,000</p>
          </div>
        </div>

        {/* Mint Button */}
        <button 
          disabled
          className="w-full bg-blue-900/50 hover:bg-blue-900/70 text-blue-300 font-semibold py-4 rounded-xl border border-blue-900/30 backdrop-blur-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Mint Coming Soon
        </button>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-sm text-gray-400">
            Built on Base
          </p>
        </div>
      </div>
    </div>
  );
};

export default MintInterface;