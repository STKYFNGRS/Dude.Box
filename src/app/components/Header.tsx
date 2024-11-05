"use client"; // Ensure this component is client-side for useState

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="w-full bg-black text-white flex items-center justify-between p-4">
      <Link href="/" passHref>
        <Image 
          src="/Dude logo 3.jpg" 
          alt="Dude Logo" 
          width={200} 
          height={50} 
          priority
        />
      </Link>

      {/* Always show Hamburger Icon */}
      <button
        onClick={toggleMenu}
        className="text-white focus:outline-none"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      {/* Hide Desktop Menu, use Mobile Menu instead */}
      {isOpen && (
        <nav className="absolute top-16 left-0 w-full bg-black text-center py-4">
          <Link href="/" onClick={toggleMenu} className="block py-2 hover:text-gray-300">Home</Link>
          <Link href="/about" onClick={toggleMenu} className="block py-2 hover:text-gray-300">About</Link>
          <Link href="/shop" onClick={toggleMenu} className="block py-2 hover:text-gray-300">Shop</Link>
          <Link href="/mint" onClick={toggleMenu} className="block py-2 hover:text-gray-300">Mint</Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
