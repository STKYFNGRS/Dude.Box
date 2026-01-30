"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Container } from "@/components/Container";
import { LoginModal } from "@/components/LoginModal";
import { CartDrawer } from "@/components/CartDrawer";

export function SiteHeader() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch and flash by waiting for client-side mount
  useEffect(() => {
    setMounted(true);

    // Listen for custom event to open login modal from anywhere in the app
    const handleOpenLogin = () => setIsLoginOpen(true);
    window.addEventListener("open:login-modal", handleOpenLogin);

    return () => {
      window.removeEventListener("open:login-modal", handleOpenLogin);
    };
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
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-xl">
        <Container className="py-3 flex items-center justify-between">
          <div className="flex items-end gap-8">
            <Link href="https://www.dude.box" aria-label="dude.box home" className="inline-flex items-center">
              <Image
                src="/Logo.png"
                alt="dude.box logo"
                width={400}
                height={100}
                className="w-72 h-auto max-w-[180px] md:max-w-none"
                priority
                unoptimized
              />
            </Link>
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link
                href="/marketplace"
                className="text-base font-medium text-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
              >
                Marketplace
              </Link>
              <Link
                href="/stores"
                className="text-base font-medium text-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
              >
                Browse Stores
              </Link>
            </nav>
          </div>

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-foreground hover:text-primary transition-colors"
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
        </Container>

        {/* Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-border bg-background">
            <Container className="py-4">
              <nav className="flex flex-col gap-4 mb-4 pb-4 border-b border-border">
                <Link
                  href="/marketplace"
                  className="text-base font-medium text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Marketplace
                </Link>
                <Link
                  href="/stores"
                  className="text-base font-medium text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Browse Stores
                </Link>
              </nav>
              <div className="flex flex-col gap-3">
                {!mounted || status === "loading" ? (
                  <div className="outline-button rounded-full px-5 py-2 text-xs uppercase tracking-[0.25em] leading-none opacity-0 pointer-events-none">
                    Account
                  </div>
                ) : status === "authenticated" ? (
                  <>
                    <Link
                      href="https://www.dude.box/members"
                      className="outline-button rounded-full px-5 py-2 text-xs uppercase tracking-[0.25em] leading-none text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
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
                    <button
                      onClick={async () => {
                        setIsMobileMenuOpen(false);
                        try {
                          await fetch("/api/auth/signout-handler", { method: "POST" });
                          await new Promise(resolve => setTimeout(resolve, 100));
                        } catch (error) {
                          console.error("Failed to clear cart:", error);
                        }
                        await signOut({ callbackUrl: "/" });
                      }}
                      className="outline-button rounded-full px-5 py-2 text-xs uppercase tracking-[0.25em] leading-none text-center"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsLoginOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="outline-button rounded-full px-5 py-2 text-xs uppercase tracking-[0.25em] leading-none text-center"
                    >
                      Login
                    </button>
                    <Link
                      href="/portal/register"
                      className="solid-button rounded-full px-5 py-2 text-xs uppercase tracking-[0.25em] leading-none text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </Container>
          </div>
        )}
      </header>
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
