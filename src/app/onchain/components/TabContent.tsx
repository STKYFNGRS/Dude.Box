'use client';

import { StatsGrid } from './StatsGrid';
import { NFTProject } from './NFTProject';
import { TokenProject } from './TokenProject';
import { TransactionHistory } from '../../components/wallet/TransactionHistory';

interface TabContentProps {
  activeTab: string;
}

export const TabContent = ({ activeTab }: TabContentProps) => {
  switch (activeTab) {
    case 'overview':
      return (
        <>
          <StatsGrid />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <NFTProject />
            <TokenProject />
          </div>
        </>
      );
    
    case 'nft':
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">NFT Viewer Coming Soon</h2>
          <p className="text-gray-400">Track and manage your NFTs across multiple chains</p>
        </div>
      );
    
    case 'token':
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Token Management Coming Soon</h2>
          <p className="text-gray-400">View and manage your token holdings</p>
        </div>
      );
    
    case 'wallet':
      return (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TransactionHistory />
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
              <div className="space-y-4">
                <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                  Send ETH
                </button>
                <button className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                  View on Explorer
                </button>
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};
