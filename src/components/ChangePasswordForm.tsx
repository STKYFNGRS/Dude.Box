"use client";

import { useState } from "react";

export function ChangePasswordForm() {
  const [isChanging, setIsChanging] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    // Validate password strength
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      setIsSubmitting(false);
      return;
    }

    // Validate new password is different from current
    if (currentPassword === newPassword) {
      setError("New password must be different from current password.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/customer/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to change password.");
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsChanging(false);
    } catch (error) {
      setError("Unable to change password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsChanging(false);
    setError(null);
    setSuccessMessage(null);
  };

  if (isChanging) {
    return (
      <form onSubmit={handleSubmit} className="text-sm space-y-4">
        <label className="text-sm flex flex-col gap-2">
          <span className="muted">Current Password</span>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground"
            required
            autoComplete="current-password"
          />
        </label>
        <label className="text-sm flex flex-col gap-2">
          <span className="muted">New Password</span>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground"
            required
            minLength={8}
            autoComplete="new-password"
          />
          <span className="text-xs muted">Must be at least 8 characters</span>
        </label>
        <label className="text-sm flex flex-col gap-2">
          <span className="muted">Confirm New Password</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </label>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="solid-button rounded px-4 py-2 text-xs uppercase tracking-[0.2em] disabled:opacity-60"
          >
            {isSubmitting ? "Changing..." : "Change Password"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="outline-button rounded px-4 py-2 text-xs uppercase tracking-[0.2em]"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="text-sm space-y-2">
      {successMessage ? (
        <div className="mb-3 p-2 bg-accent/20 border border-accent rounded text-sm">
          {successMessage}
        </div>
      ) : null}
      <div className="muted pb-2">
        Keep your account secure with a strong password.
      </div>
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setIsChanging(true)}
          aria-label="Change your password"
          className="text-xs uppercase tracking-[0.2em] text-accent hover:text-foreground transition-colors"
        >
          Change Password
        </button>
      </div>
    </div>
  );
}
