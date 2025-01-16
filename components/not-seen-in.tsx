'use client';

import { motion } from 'framer-motion';

const NotSeenIn = () => {
  const logos = [
    {
      name: 'Rolling Stone',
      text: 'Rolling Stone',
      width: 'w-44 sm:w-32', // Consistent width on mobile
      className: 'font-serif italic'
    },
    {
      name: 'TechCrunch',
      text: 'TechCrunch',
      width: 'w-44 sm:w-36',
      className: 'font-sans font-bold'
    },
    {
      name: 'New York Times',
      text: 'The New York Times',
      width: 'w-44',
      className: 'font-serif'
    },
    {
      name: 'Forbes',
      text: 'FORBES',
      width: 'w-44 sm:w-28',
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
            className="grid grid-cols-1 sm:flex sm:flex-wrap justify-center items-center gap-6 sm:gap-x-16 sm:gap-y-6 max-w-4xl mx-auto"
          >
            {logos.map((logo) => (
              <div 
                key={logo.name}
                className={`${logo.width} h-8 flex items-center justify-center`}
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