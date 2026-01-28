"use client";

import { useState } from "react";

interface RequestReturnButtonProps {
  orderId: string;
  orderNumber: string;
}

export function RequestReturnButton({
  orderId,
  orderNumber,
}: RequestReturnButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/orders/return-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          reason,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit return request");
      }

      setSubmitted(true);
      setShowForm(false);
    } catch (error) {
      console.error("Error submitting return request:", error);
      alert("Failed to submit return request. Please try again or contact support.");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-xs text-green-400">
        ✓ Return request submitted. We'll contact you shortly.
      </div>
    );
  }

  if (showForm) {
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="reason" className="block text-xs muted mb-2">
            Reason for return:
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            rows={3}
            className="w-full px-3 py-2 bg-background border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Please tell us why you'd like to return this order..."
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isLoading || !reason.trim()}
            className="text-accent hover:underline text-xs disabled:opacity-50"
          >
            {isLoading ? "Submitting..." : "Submit Request"}
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="text-muted hover:text-foreground text-xs"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <button
      onClick={() => setShowForm(true)}
      aria-label={`Request return for order ${orderNumber}`}
      className="text-accent hover:underline text-xs"
    >
      Request Return →
    </button>
  );
}
