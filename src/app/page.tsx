'use client';

import { ClientLayout } from '@/app/components/Client-Layout';
import { Analytics } from "@vercel/analytics/react";
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <ClientLayout>
      <div className="flex flex-col items-center justify-center flex-grow min-h-[calc(100vh-64px)] bg-gradient-to-b from-black to-gray-900">
        <div className="w-full max-w-7xl p-4 flex flex-col items-center justify-center">
          <Link 
            href="/shop" 
            passHref 
            className="relative w-full max-w-lg mx-auto flex items-center justify-center"
          >
            <Image
              src="/hunt pick 2.png"
              alt="Image of boy picking his nose"
              width={400}
              height={100}
              priority
              className="rounded-lg shadow-xl hover:scale-105 transition-transform duration-300"
            />
          </Link>
        </div>
        <Analytics />
      </div>
    </ClientLayout>
  );
}