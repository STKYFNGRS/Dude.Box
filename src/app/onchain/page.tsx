'use client';

import { ClientLayout } from '@/app/components/Client-Layout';
import { Analytics } from "@vercel/analytics/react";
import Image from 'next/image';

export default function Onchain() {
  return (
    <ClientLayout>
      <div className="relative flex-1 min-h-[calc(100vh-64px)]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/hunt pick 2.png"
            alt="Background"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-gray-900/80" />
        </div>

        {/* Page Content */}
        <div className="relative z-10">
          {/* Hero Section */}
          <div className="pt-32 md:pt-40 pb-12">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
                  Welcome to the future, dude
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                  Web3 functionality coming soon.
                </p>
              </div>
            </div>
          </div>

          {/* Placeholder Section */}
          <div className="w-full max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8 p-8 bg-gray-800/50 rounded-xl border border-gray-700 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-4 text-center">Get Started with Web3</h2>
              <div className="max-w-xl mx-auto space-y-8">
                <div className="text-center p-6 rounded-lg border border-purple-500/20 bg-purple-500/5">
                  <h3 className="text-lg font-semibold mb-2">Web3 Integration</h3>
                  <p className="text-gray-400 mb-4">Our Web3 features are currently under maintenance. Check back soon!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Analytics />
      </div>
    </ClientLayout>
  );
}