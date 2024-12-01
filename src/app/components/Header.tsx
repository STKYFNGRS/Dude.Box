'use client';

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/app/components/CartContext";
import { CartDrawer } from "@/components/CartDrawer";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setIsOpen: setCartOpen } = useCart();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setCartOpen(false);
  };

  const navigationItems = [
    { href: "/", label: "Home" },
    { href: "/roadmap", label: "Roadmap" },
    { href: "/shop", label: "Shop" }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 w-full bg-black text-white flex items-center justify-between p-4 z-30">
      <Link href="/" passHref className="relative z-40">
        <Image
          src="/Dude logo 3.jpg"
          alt="Dude Logo"
          width={200}
          height={50}
          priority
          className="hover:opacity-90 transition-opacity"
        />
      </Link>

      <div className="flex items-center gap-4">
        <CartDrawer />

        {!isOpen && (
          <button
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
            className="text-white focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-lg p-2 hover:bg-gray-900 transition-colors z-40"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 22 22"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        )}

        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-95 text-center z-50">
            <nav
              id="mobile-menu"
              className="h-full pt-16 pb-8 px-4 flex flex-col space-y-4"
              aria-hidden={!isOpen}
              role="menu"
              tabIndex={-1}
            >
              <button
                onClick={toggleMenu}
                aria-label="Close menu"
                className="absolute top-4 right-4 text-white focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-lg p-2 hover:bg-gray-900 transition-colors"
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

              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={toggleMenu}
                  className="block py-4 px-6 bg-gray-900 hover:bg-gray-800 active:bg-gray-700 transition-colors duration-200 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                  role="menuitem"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;