"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function TogglePublishButton({
  announcementId,
  currentStatus,
}: {
  announcementId: string;
  currentStatus: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/announcements/${announcementId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update announcement");
      }

      router.refresh();
    } catch (error) {
      console.error("Error toggling publish status:", error);
      alert("Failed to update announcement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="text-sm px-3 py-1 rounded bg-border/50 hover:bg-border transition-colors disabled:opacity-50"
      aria-label={currentStatus ? "Unpublish announcement" : "Publish announcement"}
    >
      {loading ? "..." : currentStatus ? "Unpublish" : "Publish"}
    </button>
  );
}
