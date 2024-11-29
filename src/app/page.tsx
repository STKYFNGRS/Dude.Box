'use client';

import React from 'react';
import { ClientLayout } from '@/app/components/Client-Layout';
import { Analytics } from "@vercel/analytics/react";
import { Hero } from '@/app/components/sections/Hero';
import { Mission } from '@/app/components/sections/Mission';
import { Vision } from '@/app/components/sections/Vision';
import { Founder } from '@/app/components/sections/Founder';

export default function Home() {
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <ClientLayout>
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
        <Hero isLoaded={isLoaded} />
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              Welcome, Dude
            </h1>
            <p className="text-xl sm:text-2xl mb-10 text-gray-200 max-w-3xl mx-auto">
              We&apos;re not just another brand. We&apos;re building something different here - 
              a community where men can be real, feel supported, and look good doing it.
            </p>
            
            <Mission />
            <Vision />
            <Founder />
          </div>
        </div>

        <Analytics />
      </div>
    </ClientLayout>
  );
}