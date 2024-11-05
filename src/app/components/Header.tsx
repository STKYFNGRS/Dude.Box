import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="w-full bg-black text-white h-16 flex items-center justify-between px-4 sm:px-8">
        <Link href="/" passHref>
          <Image  src="/Dude logo 3.jpg" // Path to your logo image
            alt="Dude Logo"
            width={200} // Base width to satisfy Next.js requirements
            height={100} // Base height to satisfy Next.js requirements
            priority  />
        </Link>
      <div className="hidden sm:flex space-x-4">
        <Link href="/" className="hover:text-gray-300">Home</Link>
        <Link href="/about" className="hover:text-gray-300">About</Link>
        <Link href="/contact" className="hover:text-gray-300">Contact</Link>
      </div>
    </header>
  );
};

export default Header;
