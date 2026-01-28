"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SuspendStoreButton({
  storeId,
  storeName,
}: {
  storeId: string;
  storeName: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSuspend = async () => {
    if (loading) return;
    if (!confirm(`Suspend store "${storeName}"? This will make it inaccessible.`)) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/stores/${storeId}/suspend`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to suspend store");
      }

      router.refresh();
    } catch (error) {
      console.error("Error suspending store:", error);
      alert("Failed to suspend store");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSuspend}
      disabled={loading}
      className="text-sm px-4 py-2 rounded bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 transition-colors disabled:opacity-50"
      aria-label={`Suspend store ${storeName}`}
    >
      {loading ? "..." : "Suspend"}
    </button>
  );
}
