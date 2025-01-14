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
              <span>Licensed therapy without the red tape or bullshit</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              <span>Dedicated space for AA and other peer-led support groups</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              <span>Life-skill workshops where theory meets practice (resume writing, interviews prep, career guidance, etc)</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              <span>A community of dudes who get it.</span>
            </li>
          </ul>
        </div>

        {/* Community Focus */}
        <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-lg border border-indigo-700/20 shadow-lg h-full min-h-[320px] transition-colors hover:border-indigo-700/40">
          <h3 className="text-xl font-semibold mb-6 text-blue-300">Community-Driven Growth</h3>
          <ul className="space-y-4 text-left text-gray-200">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              <span>Founding members shape our future through NFT voting rights</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              <span>Premium social spaces</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              <span>Regular gatherings and events</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              <span>Local impact with national reach</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              <span>Member-led initiatives</span>
            </li>
          </ul>
        </div>

        {/* Physical Space */}
        <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-lg border border-indigo-700/20 shadow-lg h-full min-h-[320px] transition-colors hover:border-indigo-700/40">
          <h3 className="text-xl font-semibold mb-6 text-blue-300">The Vision</h3>
          <ul className="space-y-4 text-left text-gray-200">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              <span>10,000 sq ft HQ in the heart of San Diego</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              <span>Private and Group Meeting Spaces</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              <span>State of the art exercise facility</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              <span>Gourmet Deli and Beverage Counter</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              <span>The first outpost in what will become a nationwide brotherhood</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ServicesGrid;