import Image from 'next/image';

const FounderSection = () => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm p-6 sm:p-8 rounded-lg border border-indigo-700/20 shadow-lg max-w-4xl mx-auto mb-12 transition-colors hover:border-indigo-700/40">
      <h3 className="text-2xl sm:text-3xl font-semibold mb-6 text-blue-300 text-center">From the Founder</h3>
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
        <div className="md:w-1/2 text-left space-y-4">
          <p className="text-lg text-gray-200">
          Welcome, I'm Alex Moore - dad, husband, veteran, and just a regular dude who's seen enough to know we've got a serious problem. Mental health support is broken. Getting help shouldn't require navigating waitlists, dealing with insurance mazes, or fighting stigma. But it does, and it's costing lives.
          </p> 
          <p className="text-lg text-gray-200">
          This isn't just another brand - it's a mission to fix what's broken. Every purchase directly funds our vision: building spaces where licensed therapists offer free support, where peer groups meet without judgment, and where community replaces isolation. I'm building this from the ground up because I believe access to mental health needs a reimagining.
          </p>
          <p className="text-lg text-gray-200">
          The plan is simple but ambitious: Your support helps us hire mental health professionals, create physical spaces for both one-on-one and group therapy, and build a community where seeking help is normalized, not stigmatized. 
          </p>
        </div>
      </div>
    </div>
  );
};

export default FounderSection;