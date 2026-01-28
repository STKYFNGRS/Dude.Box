"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface UpdateReturnStatusButtonProps {
  returnId: string;
  newStatus: string;
  label: string;
}

export function UpdateReturnStatusButton({
  returnId,
  newStatus,
  label,
}: UpdateReturnStatusButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUpdate = async () => {
    if (!confirm(`${label}?`)) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/returns/${returnId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      alert("Status updated successfully!");
      router.refresh();
    } catch (error) {
      console.error("Error updating status:", error);
      alert(
        error instanceof Error ? error.message : "Failed to update status"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleUpdate}
      disabled={isLoading}
      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isLoading ? "Updating..." : label}
    </button>
  );
}
