"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/app/components/CartContext";
import { CartDrawer } from "@/components/CartDrawer";

interface HeaderProps {
  address?: string;
  initializeWallet: () => void;
  disconnectWallet: () => void;
}

const Header: React.FC<HeaderProps> = ({ address, initializeWallet, disconnectWallet }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { setIsOpen: setCartOpen } = useCart();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setCartOpen(false); // Close cart drawer when menu opens
  };

  const navigationItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/roadmap", label: "Roadmap" },
    { href: "/shop", label: "Shop" },
    {
      group: "Onchain",
      items: [
        ...(address
          ? [
              {
                href: "#",
                label: `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`,
                onClick: disconnectWallet,
              },
            ]
          : [
              {
                href: "#",
                label: "Connect Wallet",
                onClick: initializeWallet,
              },
            ]),
        { href: "/mint", label: "Mint" },
        { href: "/token", label: "Token" },
      ],
    },
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

        {/* Hamburger Icon */}
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

        {/* Mobile Menu */}
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-95 text-center z-50">
            <nav
              id="mobile-menu"
              className="h-full pt-16 pb-8 px-4 flex flex-col space-y-4"
              aria-hidden={!isOpen}
              role="menu"
              tabIndex={-1}
            >
              {/* Close button */}
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

              {navigationItems.map((item) => {
                if (item.group) {
                  return (
                    <div
                      key={item.group}
                      className="relative mt-8 p-6 border border-gray-700 rounded-lg bg-gray-800"
                    >
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-black px-4">
                        <span className="text-sm text-gray-400">
                          {item.group}
                        </span>
                      </div>

                      <div className="space-y-4">
                        {/* Connect Wallet with Subtle Pulsing Effect */}
                        {item.items[0].label === "Connect Wallet" && (
                          <Link
                            href={item.items[0].href || "#"}
                            onClick={item.items[0].onClick}
                            className="block py-3 px-4 bg-gray-900 hover:bg-gray-800 active:bg-gray-700 transition-colors duration-200 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white font-semibold animate-pulse-subtle"
                            role="menuitem"
                          >
                            {item.items[0].label}
                          </Link>
                        )}

                        {/* Mint and Token on Same Row */}
                        <div className="grid grid-cols-2 gap-4">
                          {item.items.slice(1).map((subItem, index) => (
                            <Link
                              key={index}
                              href={subItem.href || "#"}
                              className="py-3 px-4 bg-gray-900 hover:bg-gray-800 active:bg-gray-700 transition-colors duration-200 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm text-white text-center"
                              role="menuitem"
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href || "#"}
                    onClick={toggleMenu}
                    className="block py-4 px-6 bg-gray-900 hover:bg-gray-800 active:bg-gray-700 transition-colors duration-200 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    role="menuitem"
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
