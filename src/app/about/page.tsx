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
      Where getting help isn&apost a sign of weakness, but of strength. That&apos;s what we&apos;re building:
    </p>
    
    {/* Core Services */}
    <div className="bg-gray-900 p-6 rounded-lg mb-6 border border-gray-800 shadow-lg transition duration-300 hover:bg-gray-800">
      <h3 className="text-xl font-semibold mb-3">Core Services</h3>
      <ul className="text-left mx-auto max-w-xl space-y-3 mb-4">
        <li className="flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
          Free one-on-one counseling with licensed therapists
        </li>
        <li className="flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
          Free use space for AA meetings and other community support groups
        </li>
        <li className="flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
          Access to professional services like resume writing, job search, interview preparation, haircuts and more
        </li>
        <li className="flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
          A community of dudes who get it
        </li>
      </ul>
    </div>

    {/* Community Focus */}
    <div className="bg-gray-900 p-6 rounded-lg mb-6 border border-gray-800 shadow-lg transition duration-300 hover:bg-gray-800">
      <h3 className="text-xl font-semibold mb-3">Community-Driven Growth</h3>
      <ul className="text-left mx-auto max-w-xl space-y-3 mb-4">
        <li className="flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
          Founding member NFTs with real voting power on brand decisions
        </li>
        <li className="flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
          Premium social spaces with coffee bar and gaming areas
        </li>
        <li className="flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
          Regular community events and exclusive member gatherings
        </li>
        <li className="flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
          Multi-purpose venue for both private and community events
        </li>
      </ul>
    </div>

    {/* Physical Space */}
    <div className="bg-gray-900 p-6 rounded-lg mb-6 border border-gray-800 shadow-lg transition duration-300 hover:bg-gray-800">
      <h3 className="text-xl font-semibold mb-3">Our Future Home</h3>
      <ul className="text-left mx-auto max-w-xl space-y-3 mb-4">
        <li className="flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
          10,000 sq ft mixed-use community hub in San Diego, California
        </li>
        <li className="flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
          Retail space featuring our complete product line
        </li>
        <li className="flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
          Dedicated spaces for counseling and support services
        </li>
        <li className="flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
          Blueprint for future locations nationwide
        </li>
      </ul>
    </div>
  </div>
</div>

{/* Revenue Impact Section - NEW */}
<div className="mb-12 bg-gray-900 p-6 rounded-lg border border-gray-800 shadow-lg transition duration-300 hover:bg-gray-800">
  <h2 className="text-2xl font-semibold mb-4">Impact Through Action</h2>
  <p className="text-lg text-gray-200 mb-4">
    We are building a sustainable model where business success directly funds community support:
  </p>
  <ul className="text-left mx-auto max-w-xl space-y-3">
    <li className="flex items-center">
      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
      100% of counseling services provided free of charge
    </li>
    <li className="flex items-center">
      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
      Revenue from retail and events supports mental health programs
    </li>
    <li className="flex items-center">
      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
      Community ownership through NFTs ensures long-term alignment
    </li>
    <li className="flex items-center">
      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
      Profitable growth enables expansion to more communities
    </li>
  </ul>
</div>
          
          {/* Founder's Message */}
          <div className="bg-gray-900 p-8 rounded-lg transition duration-300 hover:bg-gray-800 border border-gray-800 shadow-lg">
  {/* Header and Image Section */}
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

  {/* Content Section */}
  <div className="max-w-3xl mx-auto">
    <div className="space-y-4">
      {/* Rest of the content remains exactly the same */}
      <p className="text-lg mb-4 text-gray-200">
        I&apos;m Alex Moore - just a regular dude, husband, dad, and veteran who&apos;s been around
        long enough to know that life doesn&apos;t pull its punches. I&apos;m not here to sell you
        some polished fairy tale. I&apos;m building this brand because I see a crisis that demands action.
      </p>

      <div className="bg-gray-800/50 p-4 rounded-lg">
        <h4 className="font-semibold mb-3 text-white">The Reality We Face:</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-3 bg-gray-900/50 rounded-lg">
            <p className="text-2xl font-bold text-blue-400">1 in 3</p>
            <p className="text-sm text-gray-300">men will seek help when struggling with mental health</p>
          </div>
          <div className="p-3 bg-gray-900/50 rounded-lg">
            <p className="text-2xl font-bold text-blue-400">3.7x</p>
            <p className="text-sm text-gray-300">higher suicide rate among men than women</p>
          </div>
          <div className="p-3 bg-gray-900/50 rounded-lg">
            <p className="text-2xl font-bold text-blue-400">75%</p>
            <p className="text-sm text-gray-300">of men feel unable to discuss personal challenges</p>
          </div>
          <div className="p-3 bg-gray-900/50 rounded-lg">
            <p className="text-2xl font-bold text-blue-400">5 months</p>
            <p className="text-sm text-gray-300">average wait time for mental health services</p>
          </div>
        </div>
      </div>

      <p className="text-lg text-gray-200">
        I know what it&apos;s like to feel like you&apos;re facing the world alone, with all its
        noise and chaos. When you&apos;re taught that asking for help means you&apos;re weak. When the 
        support you need exists, but the barriers to get it feel insurmountable. That&apos;s why 
        dude.box isn&apos;t just another brand. It&apos;s a vehicle for change, a way to create the 
        support system I wish I&apos;d had.
      </p>

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

    {/* Impact Statement */}
    <div className="mt-8 border-t border-gray-800 pt-6">
      <div className="grid md:grid-cols-3 gap-4 text-center">
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <h5 className="font-semibold text-blue-400">Phase 1</h5>
          <p className="text-sm text-gray-300">Build our community and establish brand presence</p>
        </div>
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <h5 className="font-semibold text-blue-400">Phase 2</h5>
          <p className="text-sm text-gray-300">Launch first physical location in San Diego</p>
        </div>
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <h5 className="font-semibold text-blue-400">Phase 3</h5>
          <p className="text-sm text-gray-300">Expand to additional cities nationwide</p>
        </div>
      </div>
    </div>

    {/* Call to Action */}
    <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/40 rounded-lg text-center">
      <p className="text-lg font-semibold text-blue-400 mb-2">
        Join Us in Making a Difference
      </p>
      <p className="text-gray-200">
        Every purchase, every NFT, every member brings us closer to opening our first location 
        and providing free mental health support to those who need it most.
      </p>
    </div>
  </div>
</div>


</div>


        </div>
        
        <Analytics />
  
    </Layout>
  );
}