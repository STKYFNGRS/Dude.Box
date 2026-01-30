"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  const handleSignOut = async () => {
    try {
      // Clear cart cookie first (creates new guest cart on next visit)
      await fetch("/api/auth/signout-handler", {
        method: "POST",
      });
      
      // Small delay to ensure cookie is cleared
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      // Continue with signout even if this fails
      console.error("Failed to clear cart:", error);
    }
    
    // Sign out of NextAuth with proper redirect to clear all cookies
    await signOut({ callbackUrl: "/" });
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      aria-label="Sign out of your account"
      className="outline-button rounded px-4 py-2 text-xs uppercase tracking-[0.2em]"
    >
      Sign Out
    </button>
  );
}
