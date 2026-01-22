"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ShopProduct } from "@/lib/shopify";

type ShopProductCardProps = {
  product: ShopProduct;
};

export function ShopProductCard({ product }: ShopProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const variants = useMemo(() => product.variants ?? [], [product.variants]);
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variantId ?? variants[0]?.id ?? ""
  );

  const handleAddToCart = async () => {
    if (!selectedVariantId) {
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
          lines: [{ merchandiseId: selectedVariantId, quantity: 1 }],
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
      {variants.length > 1 ? (
        <label className="text-xs uppercase tracking-[0.2em] muted">
          Size
          <select
            className="mt-2 w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground"
            value={selectedVariantId}
            onChange={(event) => setSelectedVariantId(event.target.value)}
          >
            {variants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.title}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <div className="flex flex-col gap-2">
        {product.handle ? (
          <Link
            href={`/products/${product.handle}`}
            className="outline-button rounded px-4 py-2 text-xs uppercase tracking-[0.2em] text-center"
          >
            View Details
          </Link>
        ) : null}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAdding}
          className="solid-button rounded px-4 py-2 text-xs uppercase tracking-[0.2em] text-center disabled:opacity-60"
        >
          {isAdding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
      {message ? <div className="text-xs muted">{message}</div> : null}
    </div>
  );
}
