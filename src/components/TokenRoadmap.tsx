import React from 'react';

const TokenRoadmap: React.FC = () => {
  return (
    <div className="section-box p-6 md:p-8 rounded-md my-8">
      <h2 className="text-2xl md:text-3xl font-bold text-accent mb-4 text-center">Project Roadmap</h2>
      <p className="text-center text-[#b0b0b0]">
        Our exciting roadmap and future plans will be detailed here soon.
      </p>
      {/* Placeholder for roadmap items */}
      {/* Example: 
      <ul className="space-y-4 text-[#b0b0b0] list-disc list-inside pl-4">
        <li>Phase 1: Token Launch & Initial Airdrops</li>
        <li>Phase 2: DEX Listing & Liquidity Pool Establishment</li>
        <li>Phase 3: Platform Integration & Utility Expansion</li>
        <li>Phase 4: Governance & DAO Formation</li>
      </ul>
      */}
    </div>
  );
};

export default TokenRoadmap; 