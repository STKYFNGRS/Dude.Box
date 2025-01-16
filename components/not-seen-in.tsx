'use client';

import { motion } from 'framer-motion';

const NotSeenIn = () => {
  const logos = [
    {
      name: 'Rolling Stone',
      text: 'Rolling Stone',
      className: 'font-serif italic'
    },
    {
      name: 'TechCrunch',
      text: 'TechCrunch',
      className: 'font-sans font-bold'
    },
    {
      name: 'New York Times',
      text: 'The New York Times',
      className: 'font-serif'
    },
    {
      name: 'Forbes',
      text: 'FORBES',
      className: 'font-sans font-bold'
    }
  ];

  return (
    <div className="w-full py-8">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-[10px] text-gray-600/20 mb-8 tracking-wider uppercase">Not Seen In</p>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-6 sm:gap-x-16 max-w-4xl mx-auto"
          >
            {logos.map((logo) => (
              <div 
                key={logo.name}
                className="flex items-center justify-center text-center w-full sm:w-auto"
              >
                <p className={`text-gray-600/50 hover:text-gray-600/60 transition-colors text-xl sm:text-2xl ${logo.className}`}>
                  {logo.text}
                </p>
              </div>
            ))}
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-[10px] text-gray-600/50 mt-8 italic"
          >
            (Because we just launched and haven&apos;t been featured anywhere... yet)
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default NotSeenIn;