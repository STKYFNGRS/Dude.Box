import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="w-full bg-gray-800 text-white h-16 flex items-center justify-between px-4 sm:px-8">
      <Link href="/" passHref>
        <Image 
          src="/Logo_White.svg" 
          alt="Dude Logo"
          width={80} // Adjust width for mobile compatibility
          height={40}
          priority
        />
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
