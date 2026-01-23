"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="outline-button rounded px-4 py-2 text-xs uppercase tracking-[0.2em]"
    >
      Sign Out
    </button>
  );
}
