'use client';

import { ClientLayout } from '@/app/components/Client-Layout';
import { Analytics } from "@vercel/analytics/react";
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <ClientLayout>
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
        {/* Hero Section */}
        <div className="h-[calc(100vh-64px)] flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 1 }}
            className="relative z-10"
          >
            <Link href="/shop" className="group relative block">
              <div className="absolute -inset-4 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-300" />
              <div className="absolute -inset-1 bg-gradient-to-r from-gray-700 via-white to-gray-700 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-all duration-500 animate-pulse" />
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 rounded-full opacity-50 group-hover:opacity-70 transition duration-300" />
                <Image
                  src="/hunt pick 2.png"
                  alt="Brand logo"
                  width={200}
                  height={200}
                  priority
                  className="rounded-full transform transition-all duration-500 group-hover:scale-105 relative"
                />
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Content Section Container */}
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center px-4">
            <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              Welcome, Dude
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              We&apos;re not just another brand. We&apos;re building something different here - 
              a community where men can be real, feel supported, and look good doing it.
            </p>
            
            {/* Mission Statement */}
            <div className="bg-gray-900 p-8 rounded-lg mb-12 transition duration-300 hover:bg-gray-800 border border-gray-800 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-lg text-gray-200">
                To create products that guys actually want while building spaces where they can
                be themselves. Every purchase helps us get closer to opening physical locations offering
                free counseling, group support, and a place to just breathe.
              </p>
            </div>

            {/* Vision Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">The Vision</h2>
              <div className="text-lg text-gray-200">
                <p className="mb-4">
                  Imagine walking into a place where you don&apos;t have to have it all figured out.
                  Where getting help isn&apos;t a sign of weakness, but of strength. That&apos;s what we&apos;re building:
                </p>
                
                {/* Core Services */}
                <div className="bg-gray-900 p-6 rounded-lg mb-6 border border-gray-800 shadow-lg transition duration-300 hover:bg-gray-800">
                  <h3 className="text-xl font-semibold mb-3">Core Services</h3>
                  <ul className="text-left mx-auto max-w-xl space-y-3 mb-4">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Free one-on-one counseling with licensed therapists
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Free use space for AA meetings and other community support groups
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Access to professional services like resume writing, job search, interview preparation, haircuts and more
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      A community of dudes who get it
                    </li>
                  </ul>
                </div>

                {/* Community Focus */}
                <div className="bg-gray-900 p-6 rounded-lg mb-6 border border-gray-800 shadow-lg transition duration-300 hover:bg-gray-800">
                  <h3 className="text-xl font-semibold mb-3">Community-Driven Growth</h3>
                  <ul className="text-left mx-auto max-w-xl space-y-3 mb-4">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Founding member NFTs with real voting power on brand decisions
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Premium social spaces with coffee bar and gaming areas
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Regular community events and exclusive member gatherings
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Multi-purpose venue for both private and community events
                    </li>
                  </ul>
                </div>

                {/* Physical Space */}
                <div className="bg-gray-900 p-6 rounded-lg mb-6 border border-gray-800 shadow-lg transition duration-300 hover:bg-gray-800">
                  <h3 className="text-xl font-semibold mb-3">Our Future Home</h3>
                  <ul className="text-left mx-auto max-w-xl space-y-3 mb-4">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      10,000 sq ft mixed-use community hub in San Diego, California
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Retail space featuring our complete product line
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Dedicated spaces for counseling and support services
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Blueprint for future locations nationwide
                    </li>
                  </ul>
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