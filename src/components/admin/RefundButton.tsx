"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface RefundButtonProps {
  returnId: string;
  orderTotal: number;
  orderId: string;
}

export function RefundButton({
  returnId,
  orderTotal,
  orderId,
}: RefundButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState(orderTotal.toString());
  const router = useRouter();

  const handleRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const refundAmount = parseFloat(amount);
    if (isNaN(refundAmount) || refundAmount <= 0) {
      alert("Please enter a valid refund amount");
      return;
    }

    if (refundAmount > orderTotal) {
      alert("Refund amount cannot exceed order total");
      return;
    }

    if (
      !confirm(
        `Issue refund of $${refundAmount.toFixed(2)}? This will be processed via Stripe.`
      )
    ) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/returns/${returnId}/refund`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: refundAmount }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to issue refund");
      }

      alert(
        `Refund of $${refundAmount.toFixed(2)} processed successfully! Customer has been notified.`
      );
      router.refresh();
      setShowForm(false);
    } catch (error) {
      console.error("Error issuing refund:", error);
      alert(error instanceof Error ? error.message : "Failed to issue refund");
    } finally {
      setIsLoading(false);
    }
  };

  if (showForm) {
    return (
      <form onSubmit={handleRefund} className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="block text-sm mb-2">Refund Amount</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            max={orderTotal}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full px-3 py-2 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <div className="text-xs muted mt-1">
            Order total: ${orderTotal.toFixed(2)}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            {isLoading ? "Processing..." : "Issue Refund"}
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
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
      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded font-medium transition-colors"
    >
      Issue Refund
    </button>
  );
}
