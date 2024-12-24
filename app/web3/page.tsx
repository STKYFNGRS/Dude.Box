'use client';

import { Web3Footer } from 'components/layout/web3-footer';
import { useState } from 'react';

export default function Web3Page() {
  const [address, setAddress] = useState('');

  const handleConnect = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });

        if (accounts[0]) {
          setAddress(accounts[0]);
        }
      } else {
        window.open('https://www.coinbase.com/wallet', '_blank');
      }
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      setAddress('');
      window.location.reload();
    } catch (error) {
      console.error('Disconnect error:', error);
      setAddress('');
      window.location.reload();
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Connect Your Wallet
            </h1>
            <div className="mt-8">
              {!address ? (
                <button 
                  onClick={handleConnect}
                  className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
                >
                  Connect Wallet
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="text-white">
                    Connected: {address.slice(0, 6)}...{address.slice(-4)}
                  </div>
                  <button 
                    onClick={handleDisconnect}
                    className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500 transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Web3Footer />
    </>
  );
}