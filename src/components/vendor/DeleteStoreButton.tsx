"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteStoreButton({ storeName }: { storeName: string }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirmText !== "DELETE") return;

    setIsDeleting(true);
    try {
      const response = await fetch("/api/vendor/store/delete", {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/members");
        router.refresh();
      } else {
        alert("Failed to delete store. Please contact support.");
      }
    } catch (error) {
      alert("An error occurred. Please try again or contact support.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-error text-white px-6 py-2 rounded-lg hover:bg-error/90 transition-colors font-medium"
      >
        Delete Store
      </button>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-lg max-w-md w-full p-6 space-y-4">
            <h2 className="text-xl font-bold text-error">Delete Store?</h2>
            
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">
                This will permanently delete "{storeName}" and:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>All your products</li>
                <li>Your custom subdomain</li>
                <li>Store customizations</li>
                <li>Order history (past orders remain in customer accounts)</li>
              </ul>
              <p className="text-error font-semibold">
                ⚠️ This action cannot be undone!
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Type <span className="font-mono font-bold">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="input w-full"
                placeholder="DELETE"
                disabled={isDeleting}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleDelete}
                disabled={confirmText !== "DELETE" || isDeleting}
                className="flex-1 bg-error text-white px-4 py-2 rounded-lg hover:bg-error/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isDeleting ? "Deleting..." : "Delete Store"}
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setConfirmText("");
                }}
                className="flex-1 outline-button rounded-lg px-4 py-2"
                disabled={isDeleting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
