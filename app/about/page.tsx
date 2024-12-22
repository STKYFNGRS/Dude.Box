import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import Image from 'next/image';
import Footer from '../../components/layout/footer';

export default function AboutPage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-20 pb-16">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8" style={{ color: '#A020F0' }}>
                About Us
              </h1>
              
              {/* Mission Statement */}
              <div className="bg-gray-900 p-6 sm:p-8 rounded-lg mb-12 border border-gray-700 shadow-lg max-w-4xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-white">Our Mission</h2>
                <p className="text-lg sm:text-xl text-gray-200">
                  To create products that people actually want while building spaces where they can
                  become better versions of themselves. Every purchase helps us get closer to opening physical locations offering
                  free counseling from licensed therapists, group support, exercise facilities, gaming rooms and more.
                </p>
              </div>

              {/* Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 max-w-7xl mx-auto">
                {/* Core Services */}
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 shadow-lg h-full">
                  <h3 className="text-xl font-semibold mb-4 text-white">Core Services</h3>
                  <ul className="space-y-3 text-left text-gray-200">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                      <span>Free one-on-one counseling with licensed therapists</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                      <span>Free use space for AA meetings and support groups</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                      <span>Professional services events like resume writing classes, free haircuts and interview preparation workshops</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                      <span>A community of dudes who get it</span>
                    </li>
                  </ul>
                </div>

                {/* Community Focus */}
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 shadow-lg h-full">
                  <h3 className="text-xl font-semibold mb-4 text-white">Community-Driven Growth</h3>
                  <ul className="space-y-3 text-left text-gray-200">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                      <span>Founding member NFTs with real voting power</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                      <span>Premium social spaces with coffee and gaming</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                      <span>Regular community events and gatherings</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                      <span>Multi-purpose venue for events</span>
                    </li>
                  </ul>
                </div>

                {/* Physical Space */}
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 shadow-lg h-full">
                  <h3 className="text-xl font-semibold mb-4 text-white">Our Future Home</h3>
                  <ul className="space-y-3 text-left text-gray-200">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                      <span>10,000 sq ft community hub in San Diego</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                      <span>Retail space with complete product line</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                      <span>Dedicated counseling spaces</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                      <span>Blueprint for nationwide expansion</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* From the Founder Section */}
              <div className="bg-gray-900 p-6 sm:p-8 rounded-lg border border-gray-700 shadow-lg max-w-4xl mx-auto mb-12">
                <h3 className="text-2xl sm:text-3xl font-semibold mb-6 text-white">From the Founder</h3>
                <div className="flex flex-col md:flex-row md:items-center gap-8">
                  <div className="relative w-full md:w-1/2 h-64 md:h-80 rounded-lg overflow-hidden shadow-lg border border-gray-800">
                    <Image
                      src="/logos/fam.jpg"
                      alt="Alex Moore with family"
                      fill
                      className="object-cover hover:scale-105 transition duration-300"
                      style={{ objectPosition: '75% center' }}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </div>
                  <div className="md:w-1/2 text-left">
                    <p className="text-lg text-gray-200">
                      Welcome, I&apos;m Alex Moore, just a regular dude, a husband, dad, and veteran who&apos;s been around long enough 
                      to know that life doesn&apos;t pull its punches. I&apos;m not here to sell you some polished fairy tale. 
                      I&apos;m building this brand from the ground up, not because I needed another hobby, but because 
                      I see a crisis and can&apos;t sit on the sidelines anymore.
                    </p>
                  </div>
                </div>
              </div>

               {/* Statistics Section */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 shadow-lg">
                  <h4 className="text-3xl font-bold text-blue-400 mb-2">1 in 5</h4>
                  <p className="text-gray-200">
                    Adult men experience mental illness each year, but less than 40% seek help
                  </p>
                </div>

                <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 shadow-lg">
                  <h4 className="text-3xl font-bold text-blue-400 mb-2">4x</h4>
                  <p className="text-gray-200">
                    Men are four times more likely to die by suicide, with over 38,000 men dying annually
                  </p>
                </div>

                <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 shadow-lg">
                  <h4 className="text-3xl font-bold text-blue-400 mb-2">75%</h4>
                  <p className="text-gray-200">
                    Of all suicide deaths in the US are men.
                  </p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-12 p-6 sm:p-8 bg-blue-500/20 border border-blue-500/40 rounded-lg text-center max-w-4xl mx-auto">
                <p className="text-lg sm:text-xl font-semibold text-blue-400">
                  Every purchase, every NFT, every member brings us closer to opening our first location 
                  and providing free mental health support to those who need it.
                </p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
        <Analytics/>
        <SpeedInsights/>
      </div>
    </>
  );
}