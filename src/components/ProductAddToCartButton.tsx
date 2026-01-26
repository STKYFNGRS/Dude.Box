"use client";

import { useState } from "react";

type ProductAddToCartButtonProps = {
  variantId?: string;
  className?: string;
  showMessage?: boolean;
};

export function ProductAddToCartButton({ 
  variantId, 
  className = "solid-button rounded-full px-6 py-3 text-xs uppercase tracking-[0.25em] w-full disabled:opacity-60",
  showMessage = true 
}: ProductAddToCartButtonProps) {
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
      
      console.log('[AddToCart] Adding to cart:', { variantId });
      
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "addLines",
          lines: [{ merchandiseId: variantId, quantity: 1 }],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[AddToCart] API error:', errorData);
        throw new Error("Unable to add to cart.");
      }

      const payload = await response.json();
      const totalQuantity = payload?.cart?.totalQuantity ?? 0;
      
      console.log('[AddToCart] Cart updated:', {
        totalQuantity,
        lineCount: payload?.cart?.lines?.nodes?.length,
        lines: payload?.cart?.lines?.nodes?.map((line: any) => ({
          quantity: line.quantity,
          product: line.merchandise?.product?.title
        }))
      });
      
      if (totalQuantity === 0) {
        console.warn('[AddToCart] Warning: Total quantity is 0 after adding item');
      }
      
      setMessage("Added to cart.");
      window.dispatchEvent(
        new CustomEvent("cart:updated", {
          detail: { totalQuantity },
        })
      );
    } catch (error) {
      console.error('[AddToCart] Error:', error);
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
        className={className}
      >
        {isAdding ? "Adding..." : "Add to Cart"}
      </button>
      {showMessage && message ? <div className="text-xs muted">{message}</div> : null}
    </div>
  );
}
