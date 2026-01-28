"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ApproveStoreButton({
  storeId,
  storeName,
}: {
  storeId: string;
  storeName: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    if (loading) return;
    if (!confirm(`Approve store "${storeName}"?`)) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/stores/${storeId}/approve`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to approve store");
      }

      router.refresh();
    } catch (error) {
      console.error("Error approving store:", error);
      alert("Failed to approve store");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleApprove}
      disabled={loading}
      className="text-sm px-4 py-2 rounded bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 transition-colors disabled:opacity-50"
      aria-label={`Approve store ${storeName}`}
    >
      {loading ? "..." : "Approve"}
    </button>
  );
}
