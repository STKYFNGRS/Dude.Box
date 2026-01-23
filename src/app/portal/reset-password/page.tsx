"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/Section";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Get reset token from URL (Shopify sends this)
  const resetToken = searchParams.get("token");
  const customerId = searchParams.get("id");

  useEffect(() => {
    if (!resetToken || !customerId) {
      setError("Invalid or missing reset link. Please request a new password reset.");
    }
  }, [resetToken, customerId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setIsSubmitting(false);
      return;
    }

    if (!resetToken || !customerId) {
      setError("Invalid reset link.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resetToken,
          customerId,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Unable to reset password.");
        setIsSubmitting(false);
        return;
      }

      setSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/portal/login");
      }, 3000);
    } catch (err) {
      setError("Unable to reset password. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col gap-10">
        <Section
          eyebrow="Password Reset"
          title="Password Updated"
          description="Your password has been successfully reset."
        />
        <div className="card rounded-lg p-6 max-w-lg">
          <p className="text-sm text-accent pb-4">Redirecting to login page...</p>
          <Link
            href="/portal/login"
            className="outline-button rounded px-4 py-2 text-xs uppercase tracking-[0.2em] inline-block text-center"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (error && (!resetToken || !customerId)) {
    return (
      <div className="flex flex-col gap-10">
        <Section
          eyebrow="Password Reset"
          title="Invalid Reset Link"
          description="This password reset link is invalid or has expired."
        />
        <div className="card rounded-lg p-6 max-w-lg">
          <p className="text-sm muted pb-4">
            Please request a new password reset link.
          </p>
          <Link
            href="/portal/forgot-password"
            className="solid-button rounded px-4 py-2 text-xs uppercase tracking-[0.2em] inline-block text-center"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <Section
        eyebrow="Password Reset"
        title="Set New Password"
        description="Enter your new password below."
      />
      <div className="card rounded-lg p-6 max-w-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-sm flex flex-col gap-2">
            New Password
            <input
              className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
              disabled={!resetToken || !customerId}
            />
            <span className="text-xs muted">Must be at least 8 characters</span>
          </label>
          <label className="text-sm flex flex-col gap-2">
            Confirm New Password
            <input
              className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              minLength={8}
              disabled={!resetToken || !customerId}
            />
          </label>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <button
            type="submit"
            disabled={isSubmitting || !resetToken || !customerId}
            className="solid-button rounded px-4 py-2 text-sm uppercase tracking-[0.2em] disabled:opacity-60"
          >
            {isSubmitting ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
