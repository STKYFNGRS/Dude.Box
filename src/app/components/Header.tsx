import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="w-full bg-gray-800 text-white h-16 flex items-center px-4 md:px-8">
      <nav className="max-w-6xl mx-auto w-full flex justify-between items-center">
        {/* Logo section */}
        <div className="flex items-center">
          <Link href="/" passHref>
            <Image 
              src="/Logo_White.svg"
              alt="Dude Logo"
              width={150} // Adjust width for desktop
              height={50}
              className="w-24 h-auto md:w-40" // Use responsive width
              priority 
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <Link href="/about" className="hover:text-gray-300">About</Link>
          <Link href="/contact" className="hover:text-gray-300">Contact</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
