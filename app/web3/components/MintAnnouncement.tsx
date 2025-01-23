'use client';

import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

export default function MintAnnouncement() {
  const glowVariants = {
    animate: {
      boxShadow: [
        '0 0 20px rgba(59, 130, 246, 0.2)',
        '0 0 40px rgba(59, 130, 246, 0.4)',
        '0 0 20px rgba(59, 130, 246, 0.2)',
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const rocketVariants = {
    animate: {
      y: [-2, 2, -2],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const backgroundShimmer = {
    animate: {
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 -mt-4 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          variants={glowVariants}
          animate="animate"
          className="relative overflow-hidden bg-gradient-to-r from-gray-900/90 via-gray-900/95 to-gray-900/90 backdrop-blur-sm rounded-2xl border border-blue-500/30 p-8"
        >
          <motion.div
            variants={backgroundShimmer}
            animate="animate"
            className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent"
            style={{ backgroundSize: '200% 100%' }}
          />
          
          <div className="relative z-10">
            <motion.div 
              className="flex items-center justify-center mb-4"
              variants={rocketVariants}
              animate="animate"
            >
              <div className="p-4 rounded-full bg-blue-500/10">
                <div className="relative">
                  <svg width="0" height="0">
                    <defs>
                      <linearGradient id="rocketGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#ffffff" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <Rocket className="w-8 h-8" style={{ stroke: 'url(#rocketGradient)' }} />
                </div>
              </div>
            </motion.div>

            <motion.h3 
              className="text-2xl font-bold text-center bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              
            </motion.h3>
            
            <motion.p 
              className="text-center text-gray-300 text-base max-w-lg mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              The Founding Members Collection is getting ready for launch. Preview the trait system below while you wait.
            </motion.p>

            <motion.div
              className="mt-6 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse" />
                Coming Q4 2025
              </span>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}