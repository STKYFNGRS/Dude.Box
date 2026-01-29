"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Container } from "@/components/Container";
import { LoginModal } from "@/components/LoginModal";
import { CartDrawer } from "@/components/CartDrawer";

export function SiteHeader() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
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

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-xl">
        <Container className="py-3 flex items-center justify-between">
          <div className="flex flex-1 justify-start">
            <Link href="https://www.dude.box" aria-label="dude.box home" className="inline-flex items-center">
              <Image
                src="/Logo.png"
                alt="dude.box logo"
                width={400}
                height={100}
                className="w-72 h-auto"
                priority
                unoptimized
              />
            </Link>
          </div>
          <div className="flex items-center gap-3">
          {/* Only show cart for authenticated users */}
          {mounted && status === "authenticated" && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="outline-button rounded-full px-5 py-2 text-xs uppercase tracking-[0.25em] leading-none"
              aria-label="Shopping cart"
            >
              Cart
            </button>
          )}
          {!mounted || status === "loading" ? (
            // Show loading state to prevent flash - invisible but maintains layout
            <div className="outline-button rounded-full px-5 py-2 text-xs uppercase tracking-[0.25em] leading-none opacity-0 pointer-events-none">
              Account
            </div>
          ) : status === "authenticated" ? (
            <Link
              href="https://www.dude.box/members"
              className="outline-button rounded-full px-5 py-2 text-xs uppercase tracking-[0.25em] leading-none inline-flex items-center"
              aria-label="Dashboard"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsLoginOpen(true)}
                className="outline-button rounded-full px-5 py-2 text-xs uppercase tracking-[0.25em] leading-none"
                aria-label="Login"
              >
                Login
              </button>
              <Link
                href="/portal/register"
                className="solid-button rounded-full px-5 py-2 text-xs uppercase tracking-[0.25em] leading-none inline-flex items-center"
                aria-label="Sign Up"
              >
                Sign Up
              </Link>
            </>
          )}
          </div>
        </Container>
      </header>
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
