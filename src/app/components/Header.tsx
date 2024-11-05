import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="w-full bg-gray-800 text-white flex items-center h-16"> {/* Set height here */}
      <nav className="max-w-4xl mx-auto flex justify-between items-center w-full h-full">
        <Link href="/" passHref>
          <Image 
            src="/Logo_White.svg" 
            alt="Dude Logo" 
            width={200} // Adjust width as needed
            height={40}  // Adjust height to match visual requirements
            priority 
          />
        </Link>
        <div className="flex space-x-4">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <Link href="/about" className="hover:text-gray-300">About</Link>
          <Link href="/contact" className="hover:text-gray-300">Contact</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
