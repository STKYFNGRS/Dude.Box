"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function FlagProductButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleFlag = async () => {
    if (loading) return;

    const reason = prompt(`Reason for flagging "${productName}":`);
    if (!reason) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/products/${productId}/flag`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error("Failed to flag product");
      }

      router.refresh();
    } catch (error) {
      console.error("Error flagging product:", error);
      alert("Failed to flag product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFlag}
      disabled={loading}
      className="text-sm px-3 py-1 rounded bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 transition-colors disabled:opacity-50"
      aria-label={`Flag product ${productName}`}
    >
      {loading ? "..." : "Flag"}
    </button>
  );
}
