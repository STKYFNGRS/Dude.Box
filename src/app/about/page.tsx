"use client";

import { Analytics } from "@vercel/analytics/react";
import Layout from "../components/Layout";
import Image from "next/image";

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-b from-black to-gray-900 text-white min-h-screen">
        <div className="max-w-3xl text-center">
          {/* Hero Section */}
          <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            Welcome to dude.box
          </h1>
          <p className="text-xl mb-8 text-gray-200">
            We&apos;re not just another brand. We&apos;re building something different here - 
            a community where dudes can be real, feel supported, and look good doing it.
          </p>
          
          {/* Mission Statement */}
          <div className="bg-gray-900 p-8 rounded-lg mb-12 transition duration-300 hover:bg-gray-800 border border-gray-800 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-lg text-gray-200">
              To create products that dudes actually want while building spaces where they can
              be themselves. Every purchase helps us get closer to opening physical locations offering
              free counseling, group support, and a place to just breathe.
            </p>
          </div>
          
          {/* Vision Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">The Vision</h2>
            <div className="text-lg text-gray-200">
              <p className="mb-4">
                Imagine walking into a place where you don&apos;t have to have it all figured out.
                Where getting help isn&apos;t a sign of weakness, but of strength. That&apos;s what we&apos;re building:
              </p>
              <ul className="text-left mx-auto max-w-xl space-y-3 mb-4">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Free one-on-one counseling with licensed therapists
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Space for AA meetings and support groups
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Professional services like resume writing, haircuts and styling
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  A community of dudes who get it
                </li>
              </ul>
            </div>
          </div>
          
          {/* Founder's Message */}
          <div className="bg-gray-900 p-8 rounded-lg transition duration-300 hover:bg-gray-800 border border-gray-800 shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">From the founder</h3>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative w-48 h-48 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src="/family2.jpg"
                  alt="Alex Moore with family"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="text-left">
                <p className="text-lg mb-4 text-gray-200">
                  I&apos;m Alex Moore - just a regular dude, husband, dad, and veteran who&apos;s been around
                  long enough to know that life doesn&apos;t pull its punches. I&apos;m not here to sell you
                  some polished fairy tale. I&apos;m building this brand because I see a crisis, and
                  can&apos;t sit on the sidelines anymore.
                </p>
                <p className="text-lg mb-4 text-gray-200">
                  I know what it&apos;s like to feel like you&apos;re facing the world alone, with all its
                  noise and chaos. That&apos;s why dude.box isn&apos;t just another brand. It&apos;s a
                  vehicle for change, a way to create the support system I wish I&apos;d had.
                </p>
                <p className="text-lg text-gray-200">
                  So here&apos;s the deal: buy our stuff if you like it. Wear it if it feels right.
                  But know that every dollar you spend here pushes us closer to creating a place
                  where dudes can find solid ground in a world that loves to keep us off-balance.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <Analytics />
      </div>
    </Layout>
  );
}