"use client";

import { Analytics } from "@vercel/analytics/react";
import Layout from "./components/Layout";
import Link from 'next/link';
import Image from 'next/image';

// Remove the viewport export and add it to your app metadata or layout instead
// The viewport configuration should go in a separate layout.js or page.js file

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-b from-black to-gray-900 text-white min-h-screen">
        <div className="relative">
          <Link href="/shop" passHref>
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
    </Layout>
  );
}