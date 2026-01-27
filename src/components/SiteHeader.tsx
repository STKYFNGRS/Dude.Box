"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Container } from "@/components/Container";
import { LoginModal } from "@/components/LoginModal";

export function SiteHeader() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { data: session, status } = useSession();

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
          {status === "loading" ? (
            // Show loading state to prevent flash
            <div className="outline-button rounded-full px-5 py-2 text-xs uppercase tracking-[0.25em] leading-none opacity-50">
              ...
            </div>
          ) : status === "authenticated" ? (
            <Link
              href="/portal"
              className="outline-button rounded-full px-5 py-2 text-xs uppercase tracking-[0.25em] leading-none inline-flex items-center"
              aria-label="Account"
            >
              Account
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
    </>
  );
}
