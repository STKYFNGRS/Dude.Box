"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CartDrawer } from '../../components/CartDrawer';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="w-full bg-black text-white flex items-center justify-between p-4">
      <Link href="/shop" passHref>
        <Image 
          src="/Dude logo 3.jpg" 
          alt="Dude Logo" 
          width={200} 
          height={50} 
          priority
        />
      </Link>

      <div className="flex items-center gap-4">
        <CartDrawer />
        
        {/* Hamburger Icon when menu is closed */}
        {!isOpen && (
          <button
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
            className="text-white focus:outline-none z-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        )}

        {/* Mobile Menu */}
        {isOpen && (
          <div className="fixed top-0 left-0 w-full h-auto bg-black text-center z-40">
            <nav
              id="mobile-menu"
              className="pt-16 pb-8 px-2 flex flex-col space-y-2"
              aria-hidden={!isOpen}
              role="menu"
              tabIndex={-1}
            >
              {/* Close button - X icon */}
              <button
                onClick={toggleMenu}
                aria-label="Close menu"
                className="absolute top-4 right-4 text-white focus:outline-none z-50"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <Link 
                href="/" 
                onClick={toggleMenu} 
                className="block py-3 bg-gray-900 hover:bg-gray-800 transition-colors duration-200 border border-gray-700 rounded-lg" 
                role="menuitem"
              >
                Home
              </Link>
              <Link 
                href="/about" 
                onClick={toggleMenu} 
                className="block py-3 bg-gray-900 hover:bg-gray-800 transition-colors duration-200 border border-gray-700 rounded-lg" 
                role="menuitem"
              >
                About
              </Link>
              <Link 
                href="/roadmap" 
                onClick={toggleMenu} 
                className="block py-3 bg-gray-900 hover:bg-gray-800 transition-colors duration-200 border border-gray-700 rounded-lg" 
                role="menuitem"
              >
                Roadmap
              </Link>
              <Link 
                href="/shop" 
                onClick={toggleMenu} 
                className="block py-3 bg-gray-900 hover:bg-gray-800 transition-colors duration-200 border border-gray-700 rounded-lg" 
                role="menuitem"
              >
                Shop
              </Link>
              <Link 
                href="/mint" 
                onClick={toggleMenu} 
                className="block py-3 bg-gray-900 hover:bg-gray-800 transition-colors duration-200 border border-gray-700 rounded-lg" 
                role="menuitem"
              >
                Mint
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;