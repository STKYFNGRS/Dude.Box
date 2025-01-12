import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden py-16">
      {/* Local Glow Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-900/20 blur-[120px] rounded-full"></div>
      </div>

      {/* Main Content */}
      <div className="relative container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Title */}
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 bg-clip-text text-transparent">
            Strength Through Community
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
            Join a community that's revolutionizing mental health support. 
            Every purchase brings us closer to opening our first physical location.
          </p>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-lg border border-indigo-900/30 hover:border-indigo-700/40 transition-colors">
              <h3 className="text-base sm:text-xl md:text-2xl font-bold text-blue-400">10,000 sq ft</h3>
              <p className="text-xs sm:text-sm text-gray-300">Future Community Hub</p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-lg border border-indigo-900/30 hover:border-indigo-700/40 transition-colors">
              <h3 className="text-base sm:text-xl md:text-2xl font-bold text-blue-400">Free</h3>
              <p className="text-xs sm:text-sm text-gray-300">Mental Health Support</p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-lg border border-indigo-900/30 hover:border-indigo-700/40 transition-colors">
              <h3 className="text-base sm:text-xl md:text-2xl font-bold text-blue-400">Community</h3>
              <p className="text-xs sm:text-sm text-gray-300">Driven Progress</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <Link href="/search">
              <button className="border-2 border-indigo-700 text-blue-300 hover:text-blue-200 hover:bg-indigo-900/20 px-6 py-2 rounded-lg font-semibold transition-all duration-300">
                Shop Now
              </button>
            </Link>
            <Link href="/web3">
              <button className="border-2 border-indigo-700 text-blue-300 hover:text-blue-200 hover:bg-indigo-900/20 px-6 py-2 rounded-lg font-semibold transition-all duration-300">
                Mint
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;