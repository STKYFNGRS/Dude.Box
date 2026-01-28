"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function HideProductButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleHide = async () => {
    if (loading) return;
    if (!confirm(`Hide "${productName}" from public view?`)) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/products/${productId}/hide`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to hide product");
      }

      router.refresh();
    } catch (error) {
      console.error("Error hiding product:", error);
      alert("Failed to hide product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleHide}
      disabled={loading}
      className="text-sm px-3 py-1 rounded bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors disabled:opacity-50"
      aria-label={`Hide product ${productName}`}
    >
      {loading ? "..." : "Hide"}
    </button>
  );
}
