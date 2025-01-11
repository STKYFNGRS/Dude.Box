import Link from 'next/link';

export default function ViewAllButton() {
  return (
    <div className="flex justify-center mt-8 mb-8">
      <Link
        href="/search"
        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 ease-in-out"
      >
        View All Products
      </Link>
    </div>
  );
}