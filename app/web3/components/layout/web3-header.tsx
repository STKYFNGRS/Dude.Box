'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { Menu, X } from 'lucide-react';
import LogoSquare from '../../../../components/logo-square';

export default function Web3Header() {
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    <>
      <nav className="w-full flex items-center justify-between p-4 lg:px-6 border-b border-neutral-700">
        {/* Mobile Layout */}
        <div className="md:hidden flex w-full justify-between items-center">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 dark:border-neutral-700 text-black transition-colors dark:text-white"
            aria-label={isMenuOpen ? 'Close Menu' : 'Open Menu'}
          >
            {isMenuOpen ? (
              <X className="h-4" />
            ) : (
              <Menu className="h-4" />
            )}
          </button>

          {!isMenuOpen && (
            <>
              <Link href="/" className="flex items-center justify-center">
                <LogoSquare />
              </Link>

              {mounted && (
                <button
                  onClick={handleConnect}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  {isConnected ? displayAddress : 'Connect Wallet'}
                </button>
              )}
            </>
          )}
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
              href="/search"
              className="text-blue-300 hover:text-blue-200 transition-colors"
            >
              Shop
            </Link>
            {mounted && (
              <button
                onClick={handleConnect}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {isConnected ? displayAddress : 'Connect Wallet'}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-[57px] z-50 bg-black md:hidden overflow-y-auto">
          <div className="flex flex-col px-4 pt-4 pb-2 space-y-4">
            <Link 
              href="/" 
              className="block w-full text-left bg-black rounded-lg px-4 py-3 text-base text-white border border-neutral-800"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/search" 
              className="block w-full text-left bg-black rounded-lg px-4 py-3 text-base text-white border border-neutral-800"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
          </div>
        </div>
      )}
    </>
  );
}