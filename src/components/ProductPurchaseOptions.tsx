"use client";

import { useState } from "react";
import { ProductAddToCartButton } from "@/components/ProductAddToCartButton";

type VariantOption = {
  id: string;
  title: string;
};

type ProductPurchaseOptionsProps = {
  variants: VariantOption[];
  initialVariantId?: string;
};

export function ProductPurchaseOptions({
  variants,
  initialVariantId,
}: ProductPurchaseOptionsProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    initialVariantId ?? variants[0]?.id ?? ""
  );

  return (
    <div className="flex flex-col gap-3">
      {variants.length > 1 ? (
        <label className="text-xs uppercase tracking-[0.2em] muted">
          Size
          <select
            name="variant"
            value={selectedVariantId}
            onChange={(event) => setSelectedVariantId(event.target.value)}
            className="mt-2 w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground"
          >
            {variants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.title}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <ProductAddToCartButton variantId={selectedVariantId} />
    </div>
  );
}
