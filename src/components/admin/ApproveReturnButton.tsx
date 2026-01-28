"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ApproveReturnButtonProps {
  returnId: string;
}

export function ApproveReturnButton({ returnId }: ApproveReturnButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    if (
      !confirm(
        "Approve this return and generate shipping label? The customer will receive an email with the label."
      )
    ) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/returns/${returnId}/approve`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to approve return");
      }

      alert("Return approved! Shipping label generated and sent to customer.");
      router.refresh();
    } catch (error) {
      console.error("Error approving return:", error);
      alert(
        error instanceof Error ? error.message : "Failed to approve return"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleApprove}
      disabled={isLoading}
      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isLoading ? "Approving..." : "Approve & Generate Label"}
    </button>
  );
}
