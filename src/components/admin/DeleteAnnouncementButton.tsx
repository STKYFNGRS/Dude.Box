"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteAnnouncementButton({
  announcementId,
  title,
}: {
  announcementId: string;
  title: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (loading) return;

    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/announcements/${announcementId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete announcement");
      }

      router.refresh();
    } catch (error) {
      console.error("Error deleting announcement:", error);
      alert("Failed to delete announcement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-sm px-3 py-1 rounded bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors disabled:opacity-50"
      aria-label={`Delete announcement ${title}`}
    >
      {loading ? "..." : "Delete"}
    </button>
  );
}
