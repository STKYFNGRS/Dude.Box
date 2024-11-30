'use client';

import { useWeb3 } from '@/app/context/Web3Context';
import { useRouter } from 'next/navigation';

interface TabContentProps {
  activeTab: string;
}

export const TabContent = ({ activeTab }: TabContentProps) => {
  const { address, disconnect } = useWeb3();
  const router = useRouter();

  const handleDisconnect = async () => {
    await disconnect();
    router.refresh();
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-700 bg-gray-800/50 overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium">Wallet Overview</h3>
              <button
                onClick={handleDisconnect}
                className="px-4 py-2 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
              >
                Disconnect
              </button>
            </div>
            <div className="p-4">
              {address ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-400">Connected Address:</p>
                  <p className="font-mono break-all">{address}</p>
                </div>
              ) : (
                <p className="text-gray-400">Please connect your wallet to view details</p>
              )}
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
          <div className="space-y-4">
            {address && (
              <>
                <button 
                  onClick={() => window.open(`https://sepolia.basescan.org/address/${address}`, '_blank')}
                  className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  View on Explorer
                </button>
                <button
                  onClick={handleDisconnect}
                  className="w-full py-2 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                >
                  Disconnect Wallet
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};