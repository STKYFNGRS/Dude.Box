"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteStoreButton({
  storeId,
  storeName,
}: {
  storeId: string;
  storeName: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you ABSOLUTELY SURE you want to permanently delete "${storeName}"? This will delete all products and orders associated with this store. This action CANNOT be undone!`)) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/admin/stores/${storeId}/delete`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete store");
      }

      router.push("/admin/stores");
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete store");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete Store"}
    </button>
  );
}
