'use client';

import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import LogoSquare from '../../../../components/logo-square';

export default function Web3Header() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected, connector } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [coinbaseWallet, setCoinbaseWallet] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    // Initialize with Base chain configuration
    setCoinbaseWallet(new CoinbaseWalletSDK({
      appName: "DUDE.BOX",
      appLogoUrl: "/logo.png",
      darkMode: true,
      chainId: 8453, // Base Mainnet
      rpcUrl: process.env.BASE_RPC_URL
    }));
  }, []);

  const truncateAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleDisconnect = async () => {
    try {
      if (coinbaseWallet) {
        const provider = coinbaseWallet.makeWeb3Provider(
          process.env.BASE_RPC_URL,
          8453
        );
        if (provider) {
          try {
            await provider.close();
          } catch (e) {
            console.error('Close error:', e);
          }
          try {
            await provider.disconnect();
          } catch (e) {
            console.error('Disconnect error:', e);
          }
        }
      }
      disconnect();
      window.location.reload();
    } catch (error) {
      console.error('Disconnect error:', error);
      disconnect();
    }
  };

  const handleConnect = async () => {
    if (isConnected) {
      await handleDisconnect();
    } else {
      try {
        await connect({ 
          connector: injected(),
          chainId: 8453 // Ensure connecting to Base Mainnet
        });
      } catch (error) {
        console.error('Connection error:', error);
      }
    }
  };

  return (
    <nav className="relative flex items-center justify-between p-4 lg:px-6 border-b border-neutral-200 dark:border-neutral-700">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center">
          <Link
            href="/"
            className="mr-2 flex items-center justify-center md:w-auto lg:mr-6"
          >
            <LogoSquare />
          </Link>
        </div>
        
        <div className="flex items-center gap-6">
          <ul className="flex gap-6 text-sm items-center">
            <li>
              <Link
                href="/"
                className="text-neutral-400 underline-offset-4 hover:text-white hover:underline"
              >
                Shop
              </Link>
            </li>
          </ul>
          
          <div className="flex justify-end">
            {mounted && (
              <button 
                onClick={handleConnect}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {isConnected ? truncateAddress(address!) : 'Connect Wallet'}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}