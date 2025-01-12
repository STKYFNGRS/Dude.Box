const ServicesGrid = () => {
  return (
    <div className="max-w-4xl mx-auto mb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core Services */}
        <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-lg border border-indigo-700/20 shadow-lg h-full min-h-[320px] transition-colors hover:border-indigo-700/40">
          <h3 className="text-xl font-semibold mb-6 text-blue-300">Core Services</h3>
          <ul className="space-y-4 text-left text-gray-200">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              <span>Free one-on-one counseling with licensed therapists</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              <span>Free use space for AA meetings and support groups</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              <span>Professional services events like resume writing classes, haircuts and interview preparation workshops</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              <span>A community of dudes who get it</span>
            </li>
          </ul>
        </div>

        {/* Community Focus */}
        <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-lg border border-indigo-700/20 shadow-lg h-full min-h-[320px] transition-colors hover:border-indigo-700/40">
          <h3 className="text-xl font-semibold mb-6 text-blue-300">Community-Driven Growth</h3>
          <ul className="space-y-4 text-left text-gray-200">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              <span>Founding member NFTs with real voting power</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              <span>Premium social spaces with coffee and gaming</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              <span>Regular community events and gatherings</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              <span>Multi-purpose venue for events</span>
            </li>
          </ul>
        </div>

        {/* Physical Space */}
        <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-lg border border-indigo-700/20 shadow-lg h-full min-h-[320px] transition-colors hover:border-indigo-700/40">
          <h3 className="text-xl font-semibold mb-6 text-blue-300">Our Future Home</h3>
          <ul className="space-y-4 text-left text-gray-200">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              <span>10,000 sq ft community hub in San Diego</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              <span>Retail space with complete product line</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              <span>Dedicated counseling spaces</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              <span>Blueprint for nationwide expansion</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ServicesGrid;