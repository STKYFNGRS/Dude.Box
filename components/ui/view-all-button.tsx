import Link from 'next/link';

export default function ViewAllButton() {
  return (
    <div className="flex justify-center mt-8 mb-8">
      <Link
        href="/search"
        className="border-2 border-indigo-700 text-blue-300 hover:text-blue-200 hover:bg-indigo-900/20 px-6 py-2 rounded-lg font-semibold transition-all duration-300"
      >
        View All Products
      </Link>
    </div>
  );
}