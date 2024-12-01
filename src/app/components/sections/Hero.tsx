'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface HeroProps {
  isLoaded: boolean;
}

export const Hero: React.FC<HeroProps> = ({ isLoaded }) => {
  return (
    <div className="w-full flex justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-48 sm:pt-64 lg:pt-72 pb-12 sm:pb-16 lg:pb-20 flex items-center justify-center">
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
                  width={160}
                  height={160}
                  sizes="(max-width: 768px) 160px, 200px"
                  priority
                  className="rounded-full transform transition-all duration-500 group-hover:scale-105 w-40 h-40 sm:w-48 sm:h-48 lg:w-52 lg:h-52"
                />
                <span className="sr-only">Brand logo</span>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};