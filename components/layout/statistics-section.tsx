const StatisticsSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
      <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-indigo-700/20 shadow-lg transition-colors hover:border-indigo-700/40">
        <h4 className="text-3xl font-bold text-blue-400 mb-2">1 in 5</h4>
        <p className="text-gray-200">
          Adult men experience mental illness each year, but less than 40% seek help
        </p>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-indigo-700/20 shadow-lg transition-colors hover:border-indigo-700/40">
        <h4 className="text-3xl font-bold text-blue-400 mb-2">4x</h4>
        <p className="text-gray-200">
          Men are four times more likely to die by suicide, with over 38,000 men dying annually
        </p>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-indigo-700/20 shadow-lg transition-colors hover:border-indigo-700/40">
        <h4 className="text-3xl font-bold text-blue-400 mb-2">75%</h4>
        <p className="text-gray-200">
          Of all suicide deaths in the US are men.
        </p>
      </div>
    </div>
  );
};

export default StatisticsSection;