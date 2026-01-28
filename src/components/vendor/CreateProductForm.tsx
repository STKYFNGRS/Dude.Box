"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CreateProductForm({ storeId }: { storeId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    interval: "one_time",
    active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/vendor/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          storeId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create product");
      }

      router.push("/vendor/products");
      router.refresh();
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

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Product Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input w-full"
          required
          maxLength={200}
          disabled={loading}
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="input w-full"
          rows={5}
          maxLength={2000}
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-2">
            Price <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm">$</span>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="input flex-1"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="interval" className="block text-sm font-medium mb-2">
            Product Type
          </label>
          <select
            id="interval"
            value={formData.interval}
            onChange={(e) =>
              setFormData({ ...formData, interval: e.target.value })
            }
            className="input w-full"
            disabled={loading}
          >
            <option value="one_time">One-time Purchase</option>
            <option value="month">Monthly Subscription</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="active"
          type="checkbox"
          checked={formData.active}
          onChange={(e) =>
            setFormData({ ...formData, active: e.target.checked })
          }
          className="rounded"
          disabled={loading}
        />
        <label htmlFor="active" className="text-sm font-medium">
          Active (visible to customers)
        </label>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="solid-button rounded-full px-8 py-3 text-sm"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/vendor/products")}
          className="outline-button rounded-full px-8 py-3 text-sm"
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
