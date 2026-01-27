"use client";

import { useState } from "react";

export function ManageSubscriptionButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/subscriptions/portal", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to access portal");
      }

      // Redirect to Stripe Customer Portal
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error accessing portal:", error);
      alert("Failed to access customer portal. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="text-accent hover:underline text-xs disabled:opacity-50"
    >
      {isLoading ? "Loading..." : "Manage Subscription →"}
    </button>
  );
}
