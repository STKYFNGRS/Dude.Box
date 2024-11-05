"use client"; 

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
      
      {/* Hamburger Icon */}
      <button
        onClick={toggleMenu}
        className="sm:hidden text-white focus:outline-none"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
      
      {/* Menu for Desktop */}
      <nav className="hidden sm:flex space-x-4">
        <Link href="/" className="hover:text-gray-300">Home</Link>
        <Link href="/about" className="hover:text-gray-300">About</Link>
        <Link href="/contact" className="hover:text-gray-300">Contact</Link>
      </nav>
      
      {/* Menu for Mobile */}
      {isOpen && (
        <nav className="sm:hidden absolute top-16 left-0 w-full bg-gray-800 text-center py-4">
          <Link href="/" onClick={toggleMenu} className="block py-2 hover:text-gray-300">Home</Link>
          <Link href="/about" onClick={toggleMenu} className="block py-2 hover:text-gray-300">About</Link>
          <Link href="/contact" onClick={toggleMenu} className="block py-2 hover:text-gray-300">Contact</Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
