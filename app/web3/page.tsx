'use client';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Suspense } from 'react';
import Web3Footer from './components/layout/web3-footer';
import Web3Hero from './components/Web3Hero';
import NFTValueProps from './components/NFTValueProps';
import ProjectRoadmap from './components/ProjectRoadmap';
import LegalDisclaimer from './components/LegalDisclaimer';
import MintInterface from './components/MintInterface';

export default function Web3Page() {
  return (
    <>
      <main className="flex-grow overflow-y-auto">
        {/* Hero Section */}
        <Web3Hero />

        {/* Mint Interface Section */}
        <div className="w-full py-16">
          <div className="max-w-3xl mx-auto px-4">
            <Suspense fallback={<div className="text-center text-gray-400">Loading...</div>}>
              <MintInterface />
            </Suspense>
          </div>
        </div>

        {/* Value Proposition Section */}
        <NFTValueProps />

        {/* Project Roadmap */}
        <ProjectRoadmap />

        {/* Legal Disclaimer */}
        <LegalDisclaimer />
      </main>

      <Web3Footer />
      <Analytics />
      <SpeedInsights />
    </>
  );
}