"use client";

import { Analytics } from "@vercel/analytics/react";
import Layout from "../components/Layout";
import {Store, ShoppingBag, Users} from "lucide-react";

export default function Mint() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
        <div className="w-full max-w-2xl p-4">
         
           {/* NFT Information */}
          
        
  <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 shadow-lg transition duration-300 hover:bg-gray-800 mb-16">
    <h2 className="text-2xl font-semibold mb-6">The dude.box NFT Collection is coming soon</h2>
    <div className="text-gray-200 space-y-4">
      <p>
        Our NFTs represent membership in the founding community of dude.box. 
        Each unique NFT provides enhanced community benefits and influence:
      </p>
      <div className="space-y-6">
        {/* Voting Power */}
        <div className="p-4 bg-gray-800/50 rounded-lg">
          <h3 className="font-semibold mb-3 text-xl">Enhanced Voting Power</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>Weighted voting rights on product launches and initiatives</span>
            </li>
            <li className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>Early adopter voting multiplier for founding members</span>
            </li>
            <li className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span>Exclusive design choice voting on special editions</span>
            </li>
          </ul>
        </div>

        {/* Product Access */}
        <div className="p-4 bg-gray-800/50 rounded-lg">
          <h3 className="font-semibold mb-3 text-xl">Exclusive Products</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span>Access to NFT-holder-only limited edition products</span>
            </li>
            <li className="flex items-center gap-2">
              <Store className="w-5 h-5" />
              <span>First look and early access to all product drops</span>
            </li>
            <li className="flex items-center gap-2">
              <Store className="w-5 h-5" />
              <span>Special edition merchandise exclusives</span>
            </li>
          </ul>
        </div>

        {/* Community Recognition */}
        <div className="p-4 bg-gray-800/50 rounded-lg">
          <h3 className="font-semibold mb-3 text-xl">Community Status</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>Tiered badge system with engagement rewards</span>
            </li>
            <li className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>Milestone perks for long-term holders</span>
            </li>
            <li className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>Annual Community Appreciation event access</span>
            </li>
          </ul>
        </div>

        {/* Events and Access */}
        <div className="p-4 bg-gray-800/50 rounded-lg">
          <h3 className="font-semibold mb-3 text-xl">Premium Access</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>Priority booking for physical location events</span>
            </li>
            <li className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>Quarterly virtual events with team leadership</span>
            </li>
            <li className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>Behind-the-scenes access to brand development</span>
            </li>
          </ul>
        </div>
      </div>
      
      <p className="text-sm mt-6">
        Note: NFTs are intended for community access and engagement only. They do not represent 
        any ownership in dude.box or entitle holders to any profits or returns.
      </p>
    </div>
  </div>
        </div>
        <Analytics />
      </div>
    </Layout>
  );
}