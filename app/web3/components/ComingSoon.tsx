'use client';

import { SparklesIcon } from '@heroicons/react/24/outline';

export default function ComingSoon() {
  return (
    <div className="w-full max-w-4xl mx-auto my-16 px-4">
      <div className="relative bg-[#0f1015] rounded-3xl border border-[#1a1c24] p-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="inline-block py-1 px-4 rounded-full bg-[#1a1c24] text-purple-400 text-sm font-medium">
            Founding Members Collection
          </span>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold text-center text-purple-400 mb-6">
          Be Among The First
        </h2>
        
        <p className="max-w-2xl mx-auto text-center text-gray-400 mb-12">
          Become a founding member and shape the future of digital identity.
          Preview our trait system below while minting is being prepared.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-xl bg-[#1a1c24] text-center">
            <SparklesIcon className="w-8 h-8 mx-auto mb-4 text-purple-400" />
            <div className="text-xl font-semibold text-purple-300 mb-2">Dynamic</div>
            <p className="text-sm text-gray-400">Traits that adapt to your identity</p>
          </div>
          
          <div className="p-6 rounded-xl bg-[#1a1c24] text-center">
            <SparklesIcon className="w-8 h-8 mx-auto mb-4 text-purple-400" />
            <div className="text-xl font-semibold text-purple-300 mb-2">Unique</div>
            <p className="text-sm text-gray-400">True digital representation</p>
          </div>
          
          <div className="p-6 rounded-xl bg-[#1a1c24] text-center">
            <SparklesIcon className="w-8 h-8 mx-auto mb-4 text-purple-400" />
            <div className="text-xl font-semibold text-purple-300 mb-2">Evolving</div>
            <p className="text-sm text-gray-400">Growing with your journey</p>
          </div>
        </div>
      </div>
    </div>
  );
}