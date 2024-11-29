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
        {/* Hero Section with doubled top padding */}
        <div className="w-full flex justify-center">
          <div className="container px-4 sm:px-6 mx-auto">
            <div className="pt-80 sm:pt-96 pb-24 sm:pb-48 flex items-center justify-center">
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
          </div>
        </div>

        {/* Content Sections with consistent padding */}
        <div className="w-full">
          <div className="container px-4 sm:px-6 mx-auto">
            <div className="max-w-4xl mx-auto pt-20 sm:pt-40 pb-16 text-center">
              <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                Welcome, Dude
              </h1>
              <p className="text-xl mb-10 text-gray-200">
                We&apos;re not just another brand. We&apos;re building something different here - 
                a community where men can be real, feel supported, and look good doing it.
              </p>
              
              {/* Mission Statement */}
              <div className="bg-gray-900 p-6 sm:p-8 rounded-lg mb-12 transition hover:bg-gray-800 border border-gray-700 shadow-lg">
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
                  <div className="bg-gray-900 p-6 rounded-lg mb-6 border border-gray-700 shadow-lg transition hover:bg-gray-800">
                    <h3 className="text-xl font-semibold mb-3">Core Services</h3>
                    <ul className="space-y-3 mb-4">
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
                  <div className="bg-gray-900 p-6 rounded-lg mb-6 border border-gray-700 shadow-lg transition hover:bg-gray-800">
                    <h3 className="text-xl font-semibold mb-3">Community-Driven Growth</h3>
                    <ul className="space-y-3 mb-4">
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
                  <div className="bg-gray-900 p-6 rounded-lg mb-6 border border-gray-700 shadow-lg transition hover:bg-gray-800">
                    <h3 className="text-xl font-semibold mb-3">Our Future Home</h3>
                    <ul className="space-y-3 mb-4">
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

              {/* From the Founder Section */}
              <div className="bg-gray-900 p-6 sm:p-8 rounded-lg border border-gray-700 shadow-lg transition hover:bg-gray-800">
                <h3 className="text-2xl font-semibold mt-6 mb-2">From the Founder</h3>
                <div className="flex justify-center mb-8">
                  <div className="relative w-full sm:w-80 h-80 rounded-lg overflow-hidden shadow-lg border border-gray-800">
                    <Image
                      src="/family2.jpg"
                      alt="Alex Moore with family"
                      fill
                      className="object-cover hover:scale-105 transition duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority
                    />
                  </div>
                </div>
                <p className="text-lg mb-4 text-gray-200">
                  Welcome to Dude. I&apos;m just a guy—a husband, a dad, a vet who&apos;s been around long enough to know that life doesn&apos;t pull its punches. I&apos;m not here to sell you some polished fairy tale. I built this brand from the ground up, alone, not because I needed another hobby, but because I saw a gap, a need—hell, a crisis—and couldn&apos;t sit on the sidelines anymore.
                </p>
              </div>

              {/* Call to Action */}
              <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/40 rounded-lg text-center">
                <p className="text-lg font-semibold text-blue-400 mb-2">
                  Every purchase, every NFT, every member brings us closer to opening our first location 
                  and providing free mental health support to those who need it.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Analytics />
      </div>
    </ClientLayout>
  );
}