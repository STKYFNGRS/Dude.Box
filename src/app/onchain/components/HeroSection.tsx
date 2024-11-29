'use client';

import Image from 'next/image';

export const HeroSection = () => {
  return (
    <div className="relative h-[40vh] w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-black/60 z-10" />
      <Image
        src="/hunt pick 2.png"
        alt="Onchain Background"
        layout="fill"
        className="object-cover object-center opacity-20"
        priority
      />
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600">
          Dude Box Web3
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Your gateway to our decentralized ecosystem
        </p>
      </div>
    </div>
  );
};
