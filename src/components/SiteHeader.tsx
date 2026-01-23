"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Container } from "@/components/Container";
import { CartDrawer } from "@/components/CartDrawer";
import { LoginModal } from "@/components/LoginModal";

export function SiteHeader() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { data: session, status } = useSession();

  const refreshCartCount = useCallback(async () => {
    try {
      const response = await fetch("/api/cart", { method: "GET" });
      if (!response.ok) {
        return;
      }
      const payload = await response.json();
      setCartCount(Number(payload?.cart?.totalQuantity ?? 0));
    } catch (error) {
      // Ignore cart badge failures.
    }
  }, []);

  useEffect(() => {
    refreshCartCount();
    const handleCartUpdate = (event: Event) => {
      const detail = (event as CustomEvent).detail as { totalQuantity?: number } | undefined;
      if (typeof detail?.totalQuantity === "number") {
        setCartCount(detail.totalQuantity);
        return;
      }
      refreshCartCount();
    };
    window.addEventListener("cart:updated", handleCartUpdate);
    return () => window.removeEventListener("cart:updated", handleCartUpdate);
  }, [refreshCartCount]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-xl">
        <Container className="py-3 flex items-center justify-between">
          <div className="flex flex-1 justify-start">
            <Link href="/" aria-label="dude.box home" className="inline-flex items-center">
              <Image
                src="/Logo.png"
                alt="dude.box logo"
                width={400}
                height={100}
                className="w-72 h-auto"
                priority
              />
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsLoginOpen(true)}
              className="outline-button rounded-full px-5 py-2 text-xs uppercase tracking-[0.25em] leading-none"
              aria-label={status === "authenticated" ? "Account" : "Login"}
            >
              {status === "authenticated" ? "Account" : "Login"}
            </button>
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="outline-button rounded-full px-3 py-2 text-xs uppercase tracking-[0.25em] leading-none relative"
              aria-label="Open cart"
            >
              <span className="sr-only">Cart</span>
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="20" r="1" />
                <circle cx="17" cy="20" r="1" />
                <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L21 7H6" />
              </svg>
              {cartCount > 0 ? (
                <span className="absolute -top-2 -right-2 h-5 min-w-[20px] rounded-full bg-accent text-[10px] text-background flex items-center justify-center px-1">
                  {cartCount}
                </span>
              ) : null}
            </button>
          </div>
        </Container>
      </header>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
