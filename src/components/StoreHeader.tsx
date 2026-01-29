"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Container } from "@/components/Container";
import { CartDrawer } from "@/components/CartDrawer";

interface StoreHeaderProps {
  store: {
    name: string;
    logo_url: string | null;
  };
  basePath: string;
  isOwner: boolean;
}

export function StoreHeader({ store, basePath, isOwner }: StoreHeaderProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="border-b border-border bg-background/95 backdrop-blur-xl sticky top-0 z-40">
        <Container className="py-4">
          <div className="flex items-center justify-between">
            {/* Left side: Logo + Navigation */}
            <div className="flex items-center gap-8">
              {/* Logo/Store Name */}
              {store.logo_url ? (
                <Image
                  src={store.logo_url}
                  alt={store.name}
                  width={150}
                  height={50}
                  className="h-12 w-auto"
                />
              ) : (
                <h1 className="text-2xl font-bold">{store.name}</h1>
              )}

              {/* Desktop Navigation - inline with logo */}
              <nav className="hidden md:flex items-center gap-8">
                <Link
                  href={`${basePath}/`}
                  className="text-base font-medium text-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
                >
                  Home
                </Link>
                <Link
                  href={`${basePath}/products`}
                  className="text-base font-medium text-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
                >
                  Products
                </Link>
              </nav>
            </div>

            {/* Right side: Action Buttons + Hamburger */}
            <div className="flex items-center gap-3">
              {/* Desktop Actions */}
              <div className="hidden md:flex items-center gap-3">
                {isOwner && (
                  <Link
                    href="https://www.dude.box/members"
                    className="outline-button rounded-full px-5 py-2 text-xs uppercase tracking-[0.25em] leading-none"
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  href="https://www.dude.box"
                  className="outline-button rounded-full p-3"
                  aria-label="Back to Dude.Box"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </Link>
                {mounted && status === "authenticated" && (
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="outline-button rounded-full p-3"
                    aria-label="Shopping cart"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </Container>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <Container className="py-4">
              <nav className="flex flex-col gap-4 mb-4 pb-4 border-b border-border">
                <Link
                  href={`${basePath}/`}
                  className="text-base font-medium text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href={`${basePath}/products`}
                  className="text-base font-medium text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Products
                </Link>
              </nav>
              
              <div className="flex flex-col gap-3">
                  {isOwner && (
                    <Link
                      href="https://www.dude.box/members"
                      className="outline-button rounded-full px-5 py-2 text-xs uppercase tracking-[0.25em] leading-none text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  <Link
                    href="https://www.dude.box"
                    className="outline-button rounded-full px-5 py-2 text-xs uppercase tracking-[0.25em] leading-none text-center inline-flex items-center justify-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Home
                  </Link>
                  {mounted && status === "authenticated" && (
                    <button
                      onClick={() => {
                        setIsCartOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="outline-button rounded-full px-5 py-2 text-xs uppercase tracking-[0.25em] leading-none text-center inline-flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Cart
                    </button>
                  )}
                </div>
            </Container>
          </div>
        )}
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
