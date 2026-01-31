"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "./ImageUpload";

export function CreateProductForm({ storeId }: { storeId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");
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
          image_url: imageUrl || null,
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
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-error/10 text-error border border-error/20 p-4 rounded-lg text-sm animate-fade-in flex items-start gap-3">
          <span className="text-xl flex-shrink-0">✗</span>
          <span>{error}</span>
        </div>
      )}

      <div>
        <ImageUpload
          endpoint="productImage"
          value={imageUrl}
          onChange={setImageUrl}
          label="Product Image"
          description="Upload a clear image of your product. Max 8MB. JPG, PNG, or WebP."
          previewHeight="h-64"
        />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-semibold mb-2 text-foreground">
          Product Name <span className="text-error">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input w-full text-base"
          placeholder="Enter product name"
          required
          maxLength={200}
          disabled={loading}
        />
        <p className="text-xs text-muted mt-2">{formData.name.length}/200 characters</p>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-semibold mb-2 text-foreground"
        >
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="input w-full text-base"
          rows={6}
          placeholder="Describe your product, its features, materials, dimensions, etc."
          maxLength={2000}
          disabled={loading}
        />
        <p className="text-xs text-muted mt-2">{formData.description.length}/2000 characters</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="price" className="block text-sm font-semibold mb-2 text-foreground">
            Price <span className="text-error">*</span>
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-muted font-medium text-base pointer-events-none">$</span>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="input w-full pl-14 text-base font-medium"
              placeholder="0.00"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="interval" className="block text-sm font-semibold mb-2 text-foreground">
            Product Type
          </label>
          <select
            id="interval"
            value={formData.interval}
            onChange={(e) =>
              setFormData({ ...formData, interval: e.target.value })
            }
            className="input w-full text-base"
            disabled={loading}
          >
            <option value="one_time">🛒 One-time Purchase</option>
            <option value="month">📅 Monthly Subscription</option>
          </select>
        </div>
      </div>

      <div className="card rounded-lg p-4 bg-background/50">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            id="active"
            type="checkbox"
            checked={formData.active}
            onChange={(e) =>
              setFormData({ ...formData, active: e.target.checked })
            }
            className="w-5 h-5 rounded border-2 border-border checked:bg-success checked:border-success transition-all"
            disabled={loading}
          />
          <div>
            <div className="text-sm font-semibold text-foreground">
              Make product active immediately
            </div>
            <div className="text-xs text-muted">
              Active products are visible to customers on your storefront
            </div>
          </div>
        </label>
      </div>

      <div className="flex gap-3 pt-4 border-t border-border">
        <button
          type="submit"
          className="solid-button rounded-full px-8 py-3 text-sm font-bold shadow-button"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
              Creating Product...
            </span>
          ) : (
            "Create Product →"
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push("/vendor/products")}
          className="outline-button rounded-full px-8 py-3 text-sm font-semibold"
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
