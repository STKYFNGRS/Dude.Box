"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function MarkAsShippedButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleMarkShipped = async () => {
    if (loading) return;

    const trackingNumber = prompt("Enter tracking number (optional):");
    if (trackingNumber === null) return; // User cancelled

    setLoading(true);
    try {
      const response = await fetch(`/api/vendor/orders/${orderId}/ship`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tracking_number: trackingNumber || null }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark as shipped");
      }

      router.refresh();
    } catch (error) {
      console.error("Error marking as shipped:", error);
      alert("Failed to mark as shipped");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleMarkShipped}
      disabled={loading}
      className="text-sm px-4 py-2 rounded bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 transition-colors disabled:opacity-50"
      aria-label="Mark order as shipped"
    >
      {loading ? "..." : "Mark as Shipped"}
    </button>
  );
}
