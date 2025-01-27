'use client';

import Link from 'next/link';
import { useEffect, useState, Fragment } from 'react';
import { useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { Bars3Icon as Menu, XMarkIcon as X } from '@heroicons/react/24/outline';
import LogoSquare from '../../../../components/logo-square';
import { Dialog, Transition } from '@headlessui/react';

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

  const connectButtonClasses = `
    whitespace-nowrap text-white px-4 py-2 rounded-md text-sm font-medium
    bg-gradient-to-r from-blue-500 to-violet-500
    hover:from-blue-600 hover:to-violet-600
    transition-all duration-300
  `;

  const mobileConnectButtonClasses = `
    whitespace-nowrap text-white px-2 py-2 rounded-md text-xs font-medium
    bg-gradient-to-r from-blue-500 to-violet-500
    hover:from-blue-600 hover:to-violet-600
    transition-all duration-300
  `;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 lg:px-6 border-b border-neutral-800 bg-black/30 backdrop-blur-xl">
      <div className="md:hidden flex w-full justify-between items-center">
        <div className="flex w-11">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-white transition-colors md:hidden dark:border-neutral-700"
            aria-label="Open Menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>

        <div className="flex justify-center">
          <Link href="/" className="flex items-center justify-center">
            <LogoSquare />
          </Link>
        </div>

        <div className="flex w-11 justify-end">
          {mounted && (
            <button
              onClick={handleConnect}
              className={mobileConnectButtonClasses}
            >
              {isConnected ? displayAddress : 'Connect'}
            </button>
          )}
        </div>
      </div>

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
              className={connectButtonClasses}
            >
              {isConnected ? displayAddress : 'Connect Wallet'}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu using Transitions */}
      <Transition show={isMenuOpen}>
        <Dialog onClose={() => setIsMenuOpen(false)} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-[-100%]"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-[-100%]"
          >
            <Dialog.Panel className="fixed bottom-0 left-0 right-0 top-0 flex h-full w-full flex-col bg-black/95">
              <div className="p-4">
                <button
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-white transition-colors dark:border-neutral-700"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close mobile menu"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="flex flex-col gap-4">
                  <Link 
                    href="/" 
                    className="flex h-12 items-center justify-center rounded-lg border border-neutral-800 bg-black text-white text-base transition-colors hover:bg-neutral-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    href="/search" 
                    className="flex h-12 items-center justify-center rounded-lg border border-neutral-800 bg-black text-white text-base transition-colors hover:bg-neutral-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Shop
                  </Link>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </nav>
  );
}