"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  const handleSignOut = async () => {
    try {
      // Clear cart association first
      await fetch("/api/auth/signout-handler", {
        method: "POST",
      });
    } catch (error) {
      // Continue with signout even if this fails
      console.error("Failed to clear cart:", error);
    }
    
    // Sign out of NextAuth
    signOut({ callbackUrl: "/" });
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="outline-button rounded px-4 py-2 text-xs uppercase tracking-[0.2em]"
    >
      Sign Out
    </button>
  );
}
