"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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

    // Success: Refresh session and trigger cart association
    setEmail("");
    setPassword("");
    setIsSubmitting(false);
    
    // Trigger cart update event to associate customer
    window.dispatchEvent(new CustomEvent("user:login"));
    
    onClose();
  };

  const handleRegisterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Success: auto-login the user
      const loginResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (loginResult?.error) {
        setSuccessMessage("Account created! Please log in.");
        setMode("login");
        setPassword("");
        setFirstName("");
        setLastName("");
      } else {
        // Auto-logged in, close modal
        setEmail("");
        setPassword("");
        setFirstName("");
        setLastName("");
        onClose();
      }
    } catch (error) {
      setError("Unable to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in">
      <button
        type="button"
        aria-label="Close login modal"
        onClick={onClose}
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-md max-w-[calc(100vw-2rem)] mx-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <div className="card rounded-lg p-6 bg-panel shadow-card-hover">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <span className="text-xs uppercase tracking-[0.3em] muted">
              {mode === "login" ? "Member Login" : "Create Account"}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="outline-button rounded px-3 py-2 text-xs uppercase tracking-[0.25em]"
            >
              Close
            </button>
          </div>

          {successMessage ? (
            <div className="mt-4 p-3 bg-accent/20 border border-accent rounded text-sm text-foreground">
              {successMessage}
            </div>
          ) : null}

          {mode === "login" ? (
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4 pt-6">
              <label className="text-sm flex flex-col gap-2">
                <span className="font-semibold text-foreground">Email</span>
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </label>
              <label className="text-sm flex flex-col gap-2">
                <span className="font-semibold text-foreground">Password</span>
                <input
                  className="input"
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
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className="text-xs uppercase tracking-[0.2em] text-accent hover:text-foreground transition-colors"
                >
                  Create Account
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4 pt-6">
              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm flex flex-col gap-2">
                  <span className="font-semibold text-foreground">First Name</span>
                  <input
                    className="input"
                    type="text"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    required
                  />
                </label>
                <label className="text-sm flex flex-col gap-2">
                  <span className="font-semibold text-foreground">Last Name</span>
                  <input
                    className="input"
                    type="text"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    required
                  />
                </label>
              </div>
              <label className="text-sm flex flex-col gap-2">
                <span className="font-semibold text-foreground">Email</span>
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </label>
              <label className="text-sm flex flex-col gap-2">
                <span className="font-semibold text-foreground">Password</span>
                <input
                  className="input"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={8}
                />
                <span className="text-xs muted">Minimum 8 characters</span>
              </label>
              {error ? <p className="text-sm text-red-400">{error}</p> : null}
              <button
                type="submit"
                disabled={isSubmitting}
                className="solid-button rounded px-4 py-2 text-sm uppercase tracking-[0.2em] disabled:opacity-60"
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </button>
              <div className="pt-4 border-t border-border text-center">
                <p className="text-xs muted pb-2">Already have an account?</p>
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className="text-xs uppercase tracking-[0.2em] text-accent hover:text-foreground transition-colors"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
