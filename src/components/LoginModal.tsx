"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Login failed. Check your credentials.");
      setIsSubmitting(false);
      return;
    }

    // Success: close modal, header will update via useSession
    setEmail("");
    setPassword("");
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        aria-label="Close login modal"
        onClick={onClose}
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-md max-w-[calc(100vw-2rem)] mx-4">
        <div className="card rounded-lg p-6 bg-panel">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <span className="text-xs uppercase tracking-[0.3em] muted">Member Login</span>
            <button
              type="button"
              onClick={onClose}
              className="outline-button rounded px-3 py-2 text-xs uppercase tracking-[0.25em]"
            >
              Close
            </button>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-6">
            <label className="text-sm flex flex-col gap-2">
              Email
              <input
                className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <label className="text-sm flex flex-col gap-2">
              Password
              <input
                className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            {error ? <p className="text-sm text-red-400">{error}</p> : null}
            <div className="flex items-center justify-between">
              <a
                href="/portal/forgot-password"
                className="text-xs text-accent hover:text-foreground transition-colors"
              >
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="solid-button rounded px-4 py-2 text-sm uppercase tracking-[0.2em] disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
            <div className="pt-4 border-t border-border text-center">
              <p className="text-xs muted pb-2">Don't have an account?</p>
              <a
                href="/portal/register"
                className="text-xs uppercase tracking-[0.2em] text-accent hover:text-foreground transition-colors"
              >
                Create Account
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
