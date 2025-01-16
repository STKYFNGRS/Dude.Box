'use client';

import { motion } from 'framer-motion';
import { Crown, Dumbbell, Gift, Zap } from 'lucide-react';

const Web3Hero = () => {
  return (
    <div className="relative overflow-hidden py-16 pt-40">
      {/* Local Glow Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-900/20 blur-[120px] rounded-full"></div>
      </div>
      
      {/* Content */}
      <div className="relative container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-blue-900/30 border border-blue-500/20 rounded-full px-4 py-1 mb-8"
          >
            <Crown className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">Founding Members Collection</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-700 bg-clip-text text-transparent"
          >
            Be Among The First
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Become a founding member and shape the future of mental health support. 
          </motion.p>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-gray-900/50 backdrop-blur-sm p-2 sm:p-4 rounded-lg border border-blue-900/30 hover:border-blue-700/40 transition-colors">
              <Zap className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <h3 className="text-base sm:text-xl md:text-2xl font-bold text-blue-400">Project Hosting</h3>
              <p className="text-xs sm:text-sm text-gray-300">Web3 Server Space</p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm p-2 sm:p-4 rounded-lg border border-blue-900/30 hover:border-blue-700/40 transition-colors">
              <Dumbbell className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <h3 className="text-base sm:text-xl md:text-2xl font-bold text-blue-400">Lifetime</h3>
              <p className="text-xs sm:text-sm text-gray-300">Gym Access</p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm p-2 sm:p-4 rounded-lg border border-blue-900/30 hover:border-blue-700/40 transition-colors">
              <Gift className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <h3 className="text-base sm:text-xl md:text-2xl font-bold text-blue-400">Rewards</h3>
              <p className="text-xs sm:text-sm text-gray-300">Permanent Benefits</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Web3Hero;