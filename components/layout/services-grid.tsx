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
              <span>Sacred space for AA and support groups to do the real work</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              <span>Life-skill workshops where theory meets practice (resumes, interviews, professional grooming)</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              <span>A tribe of brothers who understand the fight</span>
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
              <span>Premium social spaces where coffee meets gaming meets purpose</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              <span>Regular gatherings that turn strangers into brothers</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              <span>Event space for the moments that matter</span>
            </li>
          </ul>
        </div>

        {/* Physical Space */}
        <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-lg border border-indigo-700/20 shadow-lg h-full min-h-[320px] transition-colors hover:border-indigo-700/40">
          <h3 className="text-xl font-semibold mb-6 text-blue-300">The Vision</h3>
          <ul className="space-y-4 text-left text-gray-200">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              <span>10,000 sq ft fortress of solitude in San Diego's heart</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              <span>Full arsenal of products that speak to the soul</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              <span>Private chambers for the battles fought one-on-one</span>
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