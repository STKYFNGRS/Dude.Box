import Link from 'next/link';

const BottomCTA = () => {
  return (
    <div className="flex flex-wrap gap-4 justify-center items-center mt-12 mb-16">
      <Link href="/search">
        <button className="border-2 border-indigo-700 text-blue-300 hover:text-blue-200 hover:bg-indigo-900/20 px-6 py-2 rounded-lg font-semibold transition-all duration-300">
          Shop Now
        </button>
      </Link>
      <Link href="/web3">
        <button className="border-2 border-indigo-700 text-blue-300 hover:text-blue-200 hover:bg-indigo-900/20 px-6 py-2 rounded-lg font-semibold transition-all duration-300">
          Mint
        </button>
      </Link>
    </div>
  );
};

export default BottomCTA;