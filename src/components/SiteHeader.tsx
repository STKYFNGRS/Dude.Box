"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/Container";
import { CartDrawer } from "@/components/CartDrawer";
import { headerNavigationLinks } from "@/lib/constants";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const openButtonRef = useRef<HTMLButtonElement | null>(null);

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
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        openButtonRef.current?.focus();
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable = menuRef.current?.querySelectorAll<HTMLElement>(
        'a, button, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusable || focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

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
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-xl">
      <Container className="py-3 flex items-center justify-between">
        <div className="md:hidden w-10" aria-hidden="true" />
        <div className="flex flex-1 justify-center md:flex-none md:justify-start">
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
        <div className="flex flex-wrap items-center gap-4 md:gap-6">
          <nav
            aria-label="Primary"
            className="hidden md:flex flex-wrap items-center gap-6 text-sm uppercase tracking-[0.2em]"
          >
            {headerNavigationLinks.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-accent transition-colors">
                {item.label}
              </Link>
            ))}
            <Link
              href="/shop"
              className="solid-button rounded-full px-5 py-2 text-xs uppercase tracking-[0.25em] leading-none"
            >
              Shop
            </Link>
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
          </nav>
          <button
            ref={openButtonRef}
            type="button"
            aria-label="Open menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsOpen(true)}
            className="md:hidden inline-flex items-center justify-center border border-border rounded px-3 py-2"
          >
            <span className="sr-only">Open menu</span>
            <span className="flex flex-col gap-1">
              <span className="block h-px w-6 bg-foreground" />
              <span className="block h-px w-6 bg-foreground" />
              <span className="block h-px w-6 bg-foreground" />
            </span>
          </button>
        </div>
      </Container>

      <div
        className={`md:hidden fixed inset-0 z-40 transition-opacity duration-200 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-background/95"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
        <div
          id="mobile-menu"
          ref={menuRef}
          className={`relative z-50 h-full w-full bg-background border-t border-border px-6 py-8 transition-transform duration-200 ${
            isOpen ? "translate-y-0" : "-translate-y-2"
          }`}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between pb-6 border-b border-border">
            <span className="text-xs uppercase tracking-[0.35em] muted">Menu</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="outline-button rounded px-3 py-2 text-xs uppercase tracking-[0.25em]"
            >
              Close
            </button>
          </div>
          <div className="flex flex-col gap-6 pt-8 text-sm uppercase tracking-[0.2em]">
            {headerNavigationLinks.map((item) => (
              <Link key={item.href} href={item.href} className="py-2">
                {item.label}
              </Link>
            ))}
            <div className="border-t border-border pt-6 flex flex-col gap-3">
              <Link
                href="/shop"
                className="solid-button rounded-full px-5 py-3 text-xs uppercase tracking-[0.25em] inline-flex justify-center"
              >
                Shop
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsCartOpen(true);
                }}
                className="outline-button rounded-full px-5 py-3 text-xs uppercase tracking-[0.25em] inline-flex items-center justify-center gap-2"
              >
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
                Cart
                {cartCount > 0 ? (
                  <span className="ml-1 rounded-full bg-accent text-[10px] text-background px-2 py-0.5">
                    {cartCount}
                  </span>
                ) : null}
              </button>
            </div>
          </div>
        </div>
      </div>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
