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
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col">
        {/* Hero Section */}
        <div className="pt-24 pb-24 max-w-3xl mx-auto flex-1 h-full flex items-center justify-center px-4">
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
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Content Sections */}
        <div className="pt-16 pb-16 max-w-4xl mx-auto text-center px-6">
          <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            Welcome, Dude
          </h1>
          <p className="text-xl mb-8 text-gray-200">
            We&apos;re not just another brand. We&apos;re building something different here - 
            a community where men can be real, feel supported, and look good doing it.
          </p>
          
          {/* Mission Statement */}
          <div className="bg-gray-900 p-8 rounded-lg mb-12 transition hover:bg-gray-800 border border-gray-700 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-lg text-gray-200">
              To create products that guys actually want while building spaces where they can
              be themselves. Every purchase helps us get closer to opening physical locations offering
              free counseling, group support, and a place to just breathe.
            </p>
          </div>

          {/* From the Founder Section */}
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-700 shadow-lg transition hover:bg-gray-800">
            <h3 className="text-2xl font-semibold mt-6 mb-2">From the Founder</h3>
            <div className="flex justify-center mb-8">
              <div className="relative w-80 h-80 rounded-lg overflow-hidden shadow-lg border border-gray-800">
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
            <p className="text-lg mb-4">
              Welcome to Dude. I&apos;m just a guy—a husband, a dad, a vet who&apos;s been around long enough to know that life doesn&apos;t pull its punches. I&apos;m not here to sell you some polished fairy tale. I built this brand from the ground up, alone, not because I needed another hobby, but because I saw a gap, a need—hell, a crisis—and couldn&apos;t sit on the sidelines anymore.
            </p>
            <p className="text-lg mb-4">
              I know what it&apos;s like to feel like you&apos;re facing the world alone, with all its noise and chaos, and maybe that&apos;s why Dude isn&apos;t just another brand to me. It&apos;s a vehicle, a lifeline, a way to carve out a space for the real conversations men aren&apos;t supposed to have. Every sale, every piece we make, is a step toward something bigger: a place here in San Diego where men can walk in, breathe out, and shed the armor. An office for free counseling, one-on-one talks, group sessions, AA meetings, jobs—whatever it takes to help another guy keep going.
            </p>
            <p className="text-lg">
              So here&apos;s the deal. Buy our stuff if you like it. Wear it if it feels right. But know that every dollar you spend here pushes us closer to a place where men—guys just like me, just like you—can find a little bit of solid ground in a world that loves to keep us off-balance.
            </p>
          </div>
        </div>

        <Analytics />
      </div>
    </ClientLayout>
  );
}
