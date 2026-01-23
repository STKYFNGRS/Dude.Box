"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Section } from "@/components/Section";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password,
          firstName,
          lastName,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Unable to create account.");
        setIsSubmitting(false);
        return;
      }

      // Account created successfully
      setSuccess(true);

      // Auto-login after 2 seconds
      setTimeout(async () => {
        await signIn("credentials", {
          email: email.toLowerCase().trim(),
          password,
          redirect: true,
          callbackUrl: "/portal",
        });
      }, 2000);
    } catch (err) {
      setError("Unable to create account. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col gap-10">
        <Section
          eyebrow="Account Created"
          title="Welcome to Dude.Box"
          description="Your account has been created successfully. Redirecting to your portal..."
        />
        <div className="card rounded-lg p-6 max-w-lg">
          <p className="text-sm text-accent">Logging you in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <Section
        eyebrow="Member Portal"
        title="Create Account"
        description="Join the veteran circular economy."
      />
      <div className="card rounded-lg p-6 max-w-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm flex flex-col gap-2">
              First Name
              <input
                className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground"
                type="text"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                required
              />
            </label>
            <label className="text-sm flex flex-col gap-2">
              Last Name
              <input
                className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground"
                type="text"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                required
              />
            </label>
          </div>
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
              minLength={8}
            />
            <span className="text-xs muted">Must be at least 8 characters</span>
          </label>
          <label className="text-sm flex flex-col gap-2">
            Confirm Password
            <input
              className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              minLength={8}
            />
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
            <Link
              href="/portal/login"
              className="text-xs uppercase tracking-[0.2em] text-accent hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
