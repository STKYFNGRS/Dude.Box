'use client';

import React from 'react';

export const ImpactPhases: React.FC = () => {
  return (
    <>
      {/* Impact Statement */}
      <div className="mt-8 border-t border-gray-800 pt-6">
        <div className="grid md:grid-cols-3 gap-4 text-center">
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h5 className="font-semibold text-blue-400">Phase 1</h5>
            <p className="text-sm text-gray-300">Build our community and establish brand presence</p>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h5 className="font-semibold text-blue-400">Phase 2</h5>
            <p className="text-sm text-gray-300">Launch first physical location in San Diego</p>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h5 className="font-semibold text-blue-400">Phase 3</h5>
            <p className="text-sm text-gray-300">Expand to additional cities nationwide</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/40 rounded-lg text-center">
        <p className="text-lg font-semibold text-blue-400">
          Every purchase, every NFT, every member brings us closer to opening our first location 
          and providing free mental health support to those who need it.
        </p>
      </div>
    </>
  );
};