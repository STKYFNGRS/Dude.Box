"use client";

import { Analytics } from "@vercel/analytics/react";
import Layout from "../components/Layout";
import { Store, ShoppingBag, Users, Star, Shield, Trophy } from "lucide-react";

export default function Mint() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
        <div className="w-full max-w-3xl p-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              The Founding Dudes Collection
            </h1>
            <p className="text-xl text-gray-200 mb-6">
              Be one of the 20,000 founding members shaping the future of men&apos;s mental health and wellness
            </p>
            <div className="flex justify-center gap-4 mb-8">
              <div className="text-center">
                <p className="text-3xl font-bold">20,000</p>
                <p className="text-sm text-gray-400">Total Supply</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">0.13 ETH</p>
                <p className="text-sm text-gray-400">Mint Price</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">∞</p>
                <p className="text-sm text-gray-400">Potential Impact</p>
              </div>
            </div>
          </div>

          {/* Coming Soon Banner */}
          <div className="bg-blue-500/20 border border-blue-500/40 rounded-lg p-4 mb-12 text-center">
            <h2 className="text-xl font-semibold text-blue-400">Minting Opens Soon</h2>
            <p className="text-gray-200">Stay tuned whitelist opportunities and early access</p>
          </div>

          {/* Purpose Statement */}
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 shadow-lg transition duration-300 hover:bg-gray-800 mb-12">
            <h2 className="text-2xl font-semibold mb-4">More Than Just an NFT</h2>
            <p className="text-lg text-gray-200 mb-6">
              Your Founding Dude NFT is your key to helping build spaces where men can find support,
              connection, and purpose. Every mint directly supports our mission to create physical
              locations offering free mental health services and community support.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <Shield className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <p className="font-semibold">Community First</p>
                <p className="text-sm text-gray-400">Real impact, real community</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <p className="font-semibold">Founding Member</p>
                <p className="text-sm text-gray-400">Shape our future</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <Star className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <p className="font-semibold">Lifetime Benefits</p>
                <p className="text-sm text-gray-400">Growing with us</p>
              </div>
            </div>
          </div>

          {/* Benefits Sections */}
          <div className="space-y-6">
            {/* Governance */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 shadow-lg transition duration-300 hover:bg-gray-800">
              <h3 className="text-2xl font-semibold mb-4">Community Governance</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Weighted Voting Power</p>
                    <p className="text-sm text-gray-400">Direct influence on product launches and community initiatives</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Early Adopter Benefits</p>
                    <p className="text-sm text-gray-400">Enhanced voting weight for founding members</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Exclusive Access */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 shadow-lg transition duration-300 hover:bg-gray-800">
              <h3 className="text-2xl font-semibold mb-4">Member Benefits</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Limited Edition Drops</p>
                      <p className="text-sm text-gray-400">Exclusive access to member-only products</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <Store className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Early Access</p>
                      <p className="text-sm text-gray-400">First look at all new products and collaborations</p>
                    </div>
                  </li>
                </ul>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">VIP Events</p>
                      <p className="text-sm text-gray-400">Priority access to physical and virtual events</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Founding Member Status</p>
                      <p className="text-sm text-gray-400">Permanent recognition in our community</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Legal Notice */}
          <div className="mt-8 p-4 bg-gray-800/30 rounded-lg">
            <p className="text-sm text-gray-400 text-center">
              The Founding Dudes Collection NFTs represent community membership and access rights only. 
              They do not constitute investment securities, ownership in dude.box, or entitle holders 
              to any profits or returns. Benefits are subject to terms and conditions.
            </p>
          </div>
        </div>
        <Analytics />
      </div>
    </Layout>
  );
}