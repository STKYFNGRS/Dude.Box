"use client";

import { useState } from "react";

export function AddToCartButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label htmlFor="quantity" className="text-sm font-medium">
          Quantity
        </label>
        <input
          id="quantity"
          type="number"
          min="1"
          max="10"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          className="input w-20 text-center"
          disabled={loading}
        />
      </div>

      {success && (
        <div className="bg-emerald-500/10 text-emerald-500 p-3 rounded text-sm">
          Added to cart!
        </div>
      )}

      <button
        onClick={handleAddToCart}
        disabled={loading || success}
        className="solid-button rounded-full px-8 py-3 text-sm w-full disabled:opacity-50"
        aria-label={`Add ${productName} to cart`}
      >
        {loading ? "Adding..." : success ? "Added!" : "Add to Cart"}
      </button>

      <div className="text-xs text-muted-foreground text-center">
        Free shipping on orders over $50
      </div>
    </div>
  );
}
