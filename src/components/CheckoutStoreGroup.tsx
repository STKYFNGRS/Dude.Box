"use client";

import { useState } from "react";
import Link from "next/link";

interface Item {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: any;
    description: string | null;
  };
}

interface Store {
  id: string;
  name: string;
  subdomain: string;
}

export function CheckoutStoreGroup({
  store,
  items,
  total,
  storeNumber,
  totalStores,
}: {
  store: Store;
  items: Item[];
  total: number;
  storeNumber: number;
  totalStores: number;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    setLoading(true);
    setError("");

    try {
      // Create checkout session for this store's products
      const response = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storeId: store.id,
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setLoading(false);
    }
  };

  return (
    <div className="card rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">
            {totalStores > 1 && `${storeNumber}. `}
            <Link
              href={`/stores/${store.subdomain}`}
              className="hover:text-primary transition-colors"
            >
              {store.name}
            </Link>
          </h2>
          <p className="text-sm text-muted-foreground">
            {store.subdomain}.dude.box
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">${total.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground">
            (${(total * 0.9).toFixed(2)} to vendor)
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between pb-3 border-b border-border last:border-0"
          >
            <div className="flex-1">
              <div className="font-medium">{item.product.name}</div>
              {item.product.description && (
                <div className="text-sm text-muted-foreground mt-1 line-clamp-1">
                  {item.product.description}
                </div>
              )}
              <div className="text-sm text-muted-foreground mt-1">
                Quantity: {item.quantity}
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">
                $
                {(
                  parseFloat(item.product.price.toString()) * item.quantity
                ).toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">
                ${item.product.price.toString()} each
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-500 p-3 rounded text-sm mb-4">
          {error}
        </div>
      )}

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="solid-button rounded-full px-8 py-3 text-sm w-full disabled:opacity-50"
      >
        {loading ? "Processing..." : `Checkout ${store.name}`}
      </button>
    </div>
  );
}
