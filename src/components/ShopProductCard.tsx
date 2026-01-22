"use client";

import { useState } from "react";
import type { ShopProduct } from "@/lib/shopify";

type ShopProductCardProps = {
  product: ShopProduct;
};

export function ShopProductCard({ product }: ShopProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleAddToCart = async () => {
    if (!product.variantId) {
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
          lines: [{ merchandiseId: product.variantId, quantity: 1 }],
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to add to cart.");
      }

      setMessage("Added to cart.");
    } catch (error) {
      setMessage("Unable to add to cart.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="card rounded-lg p-6 flex flex-col gap-4">
      <div className="text-xs uppercase tracking-[0.3em] muted">Limited drop</div>
      {product.image ? (
        <div className="border border-border rounded overflow-hidden bg-background">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-40 object-cover"
            loading="lazy"
          />
        </div>
      ) : null}
      <h3 className="section-title text-xl">{product.title}</h3>
      <p className="text-sm muted">{product.description}</p>
      <div className="text-sm">{product.price}</div>
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isAdding}
        className="outline-button rounded px-4 py-2 text-xs uppercase tracking-[0.2em] text-center disabled:opacity-60"
      >
        {isAdding ? "Adding..." : "Add to Cart"}
      </button>
      {message ? <div className="text-xs muted">{message}</div> : null}
    </div>
  );
}
