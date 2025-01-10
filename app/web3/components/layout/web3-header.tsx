'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi';
import { injected } from 'wagmi/connectors';
import LogoSquare from '../../../../components/logo-square';
import Web3MobileMenu from './web3-mobile-menu';

export default function Web3Header() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({
    address: address as `0x${string}`,
    chainId: 1
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const truncateAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleDisconnect = async () => {
    try {
      disconnect();
      localStorage.clear();
      window.location.reload();
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  const handleConnect = async () => {
    if (isConnected) {
      await handleDisconnect();
    } else {
      try {
        if (typeof window !== 'undefined' && window.ethereum?.selectedAddress) {
          await window.ethereum.request({
            method: 'wallet_requestPermissions',
            params: [{ eth_accounts: {} }],
          });
        }
        
        await connect({
          connector: injected({
            shimDisconnect: true
          })
        });
      } catch (error) {
        console.error('Connection error:', error);
      }
    }
  };

  const displayAddress = ensName || truncateAddress(address || '');

  return (
    <nav className="relative flex items-center justify-between p-4 lg:px-6 border-b border-neutral-200 dark:border-neutral-700">
      {/* Mobile Layout */}
      <div className="md:hidden flex w-full justify-between items-center">
        <div className="flex-none">
          <Web3MobileMenu />
        </div>
        <div className="flex-none">
          <Link href="/" className="flex items-center justify-center">
            <LogoSquare />
          </Link>
        </div>
        <div className="flex-none">
          {mounted && (
            <button
              onClick={handleConnect}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              {isConnected ? displayAddress : 'Connect'}
            </button>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex w-full items-center justify-between">
        <div className="flex items-center">
          <Link 
            href="/"
            className="mr-2 flex items-center justify-center md:w-auto lg:mr-6"
          >
            <LogoSquare />
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className="text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
          >
            Shop
          </Link>
          <Link
            href="/about"
            className="text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
          >
            About
          </Link>
          {mounted && (
            <button
              onClick={handleConnect}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              {isConnected ? displayAddress : 'Connect Wallet'}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}