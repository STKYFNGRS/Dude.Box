"use client";

import { useState } from "react";
import Link from "next/link";
import { Section } from "@/components/Section";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/recover", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Unable to process request.");
        setIsSubmitting(false);
        return;
      }

      // Always show success for security (don't reveal if email exists)
      setSuccess(true);
    } catch (err) {
      setError("Unable to process request. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col gap-10">
        <Section
          eyebrow="Password Recovery"
          title="Check Your Email"
          description="If an account exists with that email, we've sent password reset instructions."
        />
        <div className="card rounded-lg p-6 max-w-lg">
          <p className="text-sm muted pb-4">
            Please check your inbox and follow the instructions to reset your password.
          </p>
          <Link
            href="/portal/login"
            className="outline-button rounded px-4 py-2 text-xs uppercase tracking-[0.2em] inline-block text-center"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <Section
        eyebrow="Password Recovery"
        title="Reset Your Password"
        description="Enter your email address and we'll send you recovery instructions."
      />
      <div className="card rounded-lg p-6 max-w-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="solid-button rounded px-4 py-2 text-sm uppercase tracking-[0.2em] disabled:opacity-60"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
          <div className="pt-4 border-t border-border text-center">
            <Link
              href="/portal/login"
              className="text-xs uppercase tracking-[0.2em] text-accent hover:text-foreground transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
