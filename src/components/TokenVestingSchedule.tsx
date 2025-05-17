import React from 'react';

const TokenVestingSchedule: React.FC = () => {
  return (
    <div className="section-box p-6 md:p-8 rounded-md my-8">
      <h2 className="text-2xl md:text-3xl font-bold text-accent mb-4 text-center">Tokenomics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="card-box p-5 rounded-md">
          <h3 className="text-xl font-bold text-white mb-2">Supply</h3>
          <p className="text-[#b0b0b0]">
            <span className="text-accent font-mono">99,000,000</span> total supply
            <br/>
            <span className="text-sm">(Originally 100M, with 1M burned during safe transfer)</span>
          </p>
        </div>
        
        <div className="card-box p-5 rounded-md">
          <h3 className="text-xl font-bold text-white mb-2">Transaction Fees</h3>
          <p className="text-[#b0b0b0]">
            <span className="text-accent font-mono">1%</span> deflationary burn
            <br/>
            <span className="text-accent font-mono">1%</span> developer fee
          </p>
        </div>
      </div>
      
      <div className="card-box p-5 rounded-md mb-6">
        <h3 className="text-xl font-bold text-white mb-2">No Treasury, No Rug</h3>
        <p className="text-[#b0b0b0]">
          Unlike many tokens, LittleDude (SON) has <span className="text-accent">no treasury</span> and a simple transparent fee structure. 
          This means there are no locked tokens that could be dumped on the market later.
        </p>
      </div>
      
      <div className="card-box p-5 rounded-md">
        <h3 className="text-xl font-bold text-white mb-2">Contract Details</h3>
        <p className="text-[#b0b0b0] mb-2">
          Token Contract: <a href="https://basescan.org/token/0x9985bEBaB2181E961E755b6D5Cc81e4626a4cFCd" target="_blank" rel="noopener noreferrer" className="text-accent break-all hover:underline">0x9985bEBaB2181E961E755b6D5Cc81e4626a4cFCd</a>
        </p>
        <p className="text-[#b0b0b0]">
          Safe Address: <a href="https://app.safe.global/balances?safe=base:0xEc72fF23CC79F9975DdF1aE9e5F2Df8A94Db2100" target="_blank" rel="noopener noreferrer" className="text-accent break-all hover:underline">0xEc72fF23CC79F9975DdF1aE9e5F2Df8A94Db2100</a>
        </p>
      </div>
    </div>
  );
};

export default TokenVestingSchedule; 