"use client";

import { useState } from "react";

type ProductAddToCartButtonProps = {
  variantId?: string;
};

export function ProductAddToCartButton({ variantId }: ProductAddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleAddToCart = async () => {
    if (!variantId) {
      setMessage("Unavailable right now.");
      return;
    }

    try {
      setIsAdding(true);
      setMessage(null);
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "addLines",
          lines: [{ merchandiseId: variantId, quantity: 1 }],
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to add to cart.");
      }

      setMessage("Added to cart.");
      window.dispatchEvent(
        new CustomEvent("cart:updated", {
          detail: { totalQuantity: undefined },
        })
      );
    } catch (error) {
      setMessage("Unable to add to cart.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isAdding}
        className="solid-button rounded-full px-6 py-3 text-xs uppercase tracking-[0.25em] w-full disabled:opacity-60"
      >
        {isAdding ? "Adding..." : "Add to Cart"}
      </button>
      {message ? <div className="text-xs muted">{message}</div> : null}
    </div>
  );
}
