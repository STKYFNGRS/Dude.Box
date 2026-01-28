"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Store {
  id: string;
  name: string;
  description: string | null;
  contact_email: string;
  shipping_policy: string | null;
  return_policy: string | null;
}

export function EditStoreForm({ store }: { store: Store }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: store.name,
    description: store.description || "",
    contact_email: store.contact_email,
    shipping_policy: store.shipping_policy || "",
    return_policy: store.return_policy || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/vendor/store", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update store");
      }

      setSuccess(true);
      router.refresh();
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 text-red-500 p-3 rounded text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-500/10 text-emerald-500 p-3 rounded text-sm">
          Store updated successfully!
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Store Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input w-full"
          required
          maxLength={100}
          disabled={loading}
        />
      </div>

      <div>
        <label
          htmlFor="contact_email"
          className="block text-sm font-medium mb-2"
        >
          Contact Email <span className="text-red-500">*</span>
        </label>
        <input
          id="contact_email"
          type="email"
          value={formData.contact_email}
          onChange={(e) =>
            setFormData({ ...formData, contact_email: e.target.value })
          }
          className="input w-full"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium mb-2"
        >
          Store Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="input w-full"
          rows={4}
          maxLength={1000}
          disabled={loading}
        />
      </div>

      <div>
        <label
          htmlFor="shipping_policy"
          className="block text-sm font-medium mb-2"
        >
          Shipping Policy
        </label>
        <textarea
          id="shipping_policy"
          value={formData.shipping_policy}
          onChange={(e) =>
            setFormData({ ...formData, shipping_policy: e.target.value })
          }
          className="input w-full"
          rows={3}
          maxLength={1000}
          disabled={loading}
        />
      </div>

      <div>
        <label
          htmlFor="return_policy"
          className="block text-sm font-medium mb-2"
        >
          Return Policy
        </label>
        <textarea
          id="return_policy"
          value={formData.return_policy}
          onChange={(e) =>
            setFormData({ ...formData, return_policy: e.target.value })
          }
          className="input w-full"
          rows={3}
          maxLength={1000}
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        className="solid-button rounded-full px-8 py-3 text-sm"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
