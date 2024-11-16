'use client';

import { Analytics } from "@vercel/analytics/react";
import { Store, ShoppingBag, Users, Star, Shield, Image as ImageIcon } from "lucide-react";
import { ClientLayout } from '@/app/components/Client-Layout';
import Image from 'next/image';

export default function Mint() {
  return (
    <ClientLayout>
      <div className="relative z-0 pt-24 min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
        {/* Hero Section with background image */}
        <div className="relative h-[60vh] w-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <Image
            src="/hunt pick 2.png" // Replace this with the path to your background image
            alt="Mint Background"
            layout="fill"
            className="object-cover object-center opacity-20"
            priority
          />
          <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600">
              The Founding Dudes Collection
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Become one of our founding members and help shape the future of men&apos;s mental health and wellness.
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">20,000</p>
                <p className="text-sm text-gray-400">Total Supply</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">0.09 ETH</p>
                <p className="text-sm text-gray-400">Mint Price</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">∞</p>
                <p className="text-sm text-gray-400">Potential Impact</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-16">
          {/* Coming Soon Banner */}
          <div className="bg-blue-500/20 border border-blue-500/40 rounded-lg p-4 mb-12 text-center">
            <h2 className="text-xl font-semibold text-blue-400">Under Construction</h2>
            <p className="text-gray-200">Stay tuned for whitelist opportunities and early access.</p>
          </div>

          {/* Purpose Statement */}
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 shadow-lg transition duration-300 hover:bg-gray-800 mb-12">
            <h2 className="text-2xl font-semibold mb-4">More Than Just an NFT</h2>
            <p className="text-lg text-gray-200 mb-6">
              Your Founding Dude NFT is your key to helping build spaces where men can find support,
              connection, and purpose. Every mint directly supports our mission to create physical
              locations offering free mental health services and community support.
            </p>
            <div className="bg-gray-800/50 p-6 rounded-lg mb-6">
              <div className="flex items-center gap-3 mb-4">
                <ImageIcon className="w-8 h-8 text-blue-400" aria-label="Personalization icon" />
                <h3 className="text-xl font-semibold">Personalized NFT Display</h3>
              </div>
              <p className="text-gray-200">
                Make your mark on our community by customizing your Founding Dude NFT with any image you choose.
                Your personalized NFT will be proudly displayed at our headquarters in San Diego, California,
                creating a physical gallery of our founding members.
              </p>
            </div>
          </div>

          {/* Benefits Sections */}
          <div className="space-y-6">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 shadow-lg transition duration-300 hover:bg-gray-800">
              <h3 className="text-2xl font-semibold mb-4">Community Governance</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-400" aria-label="Users icon" />
                  <div>
                    <p className="font-semibold">Weighted Voting Power</p>
                    <p className="text-sm text-gray-400">Direct influence on product launches and community initiatives.</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-blue-400" aria-label="Star icon" />
                  <div>
                    <p className="font-semibold">Early Adopter Benefits</p>
                    <p className="text-sm text-gray-400">Enhanced voting weight for founding members.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 shadow-lg transition duration-300 hover:bg-gray-800">
              <h3 className="text-2xl font-semibold mb-4">Member Benefits</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-blue-400" aria-label="Shopping bag icon" />
                    <div>
                      <p className="font-semibold">Limited Edition Drops</p>
                      <p className="text-sm text-gray-400">Exclusive access to member-only products.</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <Store className="w-5 h-5 text-blue-400" aria-label="Store icon" />
                    <div>
                      <p className="font-semibold">Early Access</p>
                      <p className="text-sm text-gray-400">First look at all new products and collaborations.</p>
                    </div>
                  </li>
                </ul>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-400" aria-label="Users icon" />
                    <div>
                      <p className="font-semibold">VIP Events</p>
                      <p className="text-sm text-gray-400">Priority access to physical and virtual events.</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-blue-400" aria-label="Shield icon" />
                    <div>
                      <p className="font-semibold">Founding Member Status</p>
                      <p className="text-sm text-gray-400">Permanent recognition in our community.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 p-4 bg-gray-800/30 rounded-lg text-center">
            <p className="text-sm text-gray-400">
              The Founding Dudes Collection NFTs represent community membership and access rights only. They do not constitute investment securities, ownership in dude.box, or entitle holders to any profits or returns. Benefits are subject to terms and conditions.
            </p>
          </div>
        </div>
        <Analytics />
      </div>
    </ClientLayout>
  );
}
