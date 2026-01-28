"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RejectStoreButton({
  storeId,
  storeName,
}: {
  storeId: string;
  storeName: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleReject = async () => {
    if (loading) return;
    
    const reason = prompt(`Rejection reason for "${storeName}":`);
    if (!reason) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/stores/${storeId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject store");
      }

      router.refresh();
    } catch (error) {
      console.error("Error rejecting store:", error);
      alert("Failed to reject store");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleReject}
      disabled={loading}
      className="text-sm px-4 py-2 rounded bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors disabled:opacity-50"
      aria-label={`Reject store ${storeName}`}
    >
      {loading ? "..." : "Reject"}
    </button>
  );
}
