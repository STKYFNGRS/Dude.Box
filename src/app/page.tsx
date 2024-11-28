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
        <div className="max-w-3xl mx-auto h-[calc(100vh-64px)] flex items-center justify-center">
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

        {/* Content Sections */}
        <div className="max-w-3xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            Welcome, Dude
          </h1>
          <p className="text-xl mb-8 text-gray-200">
            We&apos;re not just another brand. We&apos;re building something different here - 
            a community where men can be real, feel supported, and look good doing it.
          </p>
          
          {/* Rest of the sections */}
        </div>

        <Analytics />
      </div>
    </ClientLayout>
  );
}