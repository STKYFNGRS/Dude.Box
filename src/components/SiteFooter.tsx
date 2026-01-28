"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Container } from "@/components/Container";
import { footerNavigationLinks } from "@/lib/constants";

export function SiteFooter() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <footer className="border-t border-border bg-background">
      <Container className="py-8 flex flex-col gap-6 text-sm muted">
        <nav aria-label="Footer" className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.2em]">
          {footerNavigationLinks.map((item) => {
            // Handle login/account link dynamically based on session
            if (item.label === "Login") {
              if (!mounted || status === "loading") {
                // Show placeholder during loading to prevent layout shift
                return (
                  <span key="auth-placeholder" className="opacity-50">
                    Login
                  </span>
                );
              }
              
              if (status === "authenticated") {
                // User is logged in - show Account link
                return (
                  <Link
                    key="account"
                    href="/portal"
                    className="hover:text-accent transition-colors"
                  >
                    Account
                  </Link>
                );
              }
              
              // User is not logged in - show Login button that opens modal
              return (
                <button
                  key="login"
                  type="button"
                  onClick={() => window.dispatchEvent(new Event("open:login-modal"))}
                  className="hover:text-accent transition-colors"
                >
                  Login
                </button>
              );
            }
            
            // Regular navigation links
            return (
              <Link key={item.href} href={item.href} className="hover:text-accent transition-colors">
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex flex-col gap-2">
          <span>Veteran-owned. Small batch. Built for daily carry.</span>
          <span>
            Contact:{" "}
            <a href="mailto:dude@dude.box" className="underline underline-offset-4">
              dude@dude.box
            </a>
          </span>
        </div>
        <span className="text-xs">
          © {new Date().getFullYear()} dude.box LLC. All rights reserved.
        </span>
      </Container>
    </footer>
  );
}
