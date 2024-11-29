'use client';

import React from 'react';
import Image from 'next/image';
import { Stats } from './founder/Stats';
import { ImpactPhases } from './founder/ImpactPhases';

export const Founder: React.FC = () => {
  return (
    <div className="bg-gray-900 p-8 rounded-lg transition duration-300 hover:bg-gray-800 border border-gray-800 shadow-lg">
      <div className="text-center mb-12">
        <h3 className="text-2xl font-semibold mb-8">From the Founder</h3>
        <div className="flex justify-center mb-12">
          <div className="relative w-96 h-96 rounded-lg overflow-hidden shadow-xl border-2 border-gray-800">
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
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="space-y-4">
          <p className="text-lg mb-4 text-gray-200">
            I&apos;m Alex Moore - just a regular dude, husband, dad, and veteran who&apos;s been around
            long enough to know that life doesn&apos;t pull its punches. I&apos;m building this brand 
            because I see a crisis that demands action.
          </p>

          <Stats />

          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-white">Our Solution:</h4>
            <p className="text-gray-200">
              We&apos;re building spaces where getting help is normalized. Where mental health support 
              is free, immediate, and delivered by professionals who understand men&apos;s unique challenges. 
              Where finding community doesn&apos;t require a crisis first.
            </p>
          </div>

          <p className="text-lg text-gray-200">
            So here&apos;s the deal: buy our stuff if you like it. Wear it if it feels right. 
            But know that every dollar you spend here pushes us closer to creating places 
            where dudes can find solid ground in a world that loves to keep us off-balance. 
            We&apos;re not just selling products - we&apos;re funding a mission to change how men 
            access mental health support.
          </p>
        </div>

        <ImpactPhases />
      </div>
    </div>
  );
};