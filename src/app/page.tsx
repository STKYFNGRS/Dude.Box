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
        {/* Hero Section - Responsive */}
        <div className="w-full flex justify-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="pt-32 sm:pt-40 lg:pt-48 pb-16 sm:pb-20 lg:pb-24 flex items-center justify-center">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoaded ? 1 : 0 }}
                transition={{ duration: 1 }}
                className="relative z-10"
              >
                <Link href="/shop" className="group relative block">
                  <div className="absolute -inset-4 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition duration-500" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-gray-700 via-white to-gray-700 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-all duration-500 animate-pulse" />
                  <div className="relative">
                    <Image
                      src="/hunt pick 2.png"
                      alt="Brand logo"
                      width={200}
                      height={200}
                      priority
                      className="rounded-full transform transition-all duration-500 group-hover:scale-105"
                    />
                    <span className="sr-only">Brand logo</span>
                  </div>
                </Link>
              </motion.div>
            </div>

            {/* Content Section - Responsive Grid Layout */}
            <div className="max-w-7xl mx-auto">
              <div className="text-center px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                  Welcome, Dude
                </h1>
                <p className="text-xl sm:text-2xl mb-10 text-gray-200 max-w-3xl mx-auto">
                  We&apos;re not just another brand. We&apos;re building something different here - 
                  a community where men can be real, feel supported, and look good doing it.
                </p>
                
                {/* Mission Statement */}
                <div className="bg-gray-900 p-6 sm:p-8 rounded-lg mb-12 border border-gray-700 shadow-lg max-w-4xl mx-auto">
                  <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Our Mission</h2>
                  <p className="text-lg sm:text-xl text-gray-200">
                    To create products that guys actually want while building spaces where they can
                    be themselves. Every purchase helps us get closer to opening physical locations offering
                    free counseling, group support, and a place to just breathe.
                  </p>
                </div>

                {/* Vision Section - Grid Layout for Desktop */}
                <div className="mb-12">
                  <h2 className="text-2xl sm:text-3xl font-semibold mb-6">The Vision</h2>
                  <div className="text-lg text-gray-200">
                    <p className="mb-6 max-w-3xl mx-auto">
                      Imagine walking into a place where you don&apos;t have to have it all figured out.
                      Where getting help isn&apos;t a sign of weakness, but of strength. That&apos;s what we&apos;re building:
                    </p>
                    
                    {/* Services Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                      {/* Core Services */}
                      <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 shadow-lg h-full">
                        <h3 className="text-xl font-semibold mb-4">Core Services</h3>
                        <ul className="space-y-3">
                          <li className="flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                            <span>Free one-on-one counseling with licensed therapists</span>
                          </li>
                          <li className="flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                            <span>Free use space for AA meetings and support groups</span>
                          </li>
                          <li className="flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                            <span>Professional services like resume writing and interview prep</span>
                          </li>
                          <li className="flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                            <span>A community of dudes who get it</span>
                          </li>
                        </ul>
                      </div>

                      {/* Community Focus */}
                      <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 shadow-lg h-full">
                        <h3 className="text-xl font-semibold mb-4">Community-Driven Growth</h3>
                        <ul className="space-y-3">
                          <li className="flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                            <span>Founding member NFTs with real voting power</span>
                          </li>
                          <li className="flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                            <span>Premium social spaces with coffee and gaming</span>
                          </li>
                          <li className="flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                            <span>Regular community events and gatherings</span>
                          </li>
                          <li className="flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                            <span>Multi-purpose venue for events</span>
                          </li>
                        </ul>
                      </div>

                      {/* Physical Space */}
                      <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 shadow-lg h-full md:col-span-2 lg:col-span-1">
                        <h3 className="text-xl font-semibold mb-4">Our Future Home</h3>
                        <ul className="space-y-3">
                          <li className="flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                            <span>10,000 sq ft community hub in San Diego</span>
                          </li>
                          <li className="flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                            <span>Retail space with complete product line</span>
                          </li>
                          <li className="flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                            <span>Dedicated counseling spaces</span>
                          </li>
                          <li className="flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                            <span>Blueprint for nationwide expansion</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* From the Founder Section - Responsive Layout */}
                    <div className="bg-gray-900 p-6 sm:p-8 rounded-lg border border-gray-700 shadow-lg max-w-4xl mx-auto">
                      <h3 className="text-2xl sm:text-3xl font-semibold mb-6">From the Founder</h3>
                      <div className="flex flex-col md:flex-row md:items-center gap-8">
                        <div className="relative w-full md:w-1/2 h-64 md:h-80 rounded-lg overflow-hidden shadow-lg border border-gray-800">
                          <Image
                            src="/family2.jpg"
                            alt="Alex Moore with family"
                            fill
                            className="object-cover hover:scale-105 transition duration-300"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                          />
                        </div>
                        <div className="md:w-1/2">
                          <p className="text-lg text-gray-200">
                            Welcome to Dude. I&apos;m just a guy—a husband, a dad, a vet who&apos;s been around long enough to know that life doesn&apos;t pull its punches. I&apos;m not here to sell you some polished fairy tale. I built this brand from the ground up, alone, not because I needed another hobby, but because I saw a gap, a need—hell, a crisis—and couldn&apos;t sit on the sidelines anymore.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Call to Action - Full Width */}
                    <div className="mt-12 p-6 sm:p-8 bg-blue-500/20 border border-blue-500/40 rounded-lg text-center max-w-4xl mx-auto">
                      <p className="text-lg sm:text-xl font-semibold text-blue-400">
                        Every purchase, every NFT, every member brings us closer to opening our first location 
                        and providing free mental health support to those who need it.
                      </p>
                    </div>
                  </div>
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