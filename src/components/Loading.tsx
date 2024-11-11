export default function Loading() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className="bg-[#1a1a1a] rounded-lg overflow-hidden animate-pulse"
          >
            <div className="aspect-square bg-gray-800" />
            <div className="p-4 space-y-3">
              <div className="h-6 bg-gray-800 rounded w-3/4" />
              <div className="h-4 bg-gray-800 rounded w-1/2" />
              <div className="h-8 bg-gray-800 rounded w-full mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }