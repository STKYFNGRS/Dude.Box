'use client';

import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

export default function MintAnnouncement() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 -mt-4 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-blue-900/30 p-6">
          <div className="flex items-center justify-center mb-3">
            <Rocket className="w-6 h-6 text-blue-400" />
          </div>

          <h3 className="text-xl font-semibold text-center text-blue-400 mb-3">
            Minting Coming Soon
          </h3>
          
          <p className="text-center text-gray-300 text-sm max-w-lg mx-auto">
            The Founding Members Collection is getting ready for launch. Preview the trait system below while you wait.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
