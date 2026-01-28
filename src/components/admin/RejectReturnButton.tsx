"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface RejectReturnButtonProps {
  returnId: string;
}

export function RejectReturnButton({ returnId }: RejectReturnButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [reason, setReason] = useState("");
  const router = useRouter();

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/returns/${returnId}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reject return");
      }

      alert("Return rejected. Customer has been notified.");
      router.refresh();
      setShowForm(false);
    } catch (error) {
      console.error("Error rejecting return:", error);
      alert(
        error instanceof Error ? error.message : "Failed to reject return"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (showForm) {
    return (
      <form onSubmit={handleReject} className="flex gap-2 items-start">
        <div className="flex-1">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            placeholder="Reason for rejection (will be sent to customer)..."
            rows={3}
            className="w-full px-3 py-2 bg-background border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="submit"
            disabled={isLoading || !reason.trim()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            {isLoading ? "Rejecting..." : "Confirm Reject"}
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors"
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
      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition-colors"
    >
      Reject Return
    </button>
  );
}
