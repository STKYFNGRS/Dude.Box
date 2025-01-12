import Image from 'next/image';

const FounderSection = () => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm p-6 sm:p-8 rounded-lg border border-indigo-700/20 shadow-lg max-w-4xl mx-auto mb-12 transition-colors hover:border-indigo-700/40">
      <h3 className="text-2xl sm:text-3xl font-semibold mb-6 text-blue-300">From the Founder</h3>
      <div className="flex flex-col md:flex-row md:items-center gap-8">
        <div className="relative w-full md:w-1/2 h-64 md:h-80 rounded-lg overflow-hidden shadow-lg border border-indigo-700/20">
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
  );
};

export default FounderSection;