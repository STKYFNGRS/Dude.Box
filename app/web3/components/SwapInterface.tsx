'use client';

import { ArrowDownIcon, RefreshCcwIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { useAccount, useBalance } from 'wagmi';


interface TokenData {
  symbol: string;
  balance: string;
  price: string;
}

const SwapInterface = () => {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState<string>('');
  const [swapEstimate, setSwapEstimate] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Get ETH balance
  const { data: ethBalance } = useBalance({
    address,
  });

  // Get DUDE token balance
  const { data: dudeBalance } = useBalance({
    address,
    token: '0x...', // DUDE token address
  });

  const handleSwap = () => {
    setShowModal(true);
  };

  const handleActualSwap = async () => {
    if (typeof window === 'undefined') return;
    if (!amount || !isConnected) return;
    setIsLoading(true);
    try {
      // Swap logic will be implemented here
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Swap failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSwapEstimate = (inputAmount: string) => {
    if (typeof window === 'undefined') return '0';
    if (!inputAmount) return '0';
    // Placeholder for actual price calculation logic
    return (parseFloat(inputAmount) * 1000).toString();
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-gray-900/50 rounded-2xl border border-blue-900/30 backdrop-blur-sm p-6 mb-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-blue-300 text-center">Swap ETH for DUDE</h3>
          
          {/* Input Amount */}
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">From</span>
              <span className="text-gray-400">
                Balance: {ethBalance?.formatted?.slice(0, 6) || '0'} ETH
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setSwapEstimate(calculateSwapEstimate(e.target.value));
                }}
                placeholder="0.0"
                className="w-full bg-transparent text-blue-100 text-2xl outline-none"
              />
              <span className="text-blue-300 font-semibold">ETH</span>
            </div>
          </div>

          {/* Swap Icon */}
          <div className="flex justify-center -my-2">
            <div className="bg-blue-900/30 p-2 rounded-full">
              <ArrowDownIcon className="w-6 h-6 text-blue-400" />
            </div>
          </div>

          {/* Output Amount */}
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">To</span>
              <span className="text-gray-400">
                Balance: {dudeBalance?.formatted?.slice(0, 8) || '0'} DUDE
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={swapEstimate}
                disabled
                className="w-full bg-transparent text-blue-100 text-2xl outline-none"
              />
              <span className="text-blue-300 font-semibold">DUDE</span>
            </div>
          </div>

          {/* Price Impact & Route */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>Price Impact</span>
              <span className="text-blue-300">~0.05%</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Route</span>
              <span className="text-blue-300">ETH → DUDE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Swap Button */}
      <div className="space-y-4">
        <button 
          onClick={handleSwap}
          disabled={!isConnected || !amount || isLoading}
          className={`w-full ${
            isConnected && amount 
              ? 'bg-blue-900/50 hover:bg-blue-900/70 text-blue-300' 
              : 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
          } font-semibold py-4 rounded-xl border border-blue-900/30 backdrop-blur-sm transition-all duration-200`}
        >
          {isLoading ? (
            <RefreshCcwIcon className="w-6 h-6 animate-spin mx-auto" />
          ) : !isConnected ? (
            'Connect Wallet'
          ) : !amount ? (
            'Enter Amount'
          ) : (
            'Swap'
          )}
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            Built on Base • No Trading Fees • No gas fees
          </p>
        </div>

      </div>

      {/* Construction Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900/90 border border-blue-900/30 rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-blue-300">Under Construction</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-300 mb-6">
              We appreciate your enthusiasm! The token swap feature is currently under construction. 
              Stay tuned for the official launch of the DUDE token.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-blue-900/50 hover:bg-blue-900/70 text-blue-300 font-semibold py-3 rounded-xl border border-blue-900/30"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwapInterface;