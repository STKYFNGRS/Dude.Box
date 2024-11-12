export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden animate-pulse">
          <div className="p-4">
            <div className="aspect-square bg-gray-900 rounded-md mb-4" />
            <div className="h-6 bg-gray-900 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-900 rounded w-1/2 mb-2" />
            <div className="h-4 bg-gray-900 rounded w-1/3 mb-4" />
            <div className="h-10 bg-gray-900 rounded w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}