'use client';

import { ClientLayout } from '@/app/components/Client-Layout';
import { Analytics } from "@vercel/analytics/react";
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <ClientLayout>
      {/* Restored original gradient */}
      <div className="relative flex items-center justify-center h-[calc(100vh-64px)] bg-gradient-to-b from-black to-gray-900 overflow-hidden">
        {/* Main content */}
        <div className={`relative z-10 transition-all duration-1000 transform ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          <Link 
            href="/shop" 
            className="group relative block"
          >
            {/* Ambient glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-300" />
            
            {/* Enhanced edge glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-700 via-white to-gray-700 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-all duration-500 animate-pulse" />
            
            {/* Image container */}
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 rounded-full opacity-50 group-hover:opacity-70 transition duration-300" />
              <Image
                src="/hunt pick 2.png"
                alt="Image of boy picking his nose"
                width={200}
                height={200}
                priority
                className="rounded-full transform transition-all duration-500 group-hover:scale-105 relative"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </Link>
        </div>

        <Analytics />
      </div>
    </ClientLayout>
  );
}