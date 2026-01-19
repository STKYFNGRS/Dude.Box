"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export function MemberLoginForm() {
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
      callbackUrl: "/portal",
    });

    if (result?.error) {
      setError("Login failed. Check your credentials.");
      setIsSubmitting(false);
      return;
    }

    window.location.href = "/portal";
  };

  return (
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
      <button
        type="submit"
        disabled={isSubmitting}
        className="solid-button rounded px-4 py-2 text-sm uppercase tracking-[0.2em]"
      >
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>
      <p className="text-xs muted">
        TODO: Replace credentials auth with database-backed members and hashed passwords.
      </p>
    </form>
  );
}
