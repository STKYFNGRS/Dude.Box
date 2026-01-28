"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignOutButton } from "@/components/SignOutButton";

type EditProfileFormProps = {
  firstName: string;
  lastName: string;
  email: string;
};

export function EditProfileForm({ firstName, lastName, email }: EditProfileFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formFirstName, setFormFirstName] = useState(firstName);
  const [formLastName, setFormLastName] = useState(lastName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/customer/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formFirstName.trim(),
          lastName: formLastName.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to update profile.");
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      setError("Unable to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormFirstName(firstName);
    setFormLastName(lastName);
    setIsEditing(false);
    setError(null);
    setSuccessMessage(null);
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="text-sm space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm flex flex-col gap-2">
            <span className="muted">First Name</span>
            <input
              type="text"
              value={formFirstName}
              onChange={(e) => setFormFirstName(e.target.value)}
              className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground"
              required
            />
          </label>
          <label className="text-sm flex flex-col gap-2">
            <span className="muted">Last Name</span>
            <input
              type="text"
              value={formLastName}
              onChange={(e) => setFormLastName(e.target.value)}
              className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground"
              required
            />
          </label>
        </div>
        <div>
          <span className="muted">Email:</span> {email}
        </div>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="solid-button rounded px-4 py-2 text-xs uppercase tracking-[0.2em] disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
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
      <div>
        <span className="muted">Name:</span> {firstName} {lastName}
      </div>
      <div>
        <span className="muted">Email:</span> {email}
      </div>
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          aria-label="Edit your profile information"
          className="text-xs uppercase tracking-[0.2em] text-accent hover:text-foreground transition-colors"
        >
          Edit Profile
        </button>
        <SignOutButton />
      </div>
    </div>
  );
}
