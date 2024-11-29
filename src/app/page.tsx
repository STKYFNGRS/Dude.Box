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
      <div className="w-full min-h-screen bg-gradient-to-b from-black to-gray-900">
        <div className="flex flex-col items-center justify-center w-full">
          <Hero isLoaded={isLoaded} />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center max-w-7xl mx-auto">
            <h1 className="pt-12 sm:pt-16 lg:pt-20 text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
  Welcome, Dude
</h1>
              <p className="text-xl sm:text-2xl mb-10 text-gray-200 max-w-3xl text-center">
                We&apos;re not just another brand. We&apos;re building something different here - 
                a community where men can be real, feel supported, and look good doing it.
              </p>
              
              <div className="w-full">
                <Mission />
                <Vision />
                <Founder />
              </div>
            </div>
          </div>
          
          <Analytics />
        </div>
      </div>
    </ClientLayout>
  );
}